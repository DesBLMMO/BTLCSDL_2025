from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base # Import Base từ file database.py

# Định nghĩa các mô hình bảng trong cơ sở dữ liệu

class Department(Base):
    """
    Bảng Bộ phận quản lý (BOPHANQUANLY)
    MaBPQL: Khóa chính, mã bộ phận quản lý (String)
    TenBPQL: Tên bộ phận quản lý (String)
    SDT: Số điện thoại (String)
    """
    __tablename__ = "departments"
    id = Column(String(255), primary_key=True, index=True) # MaBPQL - Changed to String
    name = Column(String(100), nullable=False) # TenBPQL
    phone = Column(String(20)) # SDT

    # Mối quan hệ 1-n: Một bộ phận quản lý có nhiều nhân viên
    employees_rel = relationship("Employee", back_populates="department_rel")

class Employee(Base):
    """
    Bảng Nhân viên (NHANVIEN)
    MaNV: Khóa chính, mã nhân viên (String)
    TenNV: Tên nhân viên (String)
    GioitinhNV: Giới tính nhân viên (String)
    DiaChi: Địa chỉ nhân viên (String)
    SodienthoaiNV: Số điện thoại nhân viên (String)
    MaBPQL: Khóa ngoại tham chiếu đến BOPHANQUANLY (String)
    """
    __tablename__ = "employees"
    id = Column(String(255), primary_key=True, index=True) # MaNV - Changed to String
    name = Column(String(255), index=True, nullable=False) # TenNV
    gender = Column(String(10)) # GioitinhNV
    phone = Column(String(20)) # SodienthoaiNV
    address = Column(String(255)) # DiaChi
    position = Column(String(100)) # Thêm cột chức vụ
    revenue_contribution = Column(Float, default=0.0) # Trường tính toán

    # Khóa ngoại đến bảng departments (MaBPQL) - Changed to String
    department_id = Column(String(255), ForeignKey("departments.id"), nullable=True)
    department_rel = relationship("Department", back_populates="employees_rel")

    # Mối quan hệ 1-n: Một nhân viên có thể thực hiện nhiều giao dịch
    transactions = relationship("Transaction", back_populates="employee_rel")

class Customer(Base):
    """
    Bảng Khách hàng (KHACHHANG)
    MaKH: Khóa chính, mã khách hàng (String)
    TenKH: Tên khách hàng (String)
    DiaChi: Địa chỉ khách hàng (String)
    SDT: Số điện thoại khách hàng (String)
    """
    __tablename__ = "customers"
    id = Column(String(255), primary_key=True, index=True) # MaKH - Changed to String
    name = Column(String(255), index=True, nullable=False) # TenKH
    phone = Column(String(20)) # SDT
    address = Column(String(255)) # DiaChi

    # Mối quan hệ 1-n: Một khách hàng có thể có nhiều giao dịch xuất
    transactions = relationship("Transaction", back_populates="customer_rel")

class Supplier(Base):
    """
    Bảng Nhà cung cấp (NHACUNGCAP)
    MaNCC: Khóa chính, mã nhà cung cấp (String)
    TenNCC: Tên nhà cung cấp (String)
    DiaChi: Địa chỉ nhà cung cấp (String)
    SDT: Số điện thoại nhà cung cấp (String)
    """
    __tablename__ = "suppliers"
    id = Column(String(255), primary_key=True, index=True) # MaNCC - Changed to String
    name = Column(String(255), index=True, nullable=False) # TenNCC
    contactPerson = Column(String(255)) # Người liên hệ
    phone = Column(String(20)) # SDT
    email = Column(String(255), nullable=True) # Email
    address = Column(String(255)) # DiaChi

    # Mối quan hệ 1-n: Một nhà cung cấp có thể có nhiều giao dịch nhập
    transactions = relationship("Transaction", back_populates="supplier_rel")

class Product(Base):
    """
    Bảng Sản phẩm (SANPHAM)
    MaSP: Khóa chính, mã sản phẩm (String)
    TenSP: Tên sản phẩm (String) - UNIQUE
    XuatXu: Nơi xuất xứ (String)
    stock: Số lượng tồn kho (Integer)
    GiaNhap: Giá nhập (Float)
    price: Giá bán (Float)
    NgaySX: Ngày sản xuất (Date)
    HanSD: Hạn sử dụng (Date)
    category: Loại sản phẩm (String)
    """
    __tablename__ = "products"
    id = Column(String(255), primary_key=True, index=True) # MaSP - Changed to String
    name = Column(String(255), unique=True, nullable=False) # TenSP - UNIQUE
    XuatXu = Column(String(255)) # XuatXu
    stock = Column(Integer, default=0) # Stock
    GiaNhap = Column(Float) # GiaNhap
    price = Column(Float) # GiaBan
    NgaySX = Column(Date) # NgaySX
    HanSD = Column(Date) # HanSD
    category = Column(String(100), nullable=True) # Loại sản phẩm

    # Mối quan hệ 1-n: Một sản phẩm có thể có nhiều giao dịch (nhập/xuất)
    transactions = relationship("Transaction", back_populates="product_rel")
    # Mối quan hệ 1-n: Một sản phẩm có thể nằm trong nhiều mục tồn kho
    inventory_items = relationship("Inventory", back_populates="product_rel")


class Transaction(Base):
    """
    Bảng Giao dịch (Tổng hợp từ PHIEUNHAP và PHIEUXUAT)
    MaPhieu: Khóa chính, mã phiếu (String)
    type: Loại giao dịch ('import' hoặc 'export') (String)
    MaSP: Khóa ngoại đến SANPHAM (String)
    MaNV: Khóa ngoại đến NHANVIEN (String)
    SL: Số lượng sản phẩm trong giao dịch (Integer)
    price: Đơn giá tại thời điểm giao dịch (Float)
    NgayGiaoDich: Ngày giao dịch (Date)
    MaNCC: Khóa ngoại đến NHACUNGCAP (String) - Nullable nếu là giao dịch xuất
    MaKH: Khóa ngoại đến KHACHHANG (String) - Nullable nếu là giao dịch nhập
    """
    __tablename__ = "transactions"
    id = Column(String(255), primary_key=True, index=True) # MaPhieu - Changed to String
    type = Column(String(10), nullable=False) # 'import' or 'export'

    product_id = Column(String(255), ForeignKey("products.id"), nullable=False) # MaSP - Changed to String
    employee_id = Column(String(255), ForeignKey("employees.id"), nullable=False) # MaNV - Changed to String
    quantity = Column(Integer, nullable=False) # SL
    price = Column(Float, nullable=False) # Đơn giá tại thời điểm giao dịch
    date = Column(Date, nullable=False) # NgayGiaoDich

    # Khóa ngoại đến nhà cung cấp (chỉ cho phiếu nhập) - Changed to String
    supplier_id = Column(String(255), ForeignKey("suppliers.id"), nullable=True) # MaNCC
    # Khóa ngoại đến khách hàng (chỉ cho phiếu xuất) - Changed to String
    customer_id = Column(String(255), ForeignKey("customers.id"), nullable=True) # MaKH

    # Relationships
    product_rel = relationship("Product", back_populates="transactions")
    employee_rel = relationship("Employee", back_populates="transactions")
    supplier_rel = relationship("Supplier", back_populates="transactions")
    customer_rel = relationship("Customer", back_populates="transactions")


class Warehouse(Base):
    """
    Bảng Kho (KHO)
    MaKho: Khóa chính, mã kho (String)
    TenKho: Tên kho (String)
    DiaChi: Địa chỉ kho (String)
    Capacity: Sức chứa (Integer)
    """
    __tablename__ = "warehouses"
    id = Column(String(255), primary_key=True, index=True) # MaKho - Changed to String
    name = Column(String(255), unique=True, index=True, nullable=False) # TenKho
    location = Column(String(255)) # DiaChi
    capacity = Column(Integer) # Capacity

    # Mối quan hệ 1-n: Một kho có nhiều mục tồn kho
    inventory_items = relationship("Inventory", back_populates="warehouse_rel")

class Inventory(Base):
    """
    Bảng Tồn kho (Mapping mối quan hệ n-n giữa KHO và SANPHAM)
    product_id: Khóa ngoại đến SANPHAM (String), một phần của khóa chính kép
    warehouse_id: Khóa ngoại đến KHO (String), một phần của khóa chính kép
    stock: Số lượng tồn kho của sản phẩm tại kho cụ thể (Integer)
    """
    __tablename__ = "inventory"
    # Khóa chính kép: kết hợp product_id và warehouse_id - Changed to String
    product_id = Column(String(255), ForeignKey("products.id"), primary_key=True) # MaSP
    warehouse_id = Column(String(255), ForeignKey("warehouses.id"), primary_key=True) # MaKho
    stock = Column(Integer) # SLTonKho

    # Mối quan hệ N-1: Nhiều mục tồn kho thuộc về một sản phẩm
    product_rel = relationship("Product", back_populates="inventory_items")
    # Mối quan hệ N-1: Nhiều mục tồn kho thuộc về một kho
    warehouse_rel = relationship("Warehouse", back_populates="inventory_items")

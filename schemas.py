from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any # Import Dict và Any
from typing import List, Optional, Dict, Any, Literal
from datetime import date as Date
from typing import Optional, Literal
from datetime import date as Date # Đảm bảo bạn đã import Date đúng cách
from pydantic import BaseModel, Field
import re # Import module re cho alias_generator

# Hàm chuyển đổi snake_case sang camelCase (Pydantic sẽ dùng để map ngược)
def to_camel(string: str) -> str:
    return re.sub(r"(_[a-z])", lambda x: x.group(1)[1].upper(), string)

# Base Schema cho Product
class ProductBase(BaseModel):
    name: str = Field(..., example="Laptop Gaming ABC")
    category: Optional[str] = Field(None, example="Electronics")
    price: float = Field(..., example=25000000.0)
    XuatXu: str = Field(..., example="Trung Quốc")
    GiaNhap: float = Field(..., example=20000000.0)
    NgaySX: Optional[Date] = Field(None, example="2023-01-15")
    HanSD: Optional[Date] = Field(None, example="2028-01-15")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    XuatXu: Optional[str] = None
    GiaNhap: Optional[float] = None
    NgaySX: Optional[Date] = None
    HanSD: Optional[Date] = None

class Product(ProductBase):
    id: str
    stock: int

    class Config:
        from_attributes = True

# Base Schema cho Employee
class EmployeeBase(BaseModel):
    name: str = Field(..., example="Nguyễn Văn A")
    gender: str = Field(..., example="Nam")
    phone: str = Field(..., example="0901112222")
    address: str = Field(..., example="123 Cầu Giấy, Hà Nội")
    position: str = Field(..., example="Quản lý kho")

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    position: Optional[str] = None

class Employee(EmployeeBase):
    id: str
    revenue_contribution: float = Field(0.0, example=120000000.0)
    
    class Config:
        from_attributes = True

# Base Schema cho Supplier
class SupplierBase(BaseModel):
    name: str = Field(..., example="Công ty TNHH Linh kiện Phương Nam")
    contactPerson: str = Field(..., example="Nguyễn Bách")
    phone: str = Field(..., example="0901234567")
    email: Optional[EmailStr] = Field(None, example="phuongnam@example.com")
    address: str = Field(..., example="123 Đường ABC, TP.HCM")

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contactPerson: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None

class Supplier(SupplierBase):
    id: str
    class Config:
        from_attributes = True

# Base Schema cho Customer
class CustomerBase(BaseModel):
    name: str = Field(..., example="Nguyễn Thị D")
    phone: str = Field(..., example="0912345678")
    address: str = Field(..., example="789 Giải Phóng, Hà Nội")

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class Customer(CustomerBase):
    id: str
    class Config:
        from_attributes = True

# New: Order schema for customer (chỉ dùng cho mục đích đọc báo cáo đơn hàng của khách hàng)
class OrderForCustomer(BaseModel):
    id: str
    product_id: str # Đã sửa
    quantity: int
    totalAmount: float
    date: Date

    class Config:
        from_attributes = True

# Base Schema cho Transaction (ĐÃ SỬA CÁC TÊN TRƯỜNG TỪ camelCase SANG snake_case)
class TransactionBase(BaseModel):
    type: Literal["import", "export"]
    product_id: str # Đã sửa từ productId
    quantity: int
    date: Date
    employee_id: str # Đã sửa từ employeeId
    supplier_id: Optional[str] = None # Đã sửa từ supplierId
    customer_id: Optional[str] = None # Đã sửa từ customerId
    price: float

    class Config :
        populate_by_name = True
        alias_generator = to_camel
class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    product_id: Optional[str] = None
    quantity: Optional[int] = None
    date: Optional[Date] = None
    employee_id: Optional[str] = None
    supplier_id: Optional[str] = None
    customer_id: Optional[str] = None
    price: Optional[float] = None

class Transaction(TransactionBase):
    id: str
    # totalAmount: Optional[float] = None # Trường này có thể tính toán từ quantity * price
    
    class Config:
        from_attributes = True
        populate_by_name = True
        alias_generator = to_camel
# Base Schema cho Warehouse
class WarehouseBase(BaseModel):
    name: str
    location: str
    capacity: int

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None

class Warehouse(WarehouseBase):
    id: str
    class Config:
        from_attributes = True

# Base Schema cho Inventory
class InventoryBase(BaseModel):
    product_id: str # Đã sửa từ productId
    warehouse_id: str # Đã sửa từ warehouseId
    stock: int

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    stock: Optional[int] = None

class Inventory(InventoryBase):
    class Config:
        from_attributes = True

# Base Schema cho Department
class DepartmentBase(BaseModel):
    name: str
    phone: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class Department(DepartmentBase):
    id: str
    class Config:
        from_attributes = True

# Dashboard Stats
class DashboardStats(BaseModel):
    totalProducts: int
    totalRevenueLastMonth: float
    pendingTransactions: int
    topSellingProduct: str
    newOrders: int
    totalInventoryValue: float


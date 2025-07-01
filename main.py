from fastapi import FastAPI, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, String
from database import SessionLocal, engine
import models
import schemas
from fastapi.middleware.cors import CORSMiddleware
import datetime
import uuid
from typing import List, Optional, Dict, Any

# Đảm bảo tất cả các bảng trong cơ sở dữ liệu được tạo NGAY KHI module được tải.
# Điều này khắc phục lỗi "Table doesn't exist" trong quá trình khởi động.
models.Base.metadata.create_all(bind=engine)

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="WMS API",
    description="API cho hệ thống quản lý kho (Warehouse Management System) với MySQL",
    version="1.0.0"
)

# Cấu hình CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency để lấy session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Logic tạo dữ liệu mẫu khi khởi động ứng dụng ---
def create_initial_data(db: Session):
    # Kiểm tra xem có bất kỳ dữ liệu nào trong bảng Department không.
    # Nếu không có, giả định rằng database trống và cần tạo dữ liệu mẫu.
    if db.query(models.Department).first() is None:
        print("Kiểm tra database và tạo dữ liệu mẫu ban đầu (nếu cần)...")
        
        # Xóa tất cả dữ liệu hiện có trong các bảng (quan trọng để tránh trùng lặp sau khi tạo lại bảng)
        # Sắp xếp thứ tự xóa theo mối quan hệ khóa ngoại (bảng con trước, bảng cha sau)
        print("  Đang xóa dữ liệu cũ (nếu có)...")
        db.query(models.Transaction).delete()
        db.query(models.Inventory).delete()
        db.query(models.Product).delete()
        db.query(models.Employee).delete()
        db.query(models.Supplier).delete()
        db.query(models.Customer).delete()
        db.query(models.Warehouse).delete()
        db.query(models.Department).delete()
        db.commit()
        print("  Đã xóa dữ liệu cũ.")

        print("  Bắt đầu thêm dữ liệu mẫu mới...")
        
        # Departments
        departments_data = [
            models.Department(id=f"BP{uuid.uuid4().hex[:8].upper()}", name="Phòng Kế toán", phone="0241234567"),
            models.Department(id=f"BP{uuid.uuid4().hex[:8].upper()}", name="Phòng Quản lý kho", phone="0248765432"),
            models.Department(id=f"BP{uuid.uuid4().hex[:8].upper()}", name="Phòng Bán hàng", phone="0243334444"),
        ]
        db.add_all(departments_data)
        db.commit()
        for d in departments_data: db.refresh(d)
        print(f"  Đã thêm {len(departments_data)} bộ phận.")

        # Products
        product_id_1 = f"SP{uuid.uuid4().hex[:8].upper()}"
        product_id_2 = f"SP{uuid.uuid4().hex[:8].upper()}"
        product_id_3 = f"SP{uuid.uuid4().hex[:8].upper()}"
        products_data = [
            models.Product(id=product_id_1, name='Laptop Gaming ABC', category='Laptop', price=25000000, stock=50, XuatXu='Trung Quốc', GiaNhap=20000000, NgaySX=datetime.date(2023, 1, 15), HanSD=datetime.date(2028, 1, 15)),
            models.Product(id=product_id_2, name='Bàn phím cơ XYZ', category='Phụ kiện', price=1500000, stock=120, XuatXu='Việt Nam', GiaNhap=1000000, NgaySX=datetime.date(2023, 3, 1), HanSD=datetime.date(2027, 3, 1)),
            models.Product(id=product_id_3, name='Chuột không dây Pro', category='Phụ kiện', price=800000, stock=200, XuatXu='Mỹ', GiaNhap=500000, NgaySX=datetime.date(2023, 5, 20), HanSD=datetime.date(2026, 5, 20)),
        ]
        db.add_all(products_data)
        db.commit()
        for p in products_data: db.refresh(p)
        print(f"  Đã thêm {len(products_data)} sản phẩm.")

        # Employees
        dept_qlkho = db.query(models.Department).filter_by(name="Phòng Quản lý kho").first()
        dept_banhang = db.query(models.Department).filter_by(name="Phòng Bán hàng").first()
        employee_id_1 = f"NV{uuid.uuid4().hex[:8].upper()}"
        employee_id_2 = f"NV{uuid.uuid4().hex[:8].upper()}"
        employee_id_3 = f"NV{uuid.uuid4().hex[:8].upper()}"
        employees_data = [
            models.Employee(id=employee_id_1, name='Nguyễn Văn A', gender='Nam', phone='0901112222', address='123 Cầu Giấy, Hà Nội', position='Quản lý kho', revenue_contribution=0.0, department_id=dept_qlkho.id if dept_qlkho else None),
            models.Employee(id=employee_id_2, name='Trần Thị B', gender='Nữ', phone='0903334444', address='456 Hai Bà Trưng, Hà Nội', position='Nhân viên kho', revenue_contribution=0.0, department_id=dept_qlkho.id if dept_qlkho else None),
            models.Employee(id=employee_id_3, name='Lê Văn C', gender='Nam', phone='0905556666', address='789 Đống Đa, Hà Nội', position='Nhân viên bán hàng', revenue_contribution=0.0, department_id=dept_banhang.id if dept_banhang else None),
        ]
        db.add_all(employees_data)
        db.commit()
        for e in employees_data: db.refresh(e)
        print(f"  Đã thêm {len(employees_data)} nhân viên.")

        # Suppliers
        supplier_id_1 = f"NCC{uuid.uuid4().hex[:8].upper()}"
        supplier_id_2 = f"NCC{uuid.uuid4().hex[:8].upper()}"
        suppliers_data = [
            models.Supplier(id=supplier_id_1, name='Công ty TNHH Linh kiện Phương Nam', contactPerson='Nguyễn Bách', phone='0901234567', email='phuongnam@example.com', address='123 Đường ABC, TP.HCM'),
            models.Supplier(id=supplier_id_2, name='Nhà phân phối thiết bị số Sài Gòn', contactPerson='Trần Thanh', phone='0907654321', email='saigon-digital@example.com', address='456 Đường XYZ, Hà Nội'),
        ]
        db.add_all(suppliers_data)
        db.commit()
        for s in suppliers_data: db.refresh(s)
        print(f"  Đã thêm {len(suppliers_data)} nhà cung cấp.")

        # Customers
        customer_id_1 = f"KH{uuid.uuid4().hex[:8].upper()}"
        customer_id_2 = f"KH{uuid.uuid4().hex[:8].upper()}"
        customers_data = [
            models.Customer(id=customer_id_1, name='Nguyễn Thị D', phone='0912345678', address='789 Giải Phóng, Hà Nội'),
            models.Customer(id=customer_id_2, name='Phạm Văn E', phone='0987654321', address='101 Hoàng Mai, Hà Nội'),
        ]
        db.add_all(customers_data)
        db.commit()
        for c in customers_data: db.refresh(c)
        print(f"  Đã thêm {len(customers_data)} khách hàng.")

        # Warehouses
        warehouse_id_1 = f"WH{uuid.uuid4().hex[:8].upper()}"
        warehouse_id_2 = f"WH{uuid.uuid4().hex[:8].upper()}"
        warehouses_data = [
            models.Warehouse(id=warehouse_id_1, name="Kho Hà Nội", location="Hà Nội", capacity=10000),
            models.Warehouse(id=warehouse_id_2, name="Kho TP.HCM", location="TP.HCM", capacity=15000),
        ]
        db.add_all(warehouses_data)
        db.commit()
        for w in warehouses_data: db.refresh(w)
        print(f"  Đã thêm {len(warehouses_data)} kho.")

        # Inventory
        inventory_items = []
        # Ensure product_id_1 and product_id_2 refer to actual IDs from products_data
        # Ensure warehouse_id_1 and warehouse_id_2 refer to actual IDs from warehouses_data
        if product_id_1 and warehouse_id_1:
            inventory_items.append(models.Inventory(product_id=product_id_1, warehouse_id=warehouse_id_1, stock=50))
        if product_id_2 and warehouse_id_2:
            inventory_items.append(models.Inventory(product_id=product_id_2, warehouse_id=warehouse_id_2, stock=120))
        db.add_all(inventory_items)
        db.commit()
        print(f"  Đã thêm {len(inventory_items)} mục tồn kho.")

        # Transactions
        transactions_data = [
            models.Transaction(
                id=f"TX{uuid.uuid4().hex[:8].upper()}", 
                type='import', 
                product_id=product_id_1,
                quantity=10, 
                date=datetime.date(2024, 5, 1), 
                employee_id=employee_id_1,
                supplier_id=supplier_id_1,
                customer_id=None, 
                price=20000000.0
            ),
            models.Transaction(
                id=f"TX{uuid.uuid4().hex[:8].upper()}", 
                type='export', 
                product_id=product_id_2,
                quantity=5, 
                date=datetime.date(2024, 5, 3), 
                employee_id=employee_id_2,
                supplier_id=None, 
                customer_id=customer_id_1,
                price=1500000.0
            ),
            models.Transaction(
                id=f"TX{uuid.uuid4().hex[:8].upper()}", 
                type='import', 
                product_id=product_id_3,
                quantity=20, 
                date=datetime.date(2024, 5, 5), 
                employee_id=employee_id_1, 
                supplier_id=supplier_id_2, 
                customer_id=None, 
                price=800000.0
            ),
            models.Transaction(
                id=f"TX{uuid.uuid4().hex[:8].upper()}", 
                type='export', 
                product_id=product_id_1, 
                quantity=2, 
                date=datetime.date(2024, 6, 7), 
                employee_id=employee_id_2, 
                supplier_id=None, 
                customer_id=customer_id_2, 
                price=25000000.0
            ),
        ]
        db.add_all(transactions_data)
        db.commit()
        print(f"  Đã thêm {len(transactions_data)} giao dịch.")
        
        print("Đã thêm dữ liệu mẫu thành công.")
    else:
        print("Database đã có dữ liệu mẫu, không tạo lại.")

# Đăng ký hàm tạo dữ liệu ban đầu để chạy khi ứng dụng khởi động
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    try:
        # Gọi hàm tạo dữ liệu ban đầu
        create_initial_data(db)
    finally:
        db.close()

# --- API Endpoints ---

# Products
@app.get("/products", response_model=List[schemas.Product])
async def get_products(db: Session = Depends(get_db), search: Optional[str] = Query(None, description="Search term for product name, ID, or category")):
    print(f"Received GET /products with search term: {search}")
    query = db.query(models.Product)
    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(models.Product.name).like(search_lower)) |
            (func.lower(models.Product.id).like(search_lower)) |
            (func.lower(models.Product.category).like(search_lower))
        )
    return query.all()

@app.post("/products", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
async def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_id = f"SP{uuid.uuid4().hex[:8].upper()}"
    db_product = models.Product(**product.dict(), id=new_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/products/{product_id}", response_model=schemas.Product)
async def update_product(product_id: str, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    for key, value in product.dict(exclude_unset=True).items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: str, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return

# Employees
@app.get("/employees", response_model=List[schemas.Employee])
async def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.post("/employees", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    new_id = f"NV{uuid.uuid4().hex[:8].upper()}"
    db_employee = models.Employee(**employee.dict(), id=new_id, revenue_contribution=0.0)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.put("/employees/{employee_id}", response_model=schemas.Employee)
async def update_employee(employee_id: str, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    
    for key, value in employee.dict(exclude_unset=True).items():
        setattr(db_employee, key, value)
    
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return

# Transactions
@app.get("/transactions", response_model=List[schemas.Transaction])
async def get_transactions(db: Session = Depends(get_db), search: Optional[str] = Query(None, description="Search term for transaction ID, product ID, or employee ID")):
    print(f"Received GET /transactions with search term: {search}")
    query = db.query(models.Transaction)
    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(models.Transaction.id).like(search_lower)) |
            (func.lower(models.Transaction.product_id).like(search_lower)) |
            (func.lower(models.Transaction.employee_id).like(search_lower)) |
            (func.lower(models.Transaction.supplier_id).like(search_lower)) |
            (func.lower(models.Transaction.customer_id).like(search_lower))
        )
    return query.all()

@app.post("/transactions", response_model=schemas.Transaction, status_code=status.HTTP_201_CREATED)
async def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    new_id = f"TX{uuid.uuid4().hex[:8].upper()}"
    db_transaction = models.Transaction(
        id=new_id,
        type=transaction.type,
        product_id=transaction.product_id, # Corrected: product_id
        quantity=transaction.quantity,
        date=transaction.date,
        employee_id=transaction.employee_id, # Corrected: employee_id
        supplier_id=transaction.supplier_id, # Corrected: supplier_id
        customer_id=transaction.customer_id, # Corrected: customer_id
        price=transaction.price
    )
    db.add(db_transaction)
    
    product = db.query(models.Product).filter(models.Product.id == db_transaction.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found for transaction")
    
    if db_transaction.type == 'import':
        product.stock += db_transaction.quantity
    elif db_transaction.type == 'export':
        if product.stock < db_transaction.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock for this export transaction")
        product.stock -= db_transaction.quantity
    
    employee = db.query(models.Employee).filter(models.Employee.id == db_transaction.employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found for transaction")

    if db_transaction.type == 'export':
        employee.revenue_contribution += (db_transaction.quantity * db_transaction.price)

    db.commit()
    db.refresh(db_transaction)
    db.refresh(product)
    db.refresh(employee)
    
    return db_transaction

@app.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: str, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    
    product = db.query(models.Product).filter(models.Product.id == db_transaction.product_id).first()
    if product:
        if db_transaction.type == 'import':
            product.stock -= db_transaction.quantity
        elif db_transaction.type == 'export':
            product.stock += db_transaction.quantity
    
    employee = db.query(models.Employee).filter(models.Employee.id == db_transaction.employee_id).first()
    if employee and db_transaction.type == 'export':
        employee.revenue_contribution -= (db_transaction.quantity * db_transaction.price)

    db.delete(db_transaction)
    db.commit()
    if product: db.refresh(product)
    if employee: db.refresh(employee)
    
    return

# Suppliers
@app.get("/suppliers", response_model=List[schemas.Supplier])
async def get_suppliers(db: Session = Depends(get_db), search: Optional[str] = Query(None, description="Search term for supplier name, ID, or contact person")):
    print(f"Received GET /suppliers with search term: {search}")
    query = db.query(models.Supplier)
    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(models.Supplier.name).like(search_lower)) |
            (func.lower(models.Supplier.id).like(search_lower)) |
            (func.lower(models.Supplier.contactPerson).like(search_lower))
        )
    return query.all()

@app.post("/suppliers", response_model=schemas.Supplier, status_code=status.HTTP_201_CREATED)
async def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    new_id = f"NCC{uuid.uuid4().hex[:8].upper()}"
    db_supplier = models.Supplier(**supplier.dict(), id=new_id)
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.put("/suppliers/{supplier_id}", response_model=schemas.Supplier)
async def update_supplier(supplier_id: str, supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    
    for key, value in supplier.dict(exclude_unset=True).items():
        setattr(db_supplier, key, value)
    
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.delete("/suppliers/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_supplier(supplier_id: str, db: Session = Depends(get_db)):
    db_supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    
    db.delete(db_supplier)
    db.commit()
    return

# Customers
@app.get("/customers", response_model=List[schemas.Customer])
async def get_customers(db: Session = Depends(get_db), search: Optional[str] = Query(None, description="Search term for customer name, ID, or phone")):
    query = db.query(models.Customer)
    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(models.Customer.name).like(search_lower)) |
            (func.lower(models.Customer.id).like(search_lower)) |
            (func.lower(models.Customer.phone).like(search_lower))
        )
    return query.all()

@app.post("/customers", response_model=schemas.Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    new_id = f"KH{uuid.uuid4().hex[:8].upper()}"
    db_customer = models.Customer(**customer.dict(), id=new_id)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/customers/{customer_id}/orders", response_model=List[schemas.OrderForCustomer])
async def get_customer_orders(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    
    orders = db.query(models.Transaction).filter(
        models.Transaction.customer_id == customer_id,
        models.Transaction.type == 'export'
    ).all()

    return [
        schemas.OrderForCustomer(
            id=order.id,
            product_id=order.product_id,
            quantity=order.quantity,
            totalAmount=order.quantity * order.price,
            date=order.date
        )
        for order in orders
    ]

# Warehouses
@app.get("/warehouses", response_model=List[schemas.Warehouse])
async def get_warehouses(db: Session = Depends(get_db), search: Optional[str] = Query(None, description="Search term for warehouse name, ID, or location")):
    query = db.query(models.Warehouse)
    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(models.Warehouse.name).like(search_lower)) |
            (func.lower(models.Warehouse.id).like(search_lower)) |
            (func.lower(models.Warehouse.location).like(search_lower))
        )
    return query.all()

@app.post("/warehouses", response_model=schemas.Warehouse, status_code=status.HTTP_201_CREATED)
async def create_warehouse(warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    new_id = f"WH{uuid.uuid4().hex[:8].upper()}"
    db_warehouse = models.Warehouse(**warehouse.dict(), id=new_id)
    db.add(db_warehouse)
    db.commit()
    db.refresh(db_warehouse)
    return db_warehouse

@app.put("/warehouses/{warehouse_id}", response_model=schemas.Warehouse)
async def update_warehouse(warehouse_id: str, warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    db_warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).first()
    if db_warehouse is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Warehouse not found")
    
    for key, value in warehouse.dict(exclude_unset=True).items():
        setattr(db_warehouse, key, value)
    
    db.commit()
    db.refresh(db_warehouse)
    return db_warehouse

@app.delete("/warehouses/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_warehouse(warehouse_id: str, db: Session = Depends(get_db)):
    db_warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).first()
    if db_warehouse is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Warehouse not found")
    
    db.delete(db_warehouse)
    db.commit()
    return

# Inventory
@app.get("/inventory", response_model=List[schemas.Inventory])
async def get_inventory(db: Session = Depends(get_db)):
    return db.query(models.Inventory).all()

@app.post("/inventory", response_model=schemas.Inventory, status_code=status.HTTP_201_CREATED)
async def create_inventory(inventory: schemas.InventoryCreate, db: Session = Depends(get_db)):
    db_inventory = models.Inventory(
        product_id=inventory.product_id, # Corrected: product_id
        warehouse_id=inventory.warehouse_id, # Corrected: warehouse_id
        stock=inventory.stock
    )
    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

@app.put("/inventory/{product_id}/{warehouse_id}", response_model=schemas.Inventory)
async def update_inventory(product_id: str, warehouse_id: str, inventory: schemas.InventoryUpdate, db: Session = Depends(get_db)):
    db_inventory = db.query(models.Inventory).filter(
        models.Inventory.product_id == product_id,
        models.Inventory.warehouse_id == warehouse_id
    ).first()
    if db_inventory is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    
    update_data = inventory.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_inventory, key, value)
    
    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

@app.delete("/inventory/{product_id}/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inventory(product_id: str, warehouse_id: str, db: Session = Depends(get_db)):
    db_inventory = db.query(models.Inventory).filter(
        models.Inventory.product_id == product_id,
        models.Inventory.warehouse_id == warehouse_id
    ).first()
    if db_inventory is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    
    db.delete(db_inventory)
    db.commit()
    return

# Departments
@app.get("/departments", response_model=List[schemas.Department])
async def get_departments(db: Session = Depends(get_db), search: Optional[str] = Query(None, description="Search term for department name, ID, or phone")):
    query = db.query(models.Department)
    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(models.Department.name).like(search_lower)) |
            (func.lower(models.Department.id).like(search_lower)) |
            (func.lower(models.Department.phone).like(search_lower))
        )
    return query.all()

@app.post("/departments", response_model=schemas.Department, status_code=status.HTTP_201_CREATED)
async def create_department(department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    new_id = f"BP{uuid.uuid4().hex[:8].upper()}"
    db_department = models.Department(**department.dict(), id=new_id)
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@app.put("/departments/{department_id}", response_model=schemas.Department)
async def update_department(department_id: str, department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    db_department = db.query(models.Department).filter(models.Department.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    
    for key, value in department.dict(exclude_unset=True).items():
        setattr(db_department, key, value)
    
    db.commit()
    db.refresh(db_department)
    return db_department

@app.delete("/departments/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(department_id: str, db: Session = Depends(get_db)):
    db_department = db.query(models.Department).filter(models.Department.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    
    db.delete(db_department)
    db.commit()
    return

# Reports and Dashboard Stats
@app.get("/inventory-report", response_model=List[Dict[str, Any]])
async def get_inventory_report(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    
    report_data = []
    for product in products:
        imports = db.query(func.sum(models.Transaction.quantity)).filter(
            models.Transaction.product_id == product.id,
            models.Transaction.type == 'import'
        ).scalar() or 0

        exports = db.query(func.sum(models.Transaction.quantity)).filter(
            models.Transaction.product_id == product.id,
            models.Transaction.type == 'export'
        ).scalar() or 0
        
        report_data.append({
            "warehouse_id": "WH001", # Giả lập 1 kho
            "product_id": product.id,
            "product_name": product.name,
            "current_stock": product.stock,
            "total_imports": imports,
            "total_exports": exports,
        })
    return report_data

@app.get("/revenue-report", response_model=List[Dict[str, Any]])
async def get_revenue_report(db: Session = Depends(get_db)):
    revenue_by_month = db.query(
        func.DATE_FORMAT(models.Transaction.date, '%Y-%m').label("month"),
        func.sum(models.Transaction.quantity * models.Transaction.price).label("total_revenue")
    ).filter(
        models.Transaction.type == 'export'
    ).group_by(
        func.DATE_FORMAT(models.Transaction.date, '%Y-%m')
    ).order_by("month").all()
    
    return [{"month": r.month, "total_revenue": r.total_revenue} for r in revenue_by_month]

@app.get("/dashboard-stats", response_model=Dict[str, Any])
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(models.Product).count()
    
    total_inventory_value_result = db.query(func.sum(models.Product.price * models.Product.stock)).scalar()
    total_inventory_value = total_inventory_value_result if total_inventory_value_result is not None else 0.0

    current_month = datetime.datetime.now().month
    current_year = datetime.datetime.now().year

    new_orders = db.query(models.Transaction).filter(
        models.Transaction.type == 'export',
        extract('month', models.Transaction.date) == current_month,
        extract('year', models.Transaction.date) == current_year
    ).count()
    
    today = datetime.date.today()
    first_day_of_current_month = today.replace(day=1)
    last_day_of_last_month = first_day_of_current_month - datetime.timedelta(days=1)
    last_month = last_day_of_last_month.month
    last_month_year = last_day_of_last_month.year

    total_revenue_last_month_result = db.query(
        func.sum(models.Transaction.quantity * models.Transaction.price)
    ).filter(
        models.Transaction.type == 'export',
        extract('month', models.Transaction.date) == last_month,
        extract('year', models.Transaction.date) == last_month_year
    ).scalar()

    total_revenue_last_month = total_revenue_last_month_result if total_revenue_last_month_result is not None else 0.0
    
    pending_transactions = db.query(models.Transaction).count()

    top_selling_product_result = db.query(
        models.Product.name,
        func.sum(models.Transaction.quantity).label("total_exported")
    ).join(
        models.Transaction, models.Product.id == models.Transaction.product_id
    ).filter(
        models.Transaction.type == 'export'
    ).group_by(
        models.Product.name
    ).order_by(
        func.sum(models.Transaction.quantity).desc()
    ).first()
            
    top_selling_product_name = top_selling_product_result.name if top_selling_product_result else "N/A"

    return {
        "totalProducts": total_products,
        "newOrders": new_orders,
        "totalInventoryValue": total_inventory_value,
        "totalRevenueLastMonth": total_revenue_last_month,
        "pendingTransactions": pending_transactions,
        "topSellingProduct": top_selling_product_name
    }

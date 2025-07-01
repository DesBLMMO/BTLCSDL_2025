from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# THAY THẾ CHUỖI KẾT NỐI NÀY BẰNG THÔNG TIN THỰC TẾ CỦA BẠN
# Đảm bảo bạn đã cài đặt driver MySQL cho SQLAlchemy: pip install mysqlclient hoặc pip install mysql-connector-python
# Đã thêm tham số charset=utf8mb4 để đảm bảo tính tương thích với các cột VARCHAR
# và giải quyết lỗi khóa ngoại "incompatible".
# Nếu cần, bạn cũng có thể thêm &collation=utf8mb4_unicode_ci
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:0973224911a@localhost:3306/khohang?charset=utf8mb4"

# Khởi tạo SQLAlchemy Engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Tạo SessionLocal class để tương tác với database
# autocommit=False để SQLAlchemy không tự động commit sau mỗi thao tác
# autoflush=False để không tự động flush session vào database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Khởi tạo Base class cho declarative models
Base = declarative_base()

# Dependency để lấy session database cho mỗi request
# Đảm bảo session được đóng sau khi request hoàn thành
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

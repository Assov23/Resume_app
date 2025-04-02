import sys
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import User, Base
from app.utils.auth import get_password_hash

# Создаем таблицы, если они не существуют
Base.metadata.create_all(bind=engine)

def create_admin(email: str, password: str):
    db = SessionLocal()
    try:
        # Проверяем, существует ли пользователь
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            print(f"Пользователь {email} уже существует.")
            if user.is_admin:
                print("И уже является администратором.")
                return
            else:
                # Обновляем до администратора
                user.is_admin = True
                db.commit()
                print(f"Пользователь {email} обновлен до администратора.")
                return
        
        # Создаем нового администратора
        hashed_password = get_password_hash(password)
        admin = User(email=email, hashed_password=hashed_password, is_admin=True)
        
        db.add(admin)
        db.commit()
        print(f"Администратор {email} успешно создан.")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Использование: python create_admin.py email password")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    create_admin(email, password)
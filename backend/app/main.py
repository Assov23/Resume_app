from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import Base, engine
from app.routers import auth, resume

# Создание директории для хранения файлов, если её не существует
os.makedirs("./uploads", exist_ok=True)

# Создание таблиц в базе данных
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Management API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтирование роутов
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api/resumes", tags=["Resumes"])

# Монтирование статических файлов для загруженных резюме
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to Resume Management API"}
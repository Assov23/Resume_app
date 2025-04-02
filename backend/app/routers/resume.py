from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid

from app import models, schemas
from app.database import get_db
from app.routers.auth import get_current_user, get_admin_user

router = APIRouter()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Получение расширения файла
def get_file_extension(filename: str) -> str:
    return filename.split(".")[-1]

@router.post("", response_model=schemas.Resume)
async def upload_resume(
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Проверка типа файла
    extension = get_file_extension(file.filename).lower()
    if extension not in ["pdf", "doc", "docx"]:
        raise HTTPException(status_code=400, detail="File type not allowed. Use PDF, DOC or DOCX")
    
    # Создание уникального имени файла
    unique_filename = f"{uuid.uuid4()}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Сохранение файла
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Создание записи о резюме в базе данных
    resume = models.Resume(
        title=title,
        filename=file.filename,
        file_path=unique_filename,
        file_type=extension,
        user_id=current_user.id
    )
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return resume

@router.get("", response_model=List[schemas.ResumeWithUser])
def get_all_resumes(
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(models.Resume).all()
    return resumes

@router.get("/my", response_model=List[schemas.Resume])
def get_my_resumes(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    return resumes

@router.get("/{resume_id}/download")
def download_resume(
    resume_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Проверка прав доступа (либо владелец, либо админ)
    if resume.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this resume")
    
    file_path = os.path.join(UPLOAD_DIR, resume.file_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        file_path, 
        media_type="application/octet-stream", 
        filename=resume.filename
    )

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Проверка прав доступа (либо владелец, либо админ)
    if resume.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this resume")
    
    # Удаление файла
    file_path = os.path.join(UPLOAD_DIR, resume.file_path)
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Удаление записи из базы данных
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}

@router.post("/anonymous", response_model=schemas.Resume)
async def upload_anonymous_resume(
    title: str = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Проверка типа файла
    extension = get_file_extension(file.filename).lower()
    if extension not in ["pdf", "doc", "docx"]:
        raise HTTPException(status_code=400, detail="File type not allowed. Use PDF, DOC or DOCX")
    
    # Создание уникального имени файла
    unique_filename = f"{uuid.uuid4()}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Сохранение файла
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Создание записи о резюме в базе данных для анонимного пользователя
    resume = models.Resume(
        title=title,
        filename=file.filename,
        file_path=unique_filename,
        file_type=extension,
        user_id=None,  # Нет привязки к пользователю
        anonymous_name=name,
        anonymous_email=email
    )
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return resume
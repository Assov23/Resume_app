from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Схемы для пользователей
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Схемы для резюме
class ResumeBase(BaseModel):
    title: str

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: int
    filename: str
    file_type: str
    created_at: datetime
    user_id: Optional[int] = None
    anonymous_name: Optional[str] = None
    anonymous_email: Optional[str] = None

    class Config:
        orm_mode = True

class ResumeWithUser(Resume):
    user: Optional[User] = None

    class Config:
        orm_mode = True
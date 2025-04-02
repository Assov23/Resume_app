from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Отношение один-ко-многим с резюме
    resumes = relationship("Resume", back_populates="user")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    filename = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    anonymous_name = Column(String, nullable=True)
    anonymous_email = Column(String, nullable=True)

    # Отношение многие-к-одному с пользователем
    user = relationship("User", back_populates="resumes")
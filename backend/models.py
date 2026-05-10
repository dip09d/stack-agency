from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base
from datetime import datetime

class TeamMember(Base):
    __tablename__ = "team"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    role = Column(String(100))
    imageUrl = Column(String(255))

class Enquiry(Base):
    __tablename__ = "enquiries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20), nullable=True)
    company = Column(String(100), nullable=True)
    projectType = Column(String(50))
    budget = Column(String(50))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Settings(Base):
    __tablename__ = "settings"
    key = Column(String(50), primary_key=True, index=True)
    value = Column(Text)
    description = Column(String(255), nullable=True)

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TeamMemberBase(BaseModel):
    name: str
    role: str
    imageUrl: str

class TeamMember(TeamMemberBase):
    id: int
    class Config:
        from_attributes = True

class EnquiryBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    projectType: str
    budget: str
    message: str

class Enquiry(EnquiryBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class SettingBase(BaseModel):
    key: str
    value: str

class Setting(SettingBase):
    description: Optional[str] = None
    class Config:
        from_attributes = True

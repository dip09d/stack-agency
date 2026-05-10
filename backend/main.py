from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Dict
import shutil
import os
import time

from . import models, schemas, database, mailer

# Path for uploaded images
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_UPLOAD_DIR = os.path.join(BASE_DIR, "src", "assets", "images")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", DEFAULT_UPLOAD_DIR)

app = FastAPI(title="Stack Agency API")

# Mount the images folder so FastAPI can serve them
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Simple CORS for Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
try:
    models.Base.metadata.create_all(bind=database.engine)
except Exception as e:
    print(f"Database tables already initialized or error: {e}")

@app.get("/api/team", response_model=List[schemas.TeamMember])
def get_team(request: Request, db: Session = Depends(database.get_db)):
    members = db.query(models.TeamMember).all()
    # Prepend the base URL to image paths
    base_url = str(request.base_url)
    for m in members:
        if m.imageUrl and not m.imageUrl.startswith("http"):
            # If stored as 'assets/images/team.png', convert to 'http://.../uploads/team.png'
            filename = os.path.basename(m.imageUrl)
            m.imageUrl = f"{base_url}uploads/{filename}"
    return members

MAX_FILE_SIZE = 50 * 1024 * 1024 # 50 MB

@app.post("/api/team", response_model=schemas.TeamMember)
async def create_team_member(
    request: Request,
    name: str = Form(...),
    role: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # Check file size
    file_size = 0
    if image:
        image.file.seek(0, os.SEEK_END)
        file_size = image.file.tell()
        image.file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"File too large. Maximum size allowed is 50MB. Uploaded: {file_size / (1024*1024):.2f}MB")

    file_extension = os.path.splitext(image.filename)[1]
    file_name = f"team-{name.lower().replace(' ', '-')}-{int(time.time())}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    db_member = models.TeamMember(
        name=name,
        role=role,
        imageUrl=f"assets/images/{file_name}"
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    # Return full URL
    db_member.imageUrl = f"{request.base_url}uploads/{file_name}"
    return db_member

@app.put("/api/team/{member_id}", response_model=schemas.TeamMember)
async def update_team_member(
    request: Request,
    member_id: int,
    name: str = Form(None),
    role: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db)
):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if name:
        db_member.name = name
    if role:
        db_member.role = role
    
    if image:
        # Check file size
        image.file.seek(0, os.SEEK_END)
        file_size = image.file.tell()
        image.file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"File too large. Maximum size allowed is 50MB. Uploaded: {file_size / (1024*1024):.2f}MB")

        file_extension = os.path.splitext(image.filename)[1]
        file_name = f"team-{db_member.name.lower().replace(' ', '-')}-{int(time.time())}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        db_member.imageUrl = f"assets/images/{file_name}"
    
    db.commit()
    db.refresh(db_member)
    
    # Return full URL
    filename = os.path.basename(db_member.imageUrl)
    db_member.imageUrl = f"{request.base_url}uploads/{filename}"
    return db_member

@app.delete("/api/team/{member_id}")
def delete_team_member(member_id: int, db: Session = Depends(database.get_db)):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(db_member)
    db.commit()
    return {"message": "Member deleted successfully"}

@app.get("/api/enquiries", response_model=List[schemas.Enquiry])
def get_enquiries(db: Session = Depends(database.get_db)):
    return db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).all()

@app.post("/api/enquiries", response_model=schemas.Enquiry)
def create_enquiry(
    enquiry: schemas.EnquiryBase, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(database.get_db)
):
    db_enquiry = models.Enquiry(**enquiry.dict())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    background_tasks.add_task(mailer.send_enquiry_email, enquiry.dict(), db)
    return db_enquiry

@app.get("/api/settings", response_model=Dict[str, str])
def get_settings(db: Session = Depends(database.get_db)):
    settings = db.query(models.Settings).all()
    return {s.key: s.value for s in settings}

@app.post("/api/settings")
def update_setting(setting: schemas.SettingBase, db: Session = Depends(database.get_db)):
    db_setting = db.query(models.Settings).filter(models.Settings.key == setting.key).first()
    if db_setting:
        db_setting.value = setting.value
    else:
        db_setting = models.Settings(**setting.dict())
        db.add(db_setting)
    db.commit()
    return db_setting

@app.get("/api/enquiries/view", response_class=HTMLResponse)
def view_enquiries_html(db: Session = Depends(database.get_db)):
    enquiries = db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).all()
    rows = "".join([f"<tr><td>{e.name}</td><td>{e.email}</td><td>{e.projectType}</td><td>{e.created_at}</td></tr>" for e in enquiries])
    return f"<html><body><h1>Enquiries</h1><table border='1'><tr><th>Name</th><th>Email</th><th>Type</th><th>Date</th></tr>{rows}</table></body></html>"

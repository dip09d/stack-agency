from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Dict
import shutil
import os

from . import models, schemas, database, mailer

# Path for uploaded images
UPLOAD_DIR = "/var/www/stack-frontend/assets/images"

app = FastAPI(title="Stack Agency API")

# Simple CORS for Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/team")
async def create_team_member(
    name: str = Form(...),
    role: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # Ensure directory exists
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Save the image
    file_extension = os.path.splitext(image.filename)[1]
    file_name = f"team-{name.lower().replace(' ', '-')}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    # Save to database
    db_member = models.TeamMember(
        name=name,
        role=role,
        imageUrl=f"assets/images/{file_name}"
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    return db_member

# Create tables
try:
    models.Base.metadata.create_all(bind=database.engine)
except Exception as e:
    print(f"Database tables already initialized or error: {e}")

app = FastAPI(title="Stack Agency API")

# Simple CORS for Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints for Team
@app.get("/api/team", response_model=List[schemas.TeamMember])
def get_team(db: Session = Depends(database.get_db)):
    return db.query(models.TeamMember).all()

# Endpoint for Enquiries
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
    
    # Send email notification in the BACKGROUND
    background_tasks.add_task(mailer.send_enquiry_email, enquiry.dict(), db)
    
    return db_enquiry

# Endpoints for Settings (Dynamic Contact Info & Email Config)
@app.get("/api/settings", response_model=Dict[str, str])
def get_settings(db: Session = Depends(database.get_db)):
    settings = db.query(models.Settings).all()
    return {s.key: s.value for s in settings}

@app.post("/api/settings", response_model=schemas.Setting)
def update_setting(setting: schemas.SettingBase, db: Session = Depends(database.get_db)):
    db_setting = db.query(models.Settings).filter(models.Settings.key == setting.key).first()
    if db_setting:
        db_setting.value = setting.value
    else:
        db_setting = models.Settings(**setting.dict())
        db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

# View Enquiries (JSON)
@app.get("/api/enquiries", response_model=List[schemas.Enquiry])
def get_enquiries(db: Session = Depends(database.get_db)):
    return db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).all()

# View Enquiries (HTML Table for easy viewing in browser)
@app.get("/api/enquiries/view", response_class=HTMLResponse)
def view_enquiries_html(db: Session = Depends(database.get_db)):
    enquiries = db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).all()
    
    html_content = """
    <html>
        <head>
            <title>Stack Agency - Enquiries</title>
            <style>
                body { font-family: sans-serif; padding: 40px; background: #f8fafc; }
                table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                th, td { text-align: left; padding: 16px; border-bottom: 1px solid #e2e8f0; }
                th { background: #0f172a; color: white; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; }
                tr:hover { background: #f1f5f9; }
                .badge { padding: 4px 8px; rounded: 4px; font-size: 11px; font-weight: bold; background: #e2e8f0; color: #475569; border-radius: 4px; }
            </style>
        </head>
        <body>
            <h2 style="color: #0f172a; margin-bottom: 24px;">Project Enquiries</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Project Type</th>
                        <th>Budget</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
    """
    
    for e in enquiries:
        date_str = e.created_at.strftime("%Y-%m-%d %H:%M")
        html_content += f"""
                    <tr>
                        <td style="white-space: nowrap; font-size: 12px; color: #64748b;">{date_str}</td>
                        <td style="font-weight: bold;">{e.name}</td>
                        <td>{e.email}</td>
                        <td style="font-size: 12px; font-weight: bold;">{e.phone or 'N/A'}</td>
                        <td><span class="badge">{e.projectType}</span></td>
                        <td style="color: #10b981; font-weight: bold;">{e.budget}</td>
                        <td style="font-size: 14px; color: #475569;">{e.message}</td>
                    </tr>
        """
        
    html_content += """
                </tbody>
            </table>
        </body>
    </html>
    """
    return html_content

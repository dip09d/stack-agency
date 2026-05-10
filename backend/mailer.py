import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
from . import models
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Default Email configuration from .env
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp-relay.brevo.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "hello@stackagency.com")
SENDER_NAME = os.getenv("SENDER_NAME", "Stack Agency")
AGENCY_EMAIL = os.getenv("AGENCY_EMAIL", "hello@stackagency.com")

def send_enquiry_email(enquiry_data: dict, db: Session):
    """
    Sends a professional HTML email notification for a new enquiry.
    """
    # Fetch email settings from database if available
    db_settings = {s.key: s.value for s in db.query(models.Settings).all()}
    
    # Priority: Database Settings > Environment Variables
    smtp_server = db_settings.get("SMTP_SERVER", SMTP_SERVER)
    smtp_port = int(db_settings.get("SMTP_PORT", SMTP_PORT))
    smtp_user = db_settings.get("SMTP_USER", SMTP_USER)
    smtp_password = db_settings.get("SMTP_PASSWORD", SMTP_PASSWORD)
    receiver_email = db_settings.get("RECEIVER_EMAIL", AGENCY_EMAIL)
    sender_name = db_settings.get("SENDER_NAME", SENDER_NAME)
    sender_email = db_settings.get("SENDER_EMAIL", SENDER_EMAIL)

    if not smtp_user or not smtp_password:
        print("Email credentials missing. Skipping email notification.")
        return

    # Create Message
    message = MIMEMultipart("alternative")
    message["Subject"] = f"🚀 New Project Enquiry: {enquiry_data['name']}"
    message["From"] = f"{sender_name} <{sender_email}>"
    message["To"] = receiver_email

    # Professional HTML Template
    html = f"""
    <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="background-color: #0f172a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">New Lead Captured</h1>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
                <p style="font-size: 16px;">Hello Team,</p>
                <p style="font-size: 16px;">You have received a new project enquiry from the website. Here are the details:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold; width: 120px;">Client Name</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">{enquiry_data['name']}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Email</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:{enquiry_data['email']}" style="color: #3b82f6;">{enquiry_data['email']}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Phone</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">{enquiry_data.get('phone', 'N/A')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Company</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">{enquiry_data.get('company', 'N/A')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Project Type</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><span style="background-color: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; color: #0f172a;">{enquiry_data['projectType']}</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Budget</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: bold;">{enquiry_data['budget']}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
                    <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Message Details</p>
                    <p style="margin: 0; color: #0f172a; line-height: 1.6;">{enquiry_data['message']}</p>
                </div>
                
                <div style="margin-top: 40px; text-align: center;">
                    <a href="mailto:{enquiry_data['email']}" style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reply to Client</a>
                </div>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #eee;">
                <p>&copy; 2026 Stack Agency Lead Management System</p>
            </div>
        </body>
    </html>
    """
    
    message.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(message)
        print(f"Enquiry email sent successfully to {receiver_email}!")
    except Exception as e:
        print(f"Error sending email: {e}")

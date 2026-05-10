import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv("backend/.env")

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp-relay.brevo.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
AGENCY_EMAIL = os.getenv("AGENCY_EMAIL")

def test_email():
    print(f"Connecting to {SMTP_SERVER}:{SMTP_PORT}...")
    try:
        message = MIMEMultipart()
        message["From"] = os.getenv("SENDER_EMAIL")
        message["To"] = AGENCY_EMAIL
        message["Subject"] = "🧪 Stack Agency: SMTP Test"
        
        body = "If you see this, your Brevo SMTP configuration is working perfectly!"
        message.attach(MIMEText(body, "plain"))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.set_debuglevel(1)  # Show full communication
        server.starttls()
        print("Logging in...")
        server.login(SMTP_USER, SMTP_PASSWORD)
        print("Sending test email...")
        errors = server.send_message(message)
        server.quit()
        
        if not errors:
            print("✅ SUCCESS! Email sent. Check your inbox.")
        else:
            print(f"❌ PARTIAL FAILURE: {errors}")
    except Exception as e:
        print(f"❌ CRITICAL FAILURE: {e}")

if __name__ == "__main__":
    test_email()

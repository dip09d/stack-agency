# 🚀 Stack Agency: Production Deployment Guide

This file contains the exact steps to maintain and update your live website and API.

## 🔗 Live URLs
*   **Main Website**: [https://stacknix.it.com](https://stacknix.it.com)
*   **API Documentation**: [https://agency.stacknix.it.com/docs](https://agency.stacknix.it.com/docs)
*   **Admin Enquiry Viewer**: [https://agency.stacknix.it.com/api/enquiries/view](https://agency.stacknix.it.com/api/enquiries/view)

---

## ⚡ Quick Update (Standard Workflow)

If you have made changes to **both** the Frontend and Backend, follow these steps:

### 1. On your Local Machine:
```bash
# 1. Build the frontend
npm run build

# 2. Push everything to GitHub
git add .
git commit -m "Deployment update"
git push origin main
```

### 2. On your Server:
```bash
# 1. Go to the project folder
cd /var/www/stack

# 2. Pull the new code
git pull origin main

# 3. Restart the backend service
sudo systemctl restart stack-backend

# 4. (Optional) Restart Nginx if you changed config
sudo systemctl restart nginx
```

---

## 🅰️ Frontend-Only Update
If you **only** changed the Angular design/code:
1. **Local**: `npm run build` -> `git add .` -> `git commit` -> `git push`
2. **Server**: `cd /var/www/stack` -> `git pull origin main`

---

## 🐍 Backend-Only Update
If you **only** changed the Python files in `backend/`:
1. **Local**: `git add .` -> `git commit` -> `git push`
2. **Server**: `cd /var/www/stack` -> `git pull origin main` -> `sudo systemctl restart stack-backend`

---

## 🛠️ Troubleshooting (Server Commands)

* **Check Backend Status**: `sudo systemctl status stack-backend`
* **Check Backend Logs**: `journalctl -u stack-backend -f`
* **Test Nginx Config**: `sudo nginx -t`
* **Restart Nginx**: `sudo systemctl restart nginx`

---

## 📂 Server Configuration Reference

* **Main Project Root**: `/var/www/stack`
* **Frontend Build Files**: `/var/www/stack/dist/browser`
* **Backend Config**: `/etc/nginx/sites-available/stack` (agency.stacknix.it.com)
* **Frontend Config**: `/etc/nginx/sites-available/stacknix-main` (stacknix.it.com)

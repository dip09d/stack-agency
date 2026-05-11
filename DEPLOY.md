# 🚀 Stack Agency: Production Deployment Guide

This file contains the exact steps to maintain and update your live website and API.

## 🔗 Live URLs
*   **Main Website**: [https://stacknix.it.com](https://stacknix.it.com)
*   **API Documentation**: [https://agency.stacknix.it.com/docs](https://agency.stacknix.it.com/docs)
*   **Admin Enquiry Viewer**: [https://agency.stacknix.it.com/api/enquiries/view](https://agency.stacknix.it.com/api/enquiries/view)

---

## 🐍 1. Updating the BACKEND (Python)

If you change any files in the `backend/` folder:

1. **On your Local Machine**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

2. **On your Server**:
   ```bash
   cd /var/www/stack
   git pull origin main
   sudo systemctl restart stack-backend
   ```

---

## 🅰️ 2. Updating the FRONTEND (Angular)

If you change the design or any `.ts` files in `src/`:

1. **On your Local Machine**:
   ```bash
   # 1. Build the production files
   npm run build
   
   # 2. Add, commit and push everything (including the dist/ folder)
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. **On your Server**:
   ```bash
   cd /var/www/stack
   git pull origin main
   # Files are now live in /var/www/stack/dist/browser
   ```

### ⚙️ One-Time Setup: Point Nginx to the new path
Since we changed where the build files go, you must update your server config **one time**:

1. **Open the config file**:
   ```bash
   sudo nano /etc/nginx/sites-available/stack
   ```
2. **Find the root line** (usually looks like `root /var/www/stack-frontend;`) and change it to:
   ```nginx
   root /var/www/stack/dist/browser;
   ```
3. **Save and Exit**: Press `CTRL+O`, `Enter`, then `CTRL+X`.
4. **Test & Restart**:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🛠️ 3. Troubleshooting (Server Commands)

* **Check Backend Status**: `sudo systemctl status stack-backend`
* **Restart Backend**: `sudo systemctl restart stack-backend`
* **Check Backend Logs**: `journalctl -u stack-backend -f`
* **Restart Nginx**: `sudo systemctl restart nginx`

---

## 📂 Server Paths (Updated)
* **API Code**: `/var/www/stack`
* **Website Files**: `/var/www/stack/dist/browser` (Previously /var/www/stack-frontend)
* **Nginx Config**: `/etc/nginx/sites-available/stack`

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
   # Build the production files
   npm run build
   
   # Upload the build to your server
   scp -r dist/stack/browser/* root@139.59.74.9:/var/www/stack-frontend
   ```

---

## 🛠️ 3. Troubleshooting (Server Commands)

* **Check Backend Status**: `sudo systemctl status stack-backend`
* **Restart Backend**: `sudo systemctl restart stack-backend`
* **Check Backend Logs**: `journalctl -u stack-backend -f`
* **Restart Nginx**: `sudo systemctl restart nginx`

---

## 📂 Server Paths
* **API Code**: `/var/www/stack`
* **Website Files**: `/var/www/stack-frontend`
* **Nginx Config**: `/etc/nginx/sites-available/stack`

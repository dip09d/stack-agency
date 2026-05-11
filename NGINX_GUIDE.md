# 🌐 Nginx Configuration Guide

This guide explains how Nginx works on your server and what the settings in your configuration files actually do.

---

## 📂 1. Available vs. Enabled (The "Library" Concept)

Nginx uses two folders to manage your websites:

*   **`/etc/nginx/sites-available/`**: Think of this as a **Library**. It contains all the "books" (configuration files) you have written, but just because a book is in the library doesn't mean it's being read.
*   **`/etc/nginx/sites-enabled/`**: Think of this as the **Reading Desk**. Nginx only looks at files in this folder. 

### How to turn a site ON or OFF:
To turn a site ON, you don't copy the file. Instead, you create a **Symbolic Link** (a shortcut) from the library to the desk:
```bash
# To Enable a site:
sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/

# To Disable a site:
sudo rm /etc/nginx/sites-enabled/your-site
```

---

## 📄 2. Understanding `stacknix-main` (Line-by-Line)

Here is what every part of your frontend configuration does:

### The Server Block
```nginx
server {
    ...
}
```
Everything inside these braces defines how Nginx should handle a specific website or domain.

### Domain Name
```nginx
server_name stacknix.it.com www.stacknix.it.com;
```
This tells Nginx: "If a user visits either of these two addresses, use this configuration."

### The Files Path (The Root)
```nginx
root /var/www/stack/dist/browser;
```
This is the most important line. It tells Nginx **where the files are**. When a user asks for `index.html`, Nginx looks in this folder.

### The Default File
```nginx
index index.html;
```
If a user just visits `stacknix.it.com/` (without a filename), Nginx will automatically try to open `index.html`.

### The URL Handler (Location)
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
This is critical for Angular apps. 
*   **`$uri`**: Check if the file exists (like an image).
*   **`$uri/`**: Check if a folder exists.
*   **`/index.html`**: If neither exists, send the user to `index.html`. This allows Angular to handle the routing internally.

### Security & SSL (HTTPS)
```nginx
listen 443 ssl http2 default_server;
```
*   **`443`**: The standard port for secure HTTPS traffic.
*   **`ssl`**: Enables encryption.
*   **`http2`**: A faster version of the web protocol.
*   **`default_server`**: If a request comes in that doesn't match any other domain, use this one.

### SSL Certificates (Certbot)
```nginx
ssl_certificate /etc/letsencrypt/live/stacknix.it.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/stacknix.it.com/privkey.pem;
```
These lines point to your security "keys" provided by Let's Encrypt. They prove that your site is safe and verify your identity.

---

## 🛠️ Essential Commands
*   **`sudo nginx -t`**: Check for spelling mistakes in your config.
*   **`sudo systemctl restart nginx`**: Apply changes.
*   **`ls -l /etc/nginx/sites-enabled/`**: See which sites are currently active.

# Tuhfat Al-Ilm Academy — Hostinger Deployment Guide

This guide walks you through deploying **Tuhfat Al-Ilm Academy** to **Hostinger Node.js Web App** with a persistent **MySQL / MariaDB database**, **Google OAuth Admin Sign-In**, and **SMTP Notifications**.

---

## 1. Overview & Architecture

- **Runtime**: Node.js 20+ / Node.js 22+
- **Application Framework**: React SPA with Tailwind CSS + Express Backend
- **Build Output**: `dist/` (client bundle) + `server.js` (bundled Node server)
- **Database**: Hostinger MySQL / MariaDB (with persistent tables & auto-migration)
- **Authentication**:
  - Secure session cookies (`HttpOnly; SameSite=Lax`)
  - Real Google OAuth integration (Google Identity Services)
  - PBKDF2 hashed password fallback with cryptographic salts
- **Authorized Administrators**:
  1. `YOUR_OFFICIAL_EMAIL` (`aneesattari67@gmail.com` or custom `ADMIN_EMAIL`)
  2. `tuhfatalilmacademy@gmail.com` (`ACADEMY_ADMIN_EMAIL`)

---

## 2. Hostinger Prerequisites

1. A **Hostinger Web Hosting or VPS / Cloud plan** with **Node.js Web App** support.
2. A registered custom domain (e.g. `tuhfatalilm.online` or `tuhfatalilmacademy.com`).
3. An active Git repository on GitHub (or zip upload).

---

## 3. Database Setup (Hostinger MySQL)

1. Log into your **Hostinger hPanel**.
2. Go to **Databases** -> **MySQL Databases**.
3. Create a new MySQL database:
   - **Database Name**: e.g., `u123456789_tuhfat`
   - **Username**: e.g., `u123456789_admin`
   - **Password**: Create a strong database password (e.g., `SecureDbPass2026!`)
4. Note down the full database name, username, and password. Hostinger MySQL host is typically `localhost` or `127.0.0.1` on port `3306`.
5. *(Optional)* If you wish to pre-import tables, open **phpMyAdmin** from hPanel, select your database, click **Import**, and choose `migrations/schema.sql`. (Note: The server automatically initializes all required tables and default courses on start).

---

## 4. Google OAuth 2.0 Credentials Setup

To enable the **Continue with Google** button in `/admin/login`:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Navigate to **APIs & Services** -> **OAuth consent screen**:
   - User Type: **External**
   - App Name: `Tuhfat Al-Ilm Academy`
   - User support email: `tuhfatalilmacademy@gmail.com`
   - Developer contact email: `tuhfatalilmacademy@gmail.com`
   - Scopes: `email`, `profile`, `openid`
4. Navigate to **APIs & Services** -> **Credentials** -> **Create Credentials** -> **OAuth client ID**:
   - Application type: **Web application**
   - Name: `Tuhfat Academy Production Web`
   - **Authorized JavaScript origins**:
     - `https://yourdomain.com` (and `https://www.yourdomain.com`)
     - `http://localhost:3000` (for testing)
   - **Authorized redirect URIs**:
     - `https://yourdomain.com`
     - `https://yourdomain.com/admin/login`
5. Copy your **Client ID** (e.g. `1234567890-abc123xyz.apps.googleusercontent.com`).
6. Add this Client ID to your Hostinger `.env` file as `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`.

---

## 5. SMTP Email Setup (Hostinger Webmail)

To receive real-time email notifications for free trial bookings and contact inquiries:

1. In **Hostinger hPanel**, go to **Emails** -> **Email Accounts**.
2. Create an email account such as `admissions@yourdomain.com`.
3. In your `.env` configuration, set:
   ```ini
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=admissions@yourdomain.com
   SMTP_PASS=YourEmailPassword123!
   SMTP_FROM="Tuhfat Al-Ilm Academy Admissions <admissions@yourdomain.com>"
   ```
*Note: If SMTP is not configured, the website still saves all enquiries permanently to the database and alerts the admin in `/admin/inquiries`.*

---

## 6. Hostinger Node.js Application Configuration

1. In **hPanel**, navigate to **Websites** -> select your website -> **Node.js**:
2. Configure settings:
   - **Node.js version**: `20.x` or `22.x` (LTS recommended)
   - **Application mode**: `Production`
   - **Application root**: `/home/u123456789/domains/yourdomain.com/public_html` (or project root)
   - **Application startup file**: `server.js`
   - **Package manager**: `npm`
3. Click **Save Changes**.

---

## 7. Environment Variables Configuration

Create a file named `.env` in the root of your Node.js application directory (or set via Hostinger environment variables tab):

```ini
# --- Core Server ---
NODE_ENV=production
PORT=3000
APP_URL=https://yourdomain.com

# --- Authorized Administrators (Only these 2 emails have admin access) ---
ADMIN_EMAIL=aneesattari67@gmail.com
ACADEMY_ADMIN_EMAIL=tuhfatalilmacademy@gmail.com

# --- Hostinger MySQL Database ---
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=u123456789_admin
MYSQL_PASSWORD=YourSecureDatabasePassword123!
MYSQL_DATABASE=u123456789_tuhfat

# --- Master Admin Password ---
ADMIN_INITIAL_PASSWORD=YourSecureAdminPassword2026!

# --- Google OAuth Client ID ---
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com

# --- SMTP Notifications (Optional) ---
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admissions@yourdomain.com
SMTP_PASS=YourEmailPassword123!
SMTP_FROM="Tuhfat Al-Ilm Academy <admissions@yourdomain.com>"
```

---

## 8. Build & Start Commands

In Hostinger Terminal or SSH:

```bash
# 1. Install dependencies
npm install

# 2. Build frontend and bundle server.js
npm run build

# 3. Start application
npm start
```

Or via Hostinger hPanel buttons:
- Click **Run NPM Install**
- Run **npm run build** via Terminal
- Click **Restart** on the Node.js Web App dashboard.

---

## 9. GitHub Deployment (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Tuhfat Al-Ilm Academy Production Release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tuhfat-al-ilm-academy.git
   git push -u origin main
   ```
2. In Hostinger hPanel -> **Git**:
   - Repository: `https://github.com/YOUR_USERNAME/tuhfat-al-ilm-academy.git`
   - Branch: `main`
   - Target Directory: `/public_html`
3. Click **Deploy**.

---

## 10. Verification Checklist

- [ ] Public site loads at `https://yourdomain.com/`
- [ ] Mobile hamburger drawer menu opens from the right with smooth overlay
- [ ] All 10 course cards have working "Learn More" buttons linking directly to `/courses/[slug]`
- [ ] Trial booking form saves to database, returns booking reference `TAB-xxxxxx`, and dispatches notification
- [ ] Direct URLs work: `/about`, `/courses`, `/teachers`, `/how-it-works`, `/resources`, `/faq`, `/contact`, `/health`
- [ ] System health check responds at `/health` and `/api/health`
- [ ] Admin Portal accessible at `/admin/login`
- [ ] "Continue with Google" starts real Google OAuth flow
- [ ] Authorized emails (`aneesattari67@gmail.com`, `tuhfatalilmacademy@gmail.com`) granted admin access
- [ ] Unauthorized Google accounts receive clear Access Denied error
- [ ] Admin Dashboard, Analytics, Courses, Inquiries, Content, and Settings load real data

---

## 11. Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| **Cannot GET /api/...** | App running as static files only | Ensure Hostinger startup file is set to `server.js` and Node.js app is started. |
| **Database connection refused** | Incorrect MySQL credentials | Verify `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` in `.env`. Host should be `localhost`. |
| **Google Sign-In "Origin not allowed"** | Domain not added to Google Console | Add your exact domain (both `https://yourdomain.com` and `https://www.yourdomain.com`) to Authorized JavaScript Origins in Google Cloud Console. |
| **Page reloads show 404** | Web server not routing to Node | In Hostinger, configure Apache/Nginx reverse proxy to forward traffic to `http://localhost:3000` or rely on Hostinger's automatic Node.js port binding. |

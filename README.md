# Tuhfat Al-Ilm Academy — Public Website & Admin System

A complete, production-ready full-stack application for **Tuhfat Al-Ilm Academy** featuring:
1. **Public Website**: High-performance, international Islamic educational website.
2. **Private Admin Dashboard**: Secure administrative portal for course management, lead inquiry tracking, announcements, dynamic content editing, and privacy-conscious analytics.
3. **Cloudflare Architecture**: Full support for Cloudflare Pages, Cloudflare Pages Functions, and Cloudflare D1 database.
4. **Local Dev Environment**: Self-contained SQLite + Express + Vite dev server running on Port 3000.

---

## 🌟 Academy Information & Official Contacts

- **Academy Name**: Tuhfat Al-Ilm Academy
- **WhatsApp**: [0317 1503094](https://wa.me/923171503094) (International: `+92 317 1503094`)
- **Phone**: [0309 6794698](tel:+923096794698) (International: `+92 309 6794698`)
- **SMS / Message**: [0309 6794698](sms:+923096794698)
- **Email**: [tuhfatalilmacademy@gmail.com](mailto:tuhfatalilmacademy@gmail.com)

---

## 🏗️ Architecture & Route Separation

### A. Public Website
- `/` — Homepage (Hero, Why Learn With Us, Featured Courses, 4-Step Process, About Preview, Announcements, Final CTA)
- `/about` — About Us (Mission, Approach, Who We Teach, Learning Philosophy)
- `/courses` — Course Catalog (All 10 programs with category filters & enrollment actions)
- `/how-it-works` — How It Works (4-step onboarding timeline & equipment checklist)
- `/faq` — FAQ (Accessible interactive accordion)
- `/contact` — Contact & Enrollment (Direct WhatsApp, Call, SMS, Email buttons & lead capture form)

*Note: The public website is completely separated from the administration area. Admin links never appear in public navigation, mobile menu, footer, or sitemap.*

### B. Private Admin Dashboard
- `/admin/login` — Administrator authentication & first-time setup
- `/admin/dashboard` — Protected admin portal:
  - **Overview**: Real-time metric cards (inquiries, courses, real page views, WhatsApp/Call/SMS/Email clicks) with time range selector (`Today`, `7 Days`, `30 Days`, `All Time`).
  - **Website Content**: Live editing of headline, subtitle, about text, and contact information with database persistence.
  - **Courses**: Add, edit, publish/unpublish, and delete courses.
  - **Inquiries**: Filterable table of leads received from the contact form with status progression (`New`, `Contacted`, `In Progress`, `Completed`, `Archived`).
  - **Announcements**: Publish time-sensitive notices to the public homepage.
  - **Analytics**: Privacy-safe event breakdown and popular pages list (zero fake statistics).
  - **Settings**: Brand and SEO configuration.
  - **Account & Security**: Cryptographic PBKDF2 password change & active session view.

---

## 🔒 Security Specifications

- **Server-Side Authentication**: All admin routes and API endpoints verify server-side sessions before returning or modifying data.
- **HTTP-Only Cookies**: Sessions are issued as secure `HttpOnly; SameSite=Lax` cookies named `admin_session`.
- **Password Protection**: Passwords are never stored in plain text. Hashed using PBKDF2 with unique cryptographic salts (100,000 iterations, SHA-256).
- **First-Time Admin Setup**: If zero admins exist in the database, `/admin/login` securely prompts the master administrator to set their email and password. Once registered, the setup endpoint automatically locks permanently (403 Forbidden).
- **Zero Public Exposure**: Private student inquiries, admin hashes, and session tokens are strictly blocked from public API endpoints.

---

## ☁️ Cloudflare Pages & D1 Setup Guide

### Step 1: Create a Cloudflare D1 Database
In your local terminal with Cloudflare Wrangler installed:
```bash
npx wrangler d1 create tuhfat_db
```
Wrangler will output your database ID, for example:
```
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 2: Configure `wrangler.toml`
Open `wrangler.toml` in the project root and replace `YOUR_CLOUDFLARE_D1_DATABASE_ID` with the ID generated in Step 1:
```toml
name = "tuhfat-al-ilm-academy"
compatibility_date = "2024-09-23"
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "DB"
database_name = "tuhfat_db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 3: Run Database Migrations
Execute the schema file on your Cloudflare D1 database:
```bash
# For local D1 testing:
npx wrangler d1 execute tuhfat_db --local --file=./migrations/schema.sql

# For production Cloudflare D1:
npx wrangler d1 execute tuhfat_db --remote --file=./migrations/schema.sql
```

### Step 4: Connect to GitHub & Cloudflare Pages
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Tuhfat Al-Ilm Academy full-stack release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tuhfat-al-ilm-academy.git
   git push -u origin main
   ```
2. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your repository.
4. Set build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Go to your Pages project **Settings** -> **Functions** -> **D1 Database Bindings**:
   - Variable name: `DB`
   - D1 database: `tuhfat_db`

### Step 5 (Optional): Set Initial Admin Credentials via Secrets
In Cloudflare Pages **Settings** -> **Environment variables**:
- `ADMIN_EMAIL` = `your-admin@email.com`
- `ADMIN_INITIAL_PASSWORD` = `YourStrongPasswordHere!`

Alternatively, visit `https://your-domain.com/admin/login` right after first deployment. Because zero admins exist initially, you will be greeted by the **First-Time Admin Setup** screen to create your administrator account!

---

## 🛠️ Local Development (Node.js & SQLite)

The repository includes a full-stack local server using Node.js built-in SQLite:
```bash
# Start development server on port 3000
npm run dev

# Build production frontend bundle
npm run build

# Run TypeScript lint check
npm run lint
```

When you visit:
- `http://localhost:3000/` — Browse public website
- `http://localhost:3000/admin/login` — Access admin setup & login
- `http://localhost:3000/admin/dashboard` — View administration dashboard

---

## 🌐 Custom Hostinger Domain Configuration

1. In Cloudflare Pages, go to **Custom Domains** -> **Set up a custom domain**.
2. Enter your domain (e.g. `tuhfatalilm.com` and `www.tuhfatalilm.com`).
3. In your **Hostinger hPanel**, update your domain's nameservers to the two Cloudflare nameservers provided by Cloudflare.
4. Replace `YOUR-DOMAIN.com` placeholder in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.

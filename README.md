# Tuhfat Al-Ilm Academy — Official Production Website & Admin System

A production-grade, full-stack web application for **Tuhfat Al-Ilm Academy** — an international online Islamic academy offering structured Quranic recitation, memorization, and Islamic foundational courses.

Target Deployment Platform: **Hostinger Node.js Web App** with **MySQL / MariaDB**.

---

## 🌟 Academy Overview & Official Contacts

- **Academy Name**: Tuhfat Al-Ilm Academy
- **Curriculum**:
  - Hifz-e-Quran (Memorization Program)
  - Quran Reading / Nazra (Foundational Recitation)
  - Tajweed-o-Qirat (Phonetic Precision & Articulation)
  - Quran Translation & Comprehension
  - Islamic Studies (Core Curriculum)
  - Basic Islamic Knowledge (Salah & Fiqh Essentials)
  - Islah / Character Development (Tarbiyah & Etiquette)
  - Dua and Sunnah (Daily Supplications & Prophetic Manners)
  - Children's Islamic Education
  - One-to-One Personalized Classes
- **Official Admissions Phone / WhatsApp**: `+92 317 1503094`
- **Customer Support Phone**: `+92 309 6794698`
- **Official Admissions Email**: `tuhfatalilmacademy@gmail.com`

---

## 🧭 Public Website Routes

All routes work directly in production:

- `/` — Academy Homepage (Hero, Why Choose Us, Featured Courses, Curriculum, FAQ, CTA)
- `/about` — About Us & Educational Philosophy
- `/courses` — Comprehensive Course Catalog with category filters
- `/courses/[slug]` — Dedicated Course Detail Pages for all 10 programs
- `/teachers` — Qualified Faculty & Certified Scholars Profile
- `/how-it-works` — Step-by-Step Enrollment & Class Onboarding
- `/resources` — Free Islamic & Quranic Learning Resources
- `/faq` — Interactive Frequently Asked Questions
- `/contact` — Contact Office & Free Trial Booking Application
- `/health` — Real-Time Infrastructure & Database Telemetry
- `/404` — Custom 404 Not Found Page

---

## 🔐 Private Admin System

The Administration Portal is protected behind real authentication:

- `/admin/login` — Administrator Sign In (Google OAuth + Password authentication)
- `/admin` & `/admin/dashboard` — Overview KPI Dashboard & Recent Activity
- `/admin/analytics` — Engagement & Inquiry Visualizations (Recharts)
- `/admin/content` — Course & Site Content CMS
- `/admin/courses` — Course Catalog Management
- `/admin/inquiries` — Trial Bookings & Inquiries Pipeline
- `/admin/settings` — Academy Operational Settings

### Authorized Administrators
Only two email accounts are authorized to enter `/admin`:
1. `YOUR_OFFICIAL_EMAIL` (`aneesattari67@gmail.com` or custom `ADMIN_EMAIL`)
2. `tuhfatalilmacademy@gmail.com` (`ACADEMY_ADMIN_EMAIL`)

Any other Google account or unrecognized login receives an immediate `403 Access Denied` result.

---

## ⚙️ Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (starts on Port 3000)
npm run dev

# 3. Build production bundle (client in dist/ and server in server.js)
npm run build

# 4. Start production server
npm start
```

---

## 🚀 Hostinger Production Deployment

For complete, step-by-step instructions on setting up **Hostinger MySQL**, **Google OAuth 2.0 Web Client**, and **Hostinger Node.js Web App**, refer to:

👉 **[HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)**

---

## 📄 License & Intellectual Property

Copyright © 2026 Tuhfat Al-Ilm Academy. All rights reserved.

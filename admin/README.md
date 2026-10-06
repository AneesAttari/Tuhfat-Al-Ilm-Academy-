# Tuhfat Al-Ilm Academy - Administration System

## Overview
This directory and `src/admin/` contain the private administrative portal for Tuhfat Al-Ilm Academy.

## Direct URL Access
- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`

## Admin Sections & Architecture
1. **Login & Session Authentication**: `src/admin/AdminLoginPage.tsx` & `/api/auth/*`
2. **Dashboard Master View**: `src/admin/AdminDashboardPage.tsx`
3. **Course Management**: `src/admin/courses/AdminCoursesView.tsx` & `/api/courses`
4. **Student Inquiries**: `src/admin/inquiries/AdminInquiriesView.tsx` & `/api/inquiries`
5. **Website Content**: `src/admin/content/AdminContentView.tsx` & `/api/content`
6. **Analytics & Views**: `src/admin/analytics/AdminAnalyticsView.tsx` & `/api/analytics`
7. **Security & Credentials**: `src/admin/settings/AdminSettingsView.tsx` & `/api/auth/change-password`

## Privacy & Public Isolation
As required:
- The Admin section does **NOT** appear in the public website's navigation header, footer, or sitemap.
- Crawlers are disallowed via `public/robots.txt`.
- Direct URL access to `/admin/login` is fully functional and protected.

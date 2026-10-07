-- -------------------------------------------------------------
-- Tuhfat Al-Ilm Academy - Production MySQL / MariaDB Database Schema
-- Compatible with Hostinger MySQL 5.7+ / MariaDB 10.3+ and SQLite
-- -------------------------------------------------------------

-- 1. Administrators Table
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  created_at VARCHAR(100) NOT NULL,
  updated_at VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sessions Table (Server-side Session Storage with Expiry)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  admin_id VARCHAR(255) NOT NULL,
  expires_at VARCHAR(100) NOT NULL,
  created_at VARCHAR(100) NOT NULL,
  INDEX idx_sessions_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Site Settings Table (Key-Value Dynamic CMS Settings)
CREATE TABLE IF NOT EXISTS site_settings (
  key_name VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(255) PRIMARY KEY,
  slug VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  suitable_for TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL DEFAULT 'BookOpen',
  display_order INT NOT NULL DEFAULT 0,
  published INT NOT NULL DEFAULT 1,
  duration VARCHAR(100),
  instructor VARCHAR(255),
  level VARCHAR(100),
  image_url TEXT,
  features TEXT,
  what_you_learn TEXT,
  learning_approach TEXT,
  class_format TEXT,
  benefits TEXT,
  faq TEXT,
  created_at VARCHAR(100) NOT NULL,
  updated_at VARCHAR(100) NOT NULL,
  INDEX idx_courses_published (published, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Inquiries & Free Trial Requests Table (Permanently captured)
CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  course VARCHAR(255) NOT NULL,
  preferred_date VARCHAR(100),
  preferred_time VARCHAR(100),
  timezone VARCHAR(100),
  country VARCHAR(100),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Pending', 'In Progress', 'Enrolled', 'Completed', 'Closed'
  source VARCHAR(100) DEFAULT 'Website',
  notes TEXT,
  email_sent INT DEFAULT 0,
  created_at VARCHAR(100) NOT NULL,
  updated_at VARCHAR(100) NOT NULL,
  INDEX idx_inquiries_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_text TEXT NOT NULL,
  full_text TEXT NOT NULL,
  published INT NOT NULL DEFAULT 1,
  created_at VARCHAR(100) NOT NULL,
  updated_at VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Analytics Events Table (Privacy-conscious lightweight tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL, -- 'page_view', 'whatsapp_click', 'call_click', 'sms_click', 'email_click', 'course_click', 'form_submit'
  page VARCHAR(255) NOT NULL,
  course_id VARCHAR(255),
  session_id VARCHAR(255),
  created_at VARCHAR(100) NOT NULL,
  INDEX idx_analytics_created (created_at, event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Users / Students Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  salt VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'student', -- 'student', 'admin'
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  phone VARCHAR(100),
  auth_provider VARCHAR(50) NOT NULL DEFAULT 'local', -- 'local', 'google'
  created_at VARCHAR(100) NOT NULL,
  updated_at VARCHAR(100) NOT NULL,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  expires_at VARCHAR(100) NOT NULL,
  created_at VARCHAR(100) NOT NULL,
  INDEX idx_user_sessions_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Password Resets Table
CREATE TABLE IF NOT EXISTS password_resets (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  otp_code VARCHAR(50) NOT NULL,
  expires_at VARCHAR(100) NOT NULL,
  used INT NOT NULL DEFAULT 0,
  created_at VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Email Notifications Audit Log Table
CREATE TABLE IF NOT EXISTS email_notifications (
  id VARCHAR(255) PRIMARY KEY,
  inquiry_id VARCHAR(255),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  created_at VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

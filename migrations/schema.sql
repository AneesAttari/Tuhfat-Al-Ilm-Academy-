-- Cloudflare D1 / SQLite Database Schema for Tuhfat Al-Ilm Academy

-- 1. Administrators Table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Sessions Table (Server-side Session Storage with Expiry)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- 3. Site Settings Table (Key-Value Dynamic CMS Settings)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  suitable_for TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'BookOpen',
  display_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 5. Inquiries Table (Private lead capture from contact/enrollment form)
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Completed', 'Archived'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_text TEXT NOT NULL,
  full_text TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 7. Analytics Events Table (Privacy-conscious lightweight tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view', 'whatsapp_click', 'call_click', 'sms_click', 'email_click', 'course_click', 'form_submit'
  page TEXT NOT NULL,
  course_id TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL
);

-- 8. Normal Users / Students Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  salt TEXT,
  role TEXT NOT NULL DEFAULT 'student', -- 'student', 'admin'
  auth_provider TEXT NOT NULL DEFAULT 'local', -- 'local', 'google'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 9. Normal User Sessions Table (Persistent session storage)
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published, display_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at, event_type);

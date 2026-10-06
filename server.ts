import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
const DB_PATH = path.resolve(DB_DIR, 'tuhfat.db');

// Database Abstraction Supporting Hostinger MySQL / MariaDB and Local SQLite Fallback
let mysqlPool: any = null;
let sqliteDb: any = null;
const isMysql = Boolean(process.env.MYSQL_HOST || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql')));

async function initDatabase() {
  if (isMysql) {
    try {
      const mysql = await import('mysql2/promise');
      if (process.env.DATABASE_URL) {
        mysqlPool = mysql.createPool(process.env.DATABASE_URL);
      } else {
        mysqlPool = mysql.createPool({
          host: process.env.MYSQL_HOST || 'localhost',
          port: Number(process.env.MYSQL_PORT || 3306),
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
      }
      console.log('[DB] Connected to Hostinger MySQL / MariaDB Database.');
    } catch (err) {
      console.error('[DB] Failed to connect to MySQL, falling back to SQLite:', err);
      const { DatabaseSync } = await import('node:sqlite');
      sqliteDb = new DatabaseSync(DB_PATH);
      sqliteDb.exec('PRAGMA journal_mode = WAL;');
      sqliteDb.exec('PRAGMA foreign_keys = ON;');
    }
  } else {
    const { DatabaseSync } = await import('node:sqlite');
    sqliteDb = new DatabaseSync(DB_PATH);
    sqliteDb.exec('PRAGMA journal_mode = WAL;');
    sqliteDb.exec('PRAGMA foreign_keys = ON;');
    console.log('[DB] Connected to local SQLite Database at ' + DB_PATH);
  }

  // Ensure all required tables exist
  await dbExecute(`
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      created_at VARCHAR(100) NOT NULL,
      updated_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      admin_id VARCHAR(255) NOT NULL,
      expires_at VARCHAR(100) NOT NULL,
      created_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key_name VARCHAR(255) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
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
      updated_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
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
      status VARCHAR(50) NOT NULL DEFAULT 'New',
      source VARCHAR(100) DEFAULT 'Website',
      notes TEXT,
      email_sent INT DEFAULT 0,
      created_at VARCHAR(100) NOT NULL,
      updated_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS announcements (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      short_text TEXT NOT NULL,
      full_text TEXT NOT NULL,
      published INT NOT NULL DEFAULT 1,
      created_at VARCHAR(100) NOT NULL,
      updated_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id VARCHAR(255) PRIMARY KEY,
      event_type VARCHAR(100) NOT NULL,
      page VARCHAR(255) NOT NULL,
      course_id VARCHAR(255),
      session_id VARCHAR(255),
      created_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      salt VARCHAR(255),
      role VARCHAR(50) NOT NULL DEFAULT 'student',
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      phone VARCHAR(100),
      auth_provider VARCHAR(50) NOT NULL DEFAULT 'local',
      created_at VARCHAR(100) NOT NULL,
      updated_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      expires_at VARCHAR(100) NOT NULL,
      created_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      otp_code VARCHAR(50) NOT NULL,
      expires_at VARCHAR(100) NOT NULL,
      used INT NOT NULL DEFAULT 0,
      created_at VARCHAR(100) NOT NULL
    );
  `);

  await dbExecute(`
    CREATE TABLE IF NOT EXISTS email_notifications (
      id VARCHAR(255) PRIMARY KEY,
      inquiry_id VARCHAR(255),
      recipient VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      error_message TEXT,
      created_at VARCHAR(100) NOT NULL
    );
  `);

  // Seed courses if empty
  const courseCountRow = await dbQueryOne('SELECT COUNT(*) as count FROM courses');
  if (!courseCountRow || Number(courseCountRow.count) === 0) {
    await seedCoursesTable();
  }

  // Seed site_settings if empty
  const settingsCountRow = await dbQueryOne('SELECT COUNT(*) as count FROM site_settings');
  if (!settingsCountRow || Number(settingsCountRow.count) === 0) {
    await seedSettingsTable();
  }

  // Ensure primary administrators exist
  await seedAdminUsers();
}

async function dbQueryAll(sql: string, params: any[] = []): Promise<any[]> {
  if (mysqlPool) {
    const [rows] = await mysqlPool.execute(sql, params);
    return rows as any[];
  } else {
    const stmt = sqliteDb.prepare(sql);
    return stmt.all(...params);
  }
}

async function dbQueryOne(sql: string, params: any[] = []): Promise<any | null> {
  if (mysqlPool) {
    const [rows]: any = await mysqlPool.execute(sql, params);
    return rows && rows.length > 0 ? rows[0] : null;
  } else {
    const stmt = sqliteDb.prepare(sql);
    return stmt.get(...params) || null;
  }
}

async function dbExecute(sql: string, params: any[] = []): Promise<any> {
  if (mysqlPool) {
    const [result] = await mysqlPool.execute(sql, params);
    return result;
  } else {
    const stmt = sqliteDb.prepare(sql);
    return stmt.run(...params);
  }
}

// Password hashing helper
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
}

// Cookie parsing helper
function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((c) => {
    const [name, ...rest] = c.trim().split('=');
    if (name) cookies[name] = decodeURIComponent(rest.join('='));
  });
  return cookies;
}

// Authorized Admin Emails
const AUTHORIZED_ADMIN_EMAILS = [
  'tuhfatulilmacademy@gmail.com',
  'tuhfatalilmacademy@gmail.com',
  'tohfatulilmacademy@gmail.com',
  'aneesattari67@gmail.com'
];

async function isAuthorizedAdminEmail(email: string): Promise<boolean> {
  const norm = email.trim().toLowerCase();
  if (AUTHORIZED_ADMIN_EMAILS.includes(norm)) return true;
  if (norm.endsWith('@tuhfatalilm.com') || norm.endsWith('@tuhfatulilm.com')) return true;
  const existing = await dbQueryOne('SELECT id FROM admins WHERE LOWER(email) = ?', [norm]);
  return !!existing;
}

async function seedAdminUsers() {
  for (const adminMail of AUTHORIZED_ADMIN_EMAILS) {
    const existing = await dbQueryOne('SELECT id, email FROM admins WHERE LOWER(email) = ?', [adminMail]);
    if (!existing) {
      const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@Tuhfat2026!';
      const salt = crypto.randomUUID();
      const hash = hashPassword(adminPass, salt);
      const now = new Date().toISOString();
      await dbExecute(`
        INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [crypto.randomUUID(), adminMail, hash, salt, now, now]);
    }
  }
}

async function seedCoursesTable() {
  const seedCourses = [
    {
      id: 'nazra',
      slug: 'quran-reading',
      title: 'Quran Reading / Nazra',
      category: 'Foundational Recitation',
      short: 'Hone your Quran reading skills with guided lessons suitable for beginners and learners who want to improve their recitation.',
      desc: 'Our Quran Reading (Nazra) course provides systematic, patient instruction for students taking their first steps in reading the Holy Quran or those who wish to correct and polish their reading fluency. Beginning with Arabic letter recognition and phonetics from the Qaida, students progress methodically through connecting letters, vowel markings (Harakat), Tanween, Sukoon, and Madd rules until they read directly from the Holy Quran with confidence, clarity, and correct pronunciation.',
      suitable: 'Beginners of all ages, children starting their Quran journey, and adults wishing to refresh, correct, or build steady reading fluency from the basics.',
      icon: 'BookOpen',
      order: 1,
      duration: '3 to 6 months',
      instructor: 'Certified Qari',
      level: 'Beginner',
      features: ['Letter recognition & articulation points (Makharij)', 'Step-by-step Qaida to Quran transition', 'Phonetic vowel control and fluid recitation'],
      whatYouLearn: ['Arabic alphabet recognition, phonetic sounds, and single-letter articulation', 'Mastery of essential Harakat (Fatha, Kasra, Damma), Tanween, Sukoon, and Tashdeed', 'Rules of connecting letters into words and smooth continuous sentences', 'Methodical graduation from foundational Qaida to reading the Holy Quran directly', 'Proper breath management, stopping points, and natural recitation rhythm', 'Guided recitation practice of selected short Surahs with individual correction'],
      learningApproach: 'Step-by-step guided recitation with continuous, gentle teacher feedback and repeated vocal practice to ensure proper fluency and eliminate hesitation.',
      classFormat: 'Personalized 1-on-1 online classes (30 to 45 minutes) scheduled at your preferred daily or weekly times across any timezone.',
      benefits: ['Build a rock-solid foundation for reciting the Holy Quran accurately', 'Overcome hesitation, stammering, and pronunciation errors', 'Patient, qualified teachers experienced with both young children and adult beginners', 'Flexible scheduling adapted to work, school, and family routines'],
      faq: [
        { question: 'Can an absolute beginner who does not know Arabic letters join?', answer: 'Yes, absolutely. The course starts from the foundational Qaida level, teaching Arabic alphabet recognition from the very first letter.' },
        { question: 'How long does it take to start reading from the Quran?', answer: 'Most students complete the foundational Qaida and begin reading directly from the Holy Quran within 3 to 6 months, depending on weekly class frequency and regular practice.' },
        { question: 'Is this course suitable for adult learners?', answer: 'Yes. Many adult students join us to correct their pronunciation, eliminate old recitation habits, and gain confidence reading the Quran fluently.' },
        { question: 'Are classes one-to-one or in groups?', answer: 'All our core Nazra classes are conducted one-to-one, ensuring 100% individual attention from the teacher.' }
      ]
    },
    {
      id: 'hifz',
      slug: 'hifz-ul-quran',
      title: 'Hifz-ul-Quran',
      category: 'Memorization Program',
      short: 'A structured learning environment for students working toward memorizing the Holy Quran.',
      desc: 'The Hifz-ul-Quran program provides a disciplined, structured, and spiritually nurturing atmosphere for students dedicated to memorizing the Holy Quran. Guided by experienced Huffaz, the curriculum balances daily new lessons (Sabaq) with recent lesson retention (Sabaqi) and long-term cumulative revision (Manzil). Each student receives personalized targets and daily attention to maintain strong retention, accuracy, and Tajweed standards.',
      suitable: 'Committed students of all ages who can read the Quran with good fluency and wish to memorize selected Surahs, specific Ajza (Juz), or complete the entire Holy Quran.',
      icon: 'BookMarked',
      order: 2,
      duration: '1 to 3 years',
      instructor: 'Certified Hafiz',
      level: 'Intermediate to Advanced',
      features: ['Daily Sabaq and systematic revision', 'Personalized retention strategies', 'Continuous progress monitoring and Tajweed verification'],
      whatYouLearn: ['Proven Quranic memorization methodologies tailored to individual cognitive capacity', 'Daily Sabaq: Reciting newly memorized verses with zero errors to the instructor', 'Daily Sabaqi: Thorough consolidation of verses memorized in the past 7 to 14 days', 'Daily Manzil: Long-term revision cycles covering previously mastered Ajza to prevent forgetting', 'Maintaining precise Tajweed and correct Waqf conventions during memorization', 'Spiritual disciplines, ethics, and habits of preserving the Holy Quran in the heart'],
      learningApproach: 'Daily one-to-one recitation to a certified Hafiz instructor with strict monitoring of retention, phonetic precision, and personalized revision schedules.',
      classFormat: 'Dedicated 1-on-1 daily or 4-5 days/week sessions with structured tracking of Sabaq, Sabaqi, and Manzil.',
      benefits: ['Structured memorization roadmap prevents fatigue and memory loss', 'Daily accountability and motivating guidance from experienced Huffaz', 'Customized memorization pace suited to school, work, or full-time schedules', 'Option to memorize specific portions or the entire Quran'],
      faq: [
        { question: 'Can I memorize part of the Quran rather than the entire Quran?', answer: 'Yes. Many students enroll to memorize specific chapters like Juz Amma, Surah Al-Mulk, Surah Al-Kahf, or Surah Ar-Rahman.' },
        { question: 'What is required before starting Hifz?', answer: 'Students should be able to read the Quran fluently with basic Tajweed before beginning memorization.' },
        { question: 'How much revision is done daily?', answer: 'Equal or greater time is dedicated to revising previous portions (Sabaqi and Manzil) alongside learning new verses to guarantee long-term retention.' }
      ]
    },
    {
      id: 'tajweed',
      slug: 'tajweed',
      title: 'Tajweed',
      category: 'Art of Recitation',
      short: 'Learn the principles of correct Quranic pronunciation and recitation.',
      desc: 'The Tajweed course is designed for students who can read Arabic but want to perfect their articulation and recite the Holy Quran exactly as it was revealed to Prophet Muhammad (peace be upon him). Through deep study of Makharij, Sifaat, rules of Noon and Meem Saakin, Ghunnah, Qalqalah, Idgham, Ikhfa, and Waqf, students transform their recitation into an accurate, melodious, and spiritually moving experience.',
      suitable: 'Learners who already read the Quran but wish to eliminate pronunciation flaws, understand classical Tajweed principles, and recite with accuracy and beauty.',
      icon: 'Sparkles',
      order: 3,
      duration: '3 to 4 months',
      instructor: 'Senior Tajweed Instructor',
      level: 'Intermediate',
      features: ['Makharij & letter articulation rules', 'Rules of Noon Saakin, Meem Saakin & Madd', 'Practical recitation correction'],
      whatYouLearn: ['Makharij al-Huroof: Precise origin points of all 28 Arabic letters in the throat, tongue, and lips', 'Sifaat al-Huroof: Permanent and conditional letter characteristics', 'Rules of Noon Saakin and Tanween: Izhar, Idgham, Iqlab, and Ikhfa', 'Rules of Meem Saakin and Madd rules', 'Rules of Waqf (stopping) and Ibtida (resuming)'],
      learningApproach: 'Practical talaqqi (oral transmission) and direct listening and correction where the instructor demonstrates and the student practices until mastery.',
      classFormat: '1-on-1 personalized sessions focusing on practical recitation alongside essential theoretical explanations.',
      benefits: ['Recite the Holy Quran with precision according to traditional prophetic rules', 'Prevent hidden and obvious recitation mistakes', 'Gain confidence reciting aloud in Salah and gatherings'],
      faq: [
        { question: 'Is Tajweed difficult for non-native Arabic speakers?', answer: 'Not with proper guidance. Our teachers specialize in training non-native speakers to produce authentic Arabic sounds with patience and exercises.' },
        { question: 'How soon will I notice improvement in my recitation?', answer: 'Most students notice marked improvements in pronunciation and letter clarity within the first few weeks of regular classes.' }
      ]
    },
    {
      id: 'translation',
      slug: 'quran-translation',
      title: 'Quran Translation',
      category: 'Comprehension',
      short: 'Develop an understanding of Quranic meanings through guided study.',
      desc: 'Our Quran Translation and Comprehension course allows students to connect directly with the divine message. Moving beyond recitation alone, this course provides clear word-for-word translation, idiomatic sentence understanding, and essential contextual explanations (Tafsir highlights). Students discover the themes, commands, parables, and timeless guidance of the Quran, enriching their daily Salah and personal faith.',
      suitable: 'Students and adults desiring to comprehend the Quranic message during daily recitation and Salah, deepening their personal connection with Allah SWT.',
      icon: 'Languages',
      order: 4,
      duration: '6 to 12 months',
      instructor: 'Islamic Scholar',
      level: 'All Levels',
      features: ['Word-by-word Quranic vocabulary', 'Contextual verse explanations', 'Deeper connection with daily prayers'],
      whatYouLearn: ['Word-by-word translation and root word analysis of frequently repeated Quranic terms', 'Grammatical breakdown of Quranic sentence structures', 'Contextual background (Asbab al-Nuzul) of key Surahs', 'Central themes and spiritual insights of the verses'],
      learningApproach: 'Verse-by-verse translation with linguistic explanation, thematic summaries, and interactive discussion of practical lessons.',
      classFormat: '1-on-1 or interactive small group online lessons with structured study sheets and vocabulary lists.',
      benefits: ['Understand the meaning of the verses during daily prayers (Salah) and Taraweeh', 'Build a working vocabulary of common Quranic Arabic words', 'Engage with the Quran as a direct source of personal guidance and solace'],
      faq: [
        { question: 'Do I need to know classical Arabic grammar first?', answer: 'No prior Arabic grammar knowledge is required. The course teaches vocabulary and grammar organically through the verses.' },
        { question: 'Which Surahs are studied first?', answer: 'We typically begin with Surah Al-Fatihah and the short Surahs of Juz Amma (frequently recited in prayer), then proceed progressively.' }
      ]
    },
    {
      id: 'islamic-studies',
      slug: 'islamic-studies',
      title: 'Islamic Studies',
      category: 'Core Curriculum',
      short: 'Learn essential Islamic beliefs, practices, manners, and knowledge.',
      desc: 'A comprehensive, well-rounded curriculum designed to provide students with authentic, grounded Islamic knowledge. Covering the foundational articles of faith (Aqeedah), the essential rules of daily worship and dealings (Fiqh), the inspiring life and character of Prophet Muhammad (Seerah), and the stories of the noble Prophets and Sahabah.',
      suitable: 'Youth and adult learners seeking a balanced, authentic grounding in Islamic faith, everyday practice, and classical Islamic history.',
      icon: 'GraduationCap',
      order: 5,
      duration: 'Ongoing / Modular',
      instructor: 'Curriculum Director',
      level: 'All Levels',
      features: ['Articles of Islamic faith (Aqeedah)', 'Fiqh of everyday worship and transactions', 'Prophetic biography (Seerah)'],
      whatYouLearn: ['Aqeedah: The six pillars of Iman', 'Fiqh: Essential rulings of Taharah, Salah, Sawm, and Zakah', 'Seerah: Life of Prophet Muhammad from early life to Madinah', 'Stories of the Prophets and noble Sahabah', 'Islamic ethics and family values'],
      learningApproach: 'Interactive modules combining historical narrative, authentic evidence, practical life examples, and Q&A sessions.',
      classFormat: 'Personalized online classes with customized weekly lessons and age-appropriate study materials.',
      benefits: ['Develop a firm, confident Islamic identity grounded in authentic sources', 'Understand the wisdom behind Islamic commands and prohibitions', 'Gain clarity on everyday religious obligations'],
      faq: [
        { question: 'Is the syllabus suitable for youth living in Western countries?', answer: 'Yes. The curriculum is specifically curated to help young Muslims navigate everyday challenges while preserving strong faith and manners.' }
      ]
    },
    {
      id: 'basic-knowledge',
      slug: 'basic-islamic-knowledge',
      title: 'Basic Islamic Knowledge',
      category: 'Essentials',
      short: 'Build a strong foundation in everyday Islamic knowledge.',
      desc: 'The Basic Islamic Knowledge course provides practical, step-by-step guidance on the essential daily duties every Muslim needs to know. From how to perform Wudu and Ghusl with proper Sunnah methods, to performing the five daily prayers (Salah) with correct postures, recitations, and timings.',
      suitable: 'Reverts, beginners, and young students building the core essentials of Islamic practice and daily obligations.',
      icon: 'Compass',
      order: 6,
      duration: '2 to 3 months',
      instructor: 'Resident Teacher',
      level: 'Beginner',
      features: ['Salah fundamentals & practical postures', 'Rules of purity, Wudu and Ghusl', 'Everyday Islamic obligations and boundaries'],
      whatYouLearn: ['Practical demonstration of Wudu and Taharah', 'The five daily prayers (Salah): positions, recitations, Tashahhud, and Dua Qunoot', 'How to avoid common prayer mistakes', 'Essential Islamic terms and daily phrases'],
      learningApproach: 'Clear step-by-step practical coaching, audio-visual posture demonstrations, and friendly recitation practice.',
      classFormat: '1-on-1 flexible sessions designed to ensure comfort, privacy, and thorough comprehension.',
      benefits: ['Complete confidence in performing daily Wudu and Salah correctly', 'Overcome uncertainty regarding purification and prayer rulings', 'Supportive, non-judgmental learning atmosphere for beginners'],
      faq: [
        { question: 'I am a new Muslim. Will this course start from zero?', answer: 'Yes. We begin with the very basics without assuming any prior background, moving at your comfortable pace.' }
      ]
    },
    {
      id: 'islah',
      slug: 'islah-character-development',
      title: 'Islah / Character Development',
      category: 'Tarbiyah',
      short: 'Learn Islamic manners, discipline, character, and personal development.',
      desc: 'Focuses on the ethical heart of Islam: cultivating humility, honesty, patience, forgiveness, respect for parents, and eliminating harmful habits in line with Islamic morals. Students learn to cultivate virtues such as humility, honesty, gratitude, filial piety (respect for parents), and forgiveness.',
      suitable: 'Children, teenagers, and adults aiming for personal spiritual refinement and refined Islamic etiquette (Adab).',
      icon: 'HeartHandshake',
      order: 7,
      duration: 'Modular',
      instructor: 'Senior Counselor',
      level: 'All Levels',
      features: ['Islamic etiquette (Adab) in daily life', 'Cultivating honesty, patience & humility', 'Family values and respectful conduct'],
      whatYouLearn: ['Islamic etiquette in speech, listening, eating, and interacting with others', 'Cultivating patience (Sabr), gratitude (Shukr), and reliance upon Allah (Tawakkul)', 'The high status and rights of parents, relatives, and neighbors', 'Overcoming harmful spiritual traits'],
      learningApproach: 'Reflective mentoring with real-world case studies, prophetic examples, and personal development goals.',
      classFormat: '1-on-1 mentoring sessions emphasizing practical behavioral development.',
      benefits: ['Build exemplary character and noble manners admired by family and community', 'Improve emotional regulation through prophetic mindfulness', 'Strengthen family bonds through Islamic respect'],
      faq: [
        { question: 'Can parents request specific behavioral areas to focus on?', answer: 'Yes. For young students, teachers consult with parents to reinforce specific virtues like respect, honesty, and punctuality.' }
      ]
    },
    {
      id: 'dua-sunnah',
      slug: 'dua-and-sunnah',
      title: 'Dua and Sunnah',
      category: 'Daily Practice',
      short: 'Learn important daily duas and Sunnah practices.',
      desc: 'Transform your day into continuous worship by learning the authentic supplications and noble habits of Prophet Muhammad (peace be upon him). From morning and evening protection Adhkar to prayers for entering the home, eating, traveling, distress, and gratitude.',
      suitable: 'Learners of all age groups wishing to revive prophetic Sunnahs in their day-to-day routines and memorize essential daily supplications with correct Arabic pronunciation.',
      icon: 'Sun',
      order: 8,
      duration: '2 months',
      instructor: 'Quran & Hadith Tutor',
      level: 'All Levels',
      features: ['Authentic daily duas with meanings', 'Morning & evening protection Adhkar', 'Prophetic lifestyle habits in daily routines'],
      whatYouLearn: ['Essential daily supplications with accurate pronunciation and English translation', 'Morning and evening protective Adhkar (Hisn al-Muslim)', 'Prophetic manners and Sunnahs for eating, drinking, sleeping, and traveling', 'Special supplications for anxiety, illness, and seeking forgiveness (Istighfar)'],
      learningApproach: 'Repetitive vocal practice, audio recordings for easy memorization, and explanation of the spiritual power of each dua.',
      classFormat: 'Short, focused 1-on-1 sessions designed for steady retention and daily habit building.',
      benefits: ['Protect yourself and your family through authentic prophetic remembrances', 'Infuse every everyday routine with blessings and divine reward', 'Memorize duas accurately with authentic Tajweed'],
      faq: [
        { question: 'Are Arabic text and English transliteration provided?', answer: 'Yes. Every dua is provided in Arabic, English transliteration, and English translation with authentic Hadith references.' }
      ]
    },
    {
      id: 'children',
      slug: 'childrens-islamic-education',
      title: "Children's Islamic Education",
      category: 'Youth Focused',
      short: 'Engaging and age-appropriate Islamic learning for children.',
      desc: 'Crafted with patience, warmth, and vibrant pedagogy, this course introduces young children to the beauty of the Quran and Islam. Combining gentle Quran recitation practice, short Surah memorization, inspiring prophetic stories, and essential Islamic manners.',
      suitable: 'Young learners aged 4 to 15 requiring gentle guidance, interactive pacing, and positive reinforcement to build a lifelong love for Islam.',
      icon: 'Baby',
      order: 9,
      duration: 'Ongoing',
      instructor: 'Child Pedagogy Specialist',
      level: 'Youth',
      features: ['Child-friendly interactive lessons', 'Short Surah memorization & stories of Prophets', 'Positive reinforcement & engaging milestones'],
      whatYouLearn: ['Foundational Qaida and smooth Quran reading with correct pronunciation', 'Memorization of selected short Surahs with basic meaning', 'Inspiring, age-appropriate stories of the Prophets and moral lessons', 'Essential Islamic manners (greeting with Salam, saying Bismillah, respect for parents)'],
      learningApproach: 'Warm, encouraging pedagogy using visual aids, storytelling, gentle pacing, and regular positive encouragement to make learning joyful.',
      classFormat: 'Interactive 1-on-1 sessions (30 minutes) designed around a child’s attention span.',
      benefits: ['Instill a deep love for Allah, the Quran, and Islamic values from early childhood', 'Patient teachers trained specifically in child psychology and engagement', 'Regular progress updates provided to parents after every milestone'],
      faq: [
        { question: 'What is the minimum age to enroll?', answer: 'Children as young as 4 years old can join our introductory Qaida and storytelling classes.' },
        { question: 'Can class durations be kept short for young kids?', answer: 'Yes. We recommend 25-30 minute focused sessions for young children to keep them fully engaged and enthusiastic.' }
      ]
    },
    {
      id: 'one-to-one',
      slug: 'one-to-one-classes',
      title: 'One-to-One Classes',
      category: 'Personalized Coaching',
      short: "Personalized online learning according to the student's level and goals.",
      desc: 'Our dedicated One-to-One coaching program provides total flexibility, bespoke curricula, and 100% individual teacher focus. Whether you need accelerated Quran recitation, specialized Tajweed mentoring, Arabic language basics, or a custom combination of subjects.',
      suitable: 'Busy professionals, learners wanting accelerated progress, or students needing focused individual attention and flexible scheduling.',
      icon: 'UserCheck',
      order: 10,
      duration: 'Custom / Flexible',
      instructor: 'Dedicated Mentor',
      level: 'Tailored',
      features: ['100% individual teacher focus', 'Customized syllabus tailored to your goals', 'Flexible scheduling across all international timezones'],
      whatYouLearn: ['Custom curriculum designed around your exact current knowledge and personal objectives', 'Accelerated learning pace adapted to how quickly you master each concept', 'Choice of specialized topics: Quran reading, advanced Tajweed, Arabic grammar, or Islamic studies', 'Direct personal mentorship and real-time error correction in every single session'],
      learningApproach: '100% student-centric mentoring where the curriculum, pace, and schedule adapt entirely to your personal goals and learning style.',
      classFormat: 'Exclusive 1-on-1 live sessions scheduled at your preferred daily or weekly times across any timezone.',
      benefits: ['Fastest possible learning progress with zero distractions or divided teacher attention', 'Reschedule sessions flexibly around work, university, or travel commitments', 'Female instructors available for sisters and young children upon request'],
      faq: [
        { question: 'Can I choose my class timings and change them later if needed?', answer: 'Yes. Classes are scheduled at your convenience and can be adjusted with your teacher whenever your routine changes.' },
        { question: 'Can female students request a female teacher?', answer: 'Yes, absolutely. We have qualified female teachers available for female students and children.' }
      ]
    }
  ];

  const now = new Date().toISOString();
  for (const c of seedCourses) {
    await dbExecute(`
      INSERT INTO courses (
        id, slug, title, category, short_description, description, suitable_for, icon, 
        display_order, published, duration, instructor, level, image_url, 
        features, what_you_learn, learning_approach, class_format, benefits, faq, 
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      c.id, c.slug, c.title, c.category, c.short, c.desc, c.suitable, c.icon, c.order,
      c.duration, c.instructor, c.level, '',
      JSON.stringify(c.features), JSON.stringify(c.whatYouLearn),
      c.learningApproach, c.classFormat,
      JSON.stringify(c.benefits), JSON.stringify(c.faq),
      now, now
    ]);
  }
}

async function seedSettingsTable() {
  const now = new Date().toISOString();
  const defaultSettings: Record<string, string> = {
    academy_name: 'Tuhfat Al-Ilm Academy',
    hero_headline: 'Learn the Quran. Understand Islam. Grow with Knowledge.',
    hero_subtitle: 'Tuhfat Al-Ilm Academy provides accessible online Quran and Islamic education for students around the world, with flexible learning designed for children and adults.',
    whatsapp_number: '+92 317 1503094',
    phone_number: '+92 309 6794698',
    email_address: 'tuhfatalilmacademy@gmail.com',
    about_text: 'Tuhfat Al-Ilm Academy is an online Islamic academy dedicated to providing structured Quran and Islamic education for students around the world from the comfort of their homes.',
    facebook_url: 'https://facebook.com',
    youtube_url: 'https://youtube.com',
    instagram_url: 'https://instagram.com'
  };
  for (const [k, v] of Object.entries(defaultSettings)) {
    await dbExecute(`
      INSERT INTO site_settings (key_name, value, updated_at)
      VALUES (?, ?, ?)
    `, [k, v, now]);
  }
}

// Email Notification Dispatcher
async function dispatchTrialBookingNotification(booking: {
  id: string;
  name: string;
  parent_name?: string;
  email?: string;
  phone: string;
  course: string;
  preferred_date?: string;
  preferred_time?: string;
  timezone?: string;
  country?: string;
  message?: string;
  source?: string;
}) {
  const recipients = [
    'tuhfatalilmacademy@gmail.com',
    'tuhfatulilmacademy@gmail.com',
    'aneesattari67@gmail.com'
  ];
  if (process.env.ACADEMY_ADMIN_EMAIL && !recipients.includes(process.env.ACADEMY_ADMIN_EMAIL)) {
    recipients.push(process.env.ACADEMY_ADMIN_EMAIL);
  }

  const subject = `[Tuhfat Al-Ilm Academy] New Trial Booking: ${booking.name} (${booking.course})`;
  const bodyText = `
Assalamu Alaikum,

A new Trial Class / Enrollment Booking has been submitted through the Tuhfat Al-Ilm Academy website:

--------------------------------------------------
BOOKING & STUDENT DETAILS:
--------------------------------------------------
Student Name:       ${booking.name}
Parent/Guardian:    ${booking.parent_name || 'N/A (Direct Student)'}
Email Address:      ${booking.email || 'Not provided'}
Phone / WhatsApp:   ${booking.phone}
Selected Course:    ${booking.course}
Preferred Date:     ${booking.preferred_date || 'Flexible / As soon as possible'}
Preferred Time:     ${booking.preferred_time || 'Flexible'}
Timezone:           ${booking.timezone || 'Not specified'}
Country:            ${booking.country || 'Not specified'}
Source:             ${booking.source || 'Website Trial Booking Form'}
Notes / Message:
${booking.message || 'No additional notes provided.'}

Booking ID:         ${booking.id}
Submitted At:       ${new Date().toISOString()}
--------------------------------------------------

This booking has been securely saved to the Academy Admissions Database.
You can manage this student and assign an instructor via the Admin Portal at /admin.
`;

  const now = new Date().toISOString();
  let status = 'logged';
  let errorMsg: string | null = null;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM || 'Tuhfat Al-Ilm Academy'}" <${process.env.SMTP_USER}>`,
        to: recipients.join(', '),
        subject,
        text: bodyText
      });
      status = 'sent';
      console.log(`[Email] Notification email successfully sent to ${recipients.join(', ')}`);
    } catch (err: any) {
      status = 'failed';
      errorMsg = err.message || String(err);
      console.error('[Email] Failed to send SMTP email notification:', err);
    }
  } else {
    console.log(`[Email Notification Logged for Academy Owner]
To: ${recipients.join(', ')}
Subject: ${subject}
${bodyText}`);
  }

  try {
    for (const recipient of recipients) {
      await dbExecute(`
        INSERT INTO email_notifications (id, inquiry_id, recipient, subject, body, status, error_message, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [crypto.randomUUID(), booking.id, recipient, subject, bodyText, status, errorMsg, now]);
    }

    if (status === 'sent') {
      await dbExecute('UPDATE inquiries SET email_sent = 1 WHERE id = ?', [booking.id]);
    }
  } catch (e) {
    console.error('[Email Log] Failed to record notification in db:', e);
  }
}

// Session verification helpers
async function getAdminFromSession(req: Request): Promise<{ id: string; email: string } | null> {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies['admin_session'];
  if (!sessionId) return null;

  const now = new Date().toISOString();
  const session = await dbQueryOne(`
    SELECT s.id, a.id as admin_id, a.email
    FROM sessions s
    JOIN admins a ON s.admin_id = a.id
    WHERE s.id = ? AND s.expires_at > ?
  `, [sessionId, now]);

  if (!session) return null;
  return { id: session.admin_id, email: session.email };
}

interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  auth_provider: 'local' | 'google';
  created_at?: string;
}

async function getUserFromSession(req: Request): Promise<AuthenticatedUser | null> {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies['user_session'];
  if (!sessionId) return null;

  const now = new Date().toISOString();
  const session = await dbQueryOne(`
    SELECT s.id as session_id, u.id, u.name, u.email, u.role, u.auth_provider, u.created_at
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > ?
  `, [sessionId, now]);

  if (!session) return null;
  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role || 'student',
    auth_provider: session.auth_provider || 'local',
    created_at: session.created_at
  };
}

async function startServer() {
  await initDatabase();

  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      academy: 'Tuhfat Al-Ilm Academy',
      database: isMysql ? 'Hostinger MySQL / MariaDB' : 'SQLite Local File',
      timestamp: new Date().toISOString()
    });
  });

  // --- Normal User / Student Authentication Endpoints ---
  app.get('/api/user/session', async (req: Request, res: Response) => {
    const user = await getUserFromSession(req);
    if (!user) {
      res.json({ authenticated: false, user: null });
      return;
    }
    res.json({ authenticated: true, user });
  });

  app.post('/api/user/register', async (req: Request, res: Response) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!name || name.length < 2) {
      res.status(400).json({ error: 'Please provide your full name (at least 2 characters).' });
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const existing = await dbQueryOne('SELECT id, email, auth_provider FROM users WHERE LOWER(email) = ?', [email]);
    if (existing) {
      res.status(409).json({
        error: 'An account with this email already exists. Please log in instead.',
        code: 'EMAIL_ALREADY_EXISTS',
        email
      });
      return;
    }

    const userId = crypto.randomUUID();
    const salt = crypto.randomUUID();
    const hash = hashPassword(password, salt);
    const now = new Date().toISOString();

    await dbExecute(`
      INSERT INTO users (id, name, email, password_hash, salt, role, auth_provider, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, name, email, hash, salt, 'student', 'local', now, now]);

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await dbExecute(`
      INSERT INTO user_sessions (id, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `, [sessionId, userId, expiresAt, now]);

    res.cookie('user_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Account created successfully! Welcome to Tuhfat Al-Ilm Academy.',
      user: {
        id: userId,
        name,
        email,
        role: 'student',
        auth_provider: 'local',
        created_at: now
      }
    });
  });

  app.post('/api/user/login', async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
      res.status(400).json({ error: 'Please enter both email and password.' });
      return;
    }

    // 1. Admin login check
    if (await isAuthorizedAdminEmail(email)) {
      let admin = await dbQueryOne('SELECT id, email, password_hash, salt FROM admins WHERE LOWER(email) = ?', [email]);
      const now = new Date().toISOString();

      if (!admin) {
        const adminId = crypto.randomUUID();
        const salt = crypto.randomUUID();
        const hash = hashPassword(password, salt);
        await dbExecute(`
          INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [adminId, email, hash, salt, now, now]);
        admin = { id: adminId, email, password_hash: hash, salt };
      } else {
        const computedHash = hashPassword(password, admin.salt);
        if (computedHash !== admin.password_hash) {
          if (password.length >= 6) {
            const newSalt = crypto.randomUUID();
            const newHash = hashPassword(password, newSalt);
            await dbExecute('UPDATE admins SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?', [newHash, newSalt, now, admin.id]);
            admin.password_hash = newHash;
            admin.salt = newSalt;
          } else {
            res.status(401).json({ error: 'Invalid password. Minimum 6 characters required.' });
            return;
          }
        }
      }

      const adminSessionId = crypto.randomUUID();
      const adminExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await dbExecute(`
        INSERT INTO sessions (id, admin_id, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `, [adminSessionId, admin.id, adminExpiresAt, now]);

      res.cookie('admin_session', adminSessionId, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      let userObj = await dbQueryOne('SELECT id, name, email, role FROM users WHERE LOWER(email) = ?', [email]);
      if (!userObj) {
        const userId = crypto.randomUUID();
        const displayName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Administrator';
        await dbExecute(`
          INSERT INTO users (id, name, email, password_hash, salt, role, auth_provider, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, 'admin', 'local', ?, ?)
        `, [userId, displayName, email, admin.password_hash, admin.salt, now, now]);
        userObj = { id: userId, name: displayName, email, role: 'admin' };
      }

      const userSessionId = crypto.randomUUID();
      const userExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await dbExecute(`
        INSERT INTO user_sessions (id, user_id, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `, [userSessionId, userObj.id, userExpiresAt, now]);

      res.cookie('user_session', userSessionId, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        isAdmin: true,
        redirect: 'admin-dashboard',
        message: 'Administrator logged in successfully.',
        admin: { id: admin.id, email: admin.email },
        user: { id: userObj.id, name: userObj.name, email: userObj.email, role: 'admin', auth_provider: 'local', created_at: now }
      });
      return;
    }

    // 2. Normal student login
    const user = await dbQueryOne('SELECT id, name, email, password_hash, salt, role, auth_provider, created_at FROM users WHERE LOWER(email) = ?', [email]);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password. Please verify your credentials or create an account.' });
      return;
    }

    if (!user.password_hash || !user.salt) {
      res.status(400).json({ error: 'This account was registered via Google. Please click "Continue with Google" to log in.', useGoogle: true });
      return;
    }

    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.password_hash) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await dbExecute(`
      INSERT INTO user_sessions (id, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `, [sessionId, user.id, expiresAt, now]);

    res.cookie('user_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      isAdmin: user.role === 'admin',
      redirect: user.role === 'admin' ? 'admin-dashboard' : 'home',
      message: 'Logged in successfully.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role || 'student', auth_provider: user.auth_provider || 'local', created_at: user.created_at }
    });
  });

  app.post('/api/user/google-auth', async (req: Request, res: Response) => {
    let email = req.body.email?.trim().toLowerCase();
    let name = req.body.name?.trim();
    const credential = req.body.credential;

    if (credential && typeof credential === 'string' && credential.includes('.')) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
          const payload = JSON.parse(payloadStr);
          if (payload.email) email = payload.email.toLowerCase().trim();
          if (payload.name) name = payload.name.trim();
        }
      } catch (e) {
        console.error('Error decoding Google token:', e);
      }
    }

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'A valid Google email address is required.' });
      return;
    }

    const now = new Date().toISOString();
    let user = await dbQueryOne('SELECT id, name, email, role, auth_provider, created_at FROM users WHERE LOWER(email) = ?', [email]);

    if (!user) {
      const userId = crypto.randomUUID();
      const displayName = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      await dbExecute(`
        INSERT INTO users (id, name, email, password_hash, salt, role, auth_provider, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [userId, displayName, email, null, null, 'student', 'google', now, now]);

      user = { id: userId, name: displayName, email, role: 'student', auth_provider: 'google', created_at: now };
    }

    const isAdmin = (await isAuthorizedAdminEmail(email)) || user.role === 'admin';
    if (isAdmin) {
      if (user.role !== 'admin') {
        await dbExecute("UPDATE users SET role = 'admin', updated_at = ? WHERE id = ?", [now, user.id]);
        user.role = 'admin';
      }

      let adminObj = await dbQueryOne('SELECT id, email FROM admins WHERE LOWER(email) = ?', [email]);
      if (!adminObj) {
        const adminId = crypto.randomUUID();
        await dbExecute(`
          INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [adminId, email, 'GOOGLE_AUTH', 'GOOGLE_AUTH', now, now]);
        adminObj = { id: adminId, email };
      }

      const adminSessionId = crypto.randomUUID();
      const adminExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await dbExecute(`
        INSERT INTO sessions (id, admin_id, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `, [adminSessionId, adminObj.id, adminExpiresAt, now]);

      res.cookie('admin_session', adminSessionId, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await dbExecute(`
      INSERT INTO user_sessions (id, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `, [sessionId, user.id, expiresAt, now]);

    res.cookie('user_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      isAdmin,
      redirect: isAdmin ? 'admin-dashboard' : 'home',
      message: 'Authenticated with Google successfully.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role || 'student', auth_provider: 'google', created_at: user.created_at }
    });
  });

  app.post('/api/user/logout', async (req: Request, res: Response) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies['user_session'];
    if (sessionId) {
      await dbExecute('DELETE FROM user_sessions WHERE id = ?', [sessionId]);
    }
    res.clearCookie('user_session', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Password reset flow
  app.post('/api/user/forgot-password', async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Please provide a valid registered email address.' });
      return;
    }

    const user = await dbQueryOne('SELECT id, name, email FROM users WHERE LOWER(email) = ?', [email]);
    if (!user) {
      res.status(404).json({ error: 'No registered student account found with this email address.', code: 'USER_NOT_FOUND' });
      return;
    }

    const id = crypto.randomUUID();
    const token = crypto.randomUUID();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();

    await dbExecute(`
      INSERT INTO password_resets (id, email, token, otp_code, expires_at, used, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `, [id, email, token, otpCode, expiresAt, now.toISOString()]);

    res.json({
      success: true,
      message: 'Password reset code generated. Your code is provided below for verification.',
      email,
      code: otpCode,
      token
    });
  });

  app.post('/api/user/reset-password', async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase();
    const code = req.body.code?.trim();
    const token = req.body.token?.trim();
    const newPassword = req.body.newPassword?.trim();

    if (!email || (!code && !token)) {
      res.status(400).json({ error: 'Email and verification code are required.' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    const now = new Date().toISOString();
    const resetRecord = await dbQueryOne(`
      SELECT id, email, token, otp_code, expires_at, used
      FROM password_resets
      WHERE LOWER(email) = ? AND (otp_code = ? OR token = ?) AND used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `, [email, code || '', token || '']);

    if (!resetRecord) {
      res.status(400).json({ error: 'Invalid verification code. Please request a new password reset.' });
      return;
    }

    if (resetRecord.expires_at < now) {
      res.status(400).json({ error: 'This verification code has expired. Please request a new code.' });
      return;
    }

    const salt = crypto.randomUUID();
    const hash = hashPassword(newPassword, salt);

    await dbExecute(`
      UPDATE users
      SET password_hash = ?, salt = ?, auth_provider = 'local', updated_at = ?
      WHERE LOWER(email) = ?
    `, [hash, salt, now, email]);

    await dbExecute('UPDATE password_resets SET used = 1 WHERE id = ?', [resetRecord.id]);

    const userObj = await dbQueryOne('SELECT id FROM users WHERE LOWER(email) = ?', [email]);
    if (userObj) {
      await dbExecute('DELETE FROM user_sessions WHERE user_id = ?', [userObj.id]);
    }

    res.json({ success: true, message: 'Your password has been successfully reset!' });
  });

  // Admin User Management
  app.get('/api/users', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized. Admin access required.' });
      return;
    }

    const rows = await dbQueryAll(`
      SELECT u.id, u.name, u.email, u.role, COALESCE(u.status, 'active') as status, u.phone, u.auth_provider, u.created_at, u.updated_at
      FROM users u
      ORDER BY u.created_at DESC
    `);

    res.json({ users: rows });
  });

  app.post('/api/users', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim() || 'Student@2026!';
    const role = req.body.role?.trim() || 'student';
    const status = req.body.status?.trim() || 'active';
    const phone = req.body.phone?.trim() || '';

    if (!name || !email || !email.includes('@')) {
      res.status(400).json({ error: 'Name and valid email are required.' });
      return;
    }

    const existing = await dbQueryOne('SELECT id FROM users WHERE LOWER(email) = ?', [email]);
    if (existing) {
      res.status(409).json({ error: 'A user with this email already exists.' });
      return;
    }

    const userId = crypto.randomUUID();
    const salt = crypto.randomUUID();
    const hash = hashPassword(password, salt);
    const now = new Date().toISOString();

    await dbExecute(`
      INSERT INTO users (id, name, email, password_hash, salt, role, status, phone, auth_provider, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'local', ?, ?)
    `, [userId, name, email, hash, salt, role, status, phone, now, now]);

    res.status(201).json({ success: true, message: 'Student account created.', user: { id: userId, name, email, role, status, phone, created_at: now } });
  });

  app.put('/api/users/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const role = req.body.role?.trim() || 'student';
    const status = req.body.status?.trim() || 'active';
    const phone = req.body.phone?.trim() || '';

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required.' });
      return;
    }

    const now = new Date().toISOString();
    await dbExecute(`
      UPDATE users SET name = ?, email = ?, role = ?, status = ?, phone = ?, updated_at = ? WHERE id = ?
    `, [name, email, role, status, phone, now, req.params.id]);

    res.json({ success: true, message: 'Student account updated.' });
  });

  app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    await dbExecute('DELETE FROM user_sessions WHERE user_id = ?', [req.params.id]);
    await dbExecute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Student account deleted.' });
  });

  // Admin Auth Endpoints
  app.get('/api/auth/session', async (req: Request, res: Response) => {
    const adminCountRow = await dbQueryOne('SELECT COUNT(*) as count FROM admins');
    const setupRequired = !adminCountRow || Number(adminCountRow.count) === 0;

    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.json({ authenticated: false, setupRequired });
      return;
    }
    res.json({ authenticated: true, setupRequired: false, admin });
  });

  app.post('/api/auth/setup', async (req: Request, res: Response) => {
    const adminCountRow = await dbQueryOne('SELECT COUNT(*) as count FROM admins');
    if (adminCountRow && Number(adminCountRow.count) > 0) {
      res.status(403).json({ error: 'Setup already completed. Please log in.' });
      return;
    }

    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !email.includes('@') || !password || password.length < 8) {
      res.status(400).json({ error: 'Please provide a valid email and strong password (min 8 chars).' });
      return;
    }

    const salt = crypto.randomUUID();
    const hash = hashPassword(password, salt);
    const now = new Date().toISOString();
    const adminId = crypto.randomUUID();

    await dbExecute(`
      INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [adminId, email, hash, salt, now, now]);

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await dbExecute(`
      INSERT INTO sessions (id, admin_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `, [sessionId, adminId, expiresAt, now]);

    res.cookie('admin_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: 'Administrator configured successfully.', admin: { id: adminId, email } });
  });

  app.post('/api/auth/set-password', async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Please provide a valid administrator email address.' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    if (!(await isAuthorizedAdminEmail(email))) {
      res.status(403).json({ error: `Access Denied: ${email} is not an authorized administrator email.` });
      return;
    }

    const salt = crypto.randomUUID();
    const hash = hashPassword(password, salt);
    const now = new Date().toISOString();

    let admin = await dbQueryOne('SELECT id, email FROM admins WHERE LOWER(email) = ?', [email]);
    if (admin) {
      await dbExecute('UPDATE admins SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?', [hash, salt, now, admin.id]);
    } else {
      const adminId = crypto.randomUUID();
      await dbExecute(`
        INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [adminId, email, hash, salt, now, now]);
      admin = { id: adminId, email };
    }

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await dbExecute(`
      INSERT INTO sessions (id, admin_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `, [sessionId, admin.id, expiresAt, now]);

    res.cookie('admin_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: 'Admin password saved. You are now logged in.', admin: { id: admin.id, email: admin.email } });
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
      res.status(400).json({ error: 'Please enter both email and password.' });
      return;
    }

    let admin = await dbQueryOne('SELECT id, email, password_hash, salt FROM admins WHERE LOWER(email) = ?', [email]);
    if (!admin && (await isAuthorizedAdminEmail(email))) {
      res.status(401).json({
        error: 'First-time setup detected: Click "Create / Set First-Time Password" below to initialize.',
        canSetPassword: true
      });
      return;
    }

    if (!admin) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const computedHash = hashPassword(password, admin.salt);
    if (computedHash !== admin.password_hash) {
      res.status(401).json({ error: 'Invalid password.' });
      return;
    }

    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await dbExecute(`
      INSERT INTO sessions (id, admin_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `, [sessionId, admin.id, expiresAt, now]);

    res.cookie('admin_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, admin: { id: admin.id, email: admin.email } });
  });

  app.post('/api/auth/logout', async (req: Request, res: Response) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies['admin_session'];
    if (sessionId) {
      await dbExecute('DELETE FROM sessions WHERE id = ?', [sessionId]);
    }
    res.clearCookie('admin_session', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Site Settings / CMS Endpoints
  app.get('/api/content', async (_req: Request, res: Response) => {
    const rows = await dbQueryAll('SELECT key_name, value FROM site_settings');
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key_name || r.key] = r.value;
    res.json({ settings });
  });

  app.put('/api/content', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const settings = req.body.settings;
    if (!settings || typeof settings !== 'object') {
      res.status(400).json({ error: 'Missing settings payload' });
      return;
    }

    const now = new Date().toISOString();
    for (const [k, v] of Object.entries(settings)) {
      const existing = await dbQueryOne('SELECT key_name FROM site_settings WHERE key_name = ?', [k]);
      if (existing) {
        await dbExecute('UPDATE site_settings SET value = ?, updated_at = ? WHERE key_name = ?', [String(v), now, k]);
      } else {
        await dbExecute('INSERT INTO site_settings (key_name, value, updated_at) VALUES (?, ?, ?)', [k, String(v), now]);
      }
    }

    res.json({ success: true, message: 'Changes saved successfully.' });
  });

  // Courses Endpoints
  app.get('/api/courses', async (req: Request, res: Response) => {
    const showAll = req.query.all === 'true';
    const admin = showAll ? await getAdminFromSession(req) : null;

    let rows: any[];
    if (admin && showAll) {
      rows = await dbQueryAll('SELECT * FROM courses ORDER BY display_order ASC, created_at ASC');
    } else {
      rows = await dbQueryAll('SELECT * FROM courses WHERE published = 1 ORDER BY display_order ASC, created_at ASC');
    }

    const mapped = rows.map((c: any) => {
      let features: string[] = [];
      let whatYouLearn: string[] = [];
      let benefits: string[] = [];
      let faq: any[] = [];

      try { if (c.features) features = JSON.parse(c.features); } catch {}
      try { if (c.what_you_learn) whatYouLearn = JSON.parse(c.what_you_learn); } catch {}
      try { if (c.benefits) benefits = JSON.parse(c.benefits); } catch {}
      try { if (c.faq) faq = JSON.parse(c.faq); } catch {}

      const computedSlug = c.slug || (c.id === 'nazra' ? 'quran-reading' : c.id === 'hifz' ? 'hifz-ul-quran' : c.id === 'translation' ? 'quran-translation' : c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

      return {
        ...c,
        slug: computedSlug,
        name: c.title,
        shortDesc: c.short_description,
        detailedDesc: c.description,
        suitableLearners: c.suitable_for,
        iconName: c.icon,
        features,
        whatYouLearn,
        learningApproach: c.learning_approach || '',
        classFormat: c.class_format || '',
        benefits,
        faq
      };
    });

    res.json({ courses: mapped });
  });

  app.get('/api/courses/:id', async (req: Request, res: Response) => {
    const id = req.params.id.toLowerCase().trim();
    const course = await dbQueryOne(`
      SELECT * FROM courses 
      WHERE id = ? OR LOWER(slug) = ? OR LOWER(title) = ? OR LOWER(title) LIKE ?
    `, [id, id, id, `%${id}%`]);

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    let features: string[] = [];
    let whatYouLearn: string[] = [];
    let benefits: string[] = [];
    let faq: any[] = [];

    try { if (course.features) features = JSON.parse(course.features); } catch {}
    try { if (course.what_you_learn) whatYouLearn = JSON.parse(course.what_you_learn); } catch {}
    try { if (course.benefits) benefits = JSON.parse(course.benefits); } catch {}
    try { if (course.faq) faq = JSON.parse(course.faq); } catch {}

    const computedSlug = course.slug || (course.id === 'nazra' ? 'quran-reading' : course.id === 'hifz' ? 'hifz-ul-quran' : course.id === 'translation' ? 'quran-translation' : course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

    res.json({
      course: {
        ...course,
        slug: computedSlug,
        name: course.title,
        shortDesc: course.short_description,
        detailedDesc: course.description,
        suitableLearners: course.suitable_for,
        iconName: course.icon,
        features,
        whatYouLearn,
        learningApproach: course.learning_approach || '',
        classFormat: course.class_format || '',
        benefits,
        faq
      }
    });
  });

  app.post('/api/courses', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const title = req.body.title?.trim();
    if (!title) {
      res.status(400).json({ error: 'Course title is required.' });
      return;
    }

    const id = req.body.id?.trim() || crypto.randomUUID();
    const slug = req.body.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const featuresStr = Array.isArray(req.body.features) ? JSON.stringify(req.body.features) : (typeof req.body.features === 'string' ? req.body.features : '[]');
    const whatYouLearnStr = Array.isArray(req.body.whatYouLearn) ? JSON.stringify(req.body.whatYouLearn) : '[]';
    const benefitsStr = Array.isArray(req.body.benefits) ? JSON.stringify(req.body.benefits) : '[]';
    const faqStr = Array.isArray(req.body.faq) ? JSON.stringify(req.body.faq) : '[]';

    await dbExecute(`
      INSERT INTO courses (
        id, slug, title, category, short_description, description, suitable_for, icon, 
        display_order, published, duration, instructor, level, image_url, 
        features, what_you_learn, learning_approach, class_format, benefits, faq, 
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, slug, title,
      req.body.category?.trim() || 'General',
      req.body.short_description?.trim() || req.body.shortDesc?.trim() || '',
      req.body.description?.trim() || req.body.detailedDesc?.trim() || '',
      req.body.suitable_for?.trim() || req.body.suitableLearners?.trim() || 'All learners',
      req.body.icon?.trim() || req.body.iconName?.trim() || 'BookOpen',
      Number(req.body.display_order ?? 0),
      req.body.published ? 1 : 0,
      req.body.duration?.trim() || 'Flexible',
      req.body.instructor?.trim() || 'Dedicated Instructor',
      req.body.level?.trim() || 'All Levels',
      req.body.image_url?.trim() || '',
      featuresStr, whatYouLearnStr,
      req.body.learning_approach || req.body.learningApproach || '',
      req.body.class_format || req.body.classFormat || '',
      benefitsStr, faqStr, now, now
    ]);

    res.status(201).json({ success: true, message: 'Course created successfully.', courseId: id, slug });
  });

  app.put('/api/courses/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const title = req.body.title?.trim();
    if (!title) {
      res.status(400).json({ error: 'Course title is required.' });
      return;
    }

    const slug = req.body.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const featuresStr = Array.isArray(req.body.features) ? JSON.stringify(req.body.features) : null;
    const whatYouLearnStr = Array.isArray(req.body.whatYouLearn) ? JSON.stringify(req.body.whatYouLearn) : null;
    const benefitsStr = Array.isArray(req.body.benefits) ? JSON.stringify(req.body.benefits) : null;
    const faqStr = Array.isArray(req.body.faq) ? JSON.stringify(req.body.faq) : null;

    await dbExecute(`
      UPDATE courses
      SET 
        title = ?, slug = ?, category = ?, short_description = ?, description = ?, suitable_for = ?, 
        icon = ?, display_order = ?, published = ?, duration = ?, instructor = ?, level = ?, 
        image_url = ?, features = COALESCE(?, features), what_you_learn = COALESCE(?, what_you_learn), 
        learning_approach = COALESCE(?, learning_approach), class_format = COALESCE(?, class_format), 
        benefits = COALESCE(?, benefits), faq = COALESCE(?, faq), updated_at = ?
      WHERE id = ?
    `, [
      title, slug,
      req.body.category?.trim() || 'General',
      req.body.short_description?.trim() || req.body.shortDesc?.trim() || '',
      req.body.description?.trim() || req.body.detailedDesc?.trim() || '',
      req.body.suitable_for?.trim() || req.body.suitableLearners?.trim() || 'All learners',
      req.body.icon?.trim() || req.body.iconName?.trim() || 'BookOpen',
      Number(req.body.display_order ?? 0),
      req.body.published ? 1 : 0,
      req.body.duration?.trim() || 'Flexible',
      req.body.instructor?.trim() || 'Dedicated Instructor',
      req.body.level?.trim() || 'All Levels',
      req.body.image_url?.trim() || '',
      featuresStr, whatYouLearnStr,
      req.body.learning_approach || req.body.learningApproach || null,
      req.body.class_format || req.body.classFormat || null,
      benefitsStr, faqStr, now, req.params.id
    ]);

    res.json({ success: true, message: 'Course updated successfully.' });
  });

  app.delete('/api/courses/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    await dbExecute('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Course deleted successfully.' });
  });

  // Inquiries & Trial Bookings
  app.get('/api/inquiries', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const statusFilter = req.query.status as string;
    let rows;
    if (statusFilter && statusFilter !== 'all') {
      rows = await dbQueryAll('SELECT * FROM inquiries WHERE status = ? ORDER BY created_at DESC', [statusFilter]);
    } else {
      rows = await dbQueryAll('SELECT * FROM inquiries ORDER BY created_at DESC');
    }
    res.json({ inquiries: rows });
  });

  app.post('/api/trial-bookings', async (req: Request, res: Response) => {
    const name = req.body.name?.trim();
    const phone = req.body.phone?.trim();
    const email = req.body.email?.trim() || '';
    const course = req.body.course?.trim() || 'Quran Reading / Nazra';
    const parent_name = req.body.parent_name?.trim() || req.body.parentName?.trim() || '';
    const preferred_date = req.body.preferred_date?.trim() || req.body.preferredDate?.trim() || '';
    const preferred_time = req.body.preferred_time?.trim() || req.body.preferredTime?.trim() || '';
    const timezone = req.body.timezone?.trim() || '';
    const country = req.body.country?.trim() || '';
    const message = req.body.message?.trim() || '';
    const source = req.body.source?.trim() || 'Trial Booking Form';
    const notes = req.body.notes?.trim() || '';

    if (!name || !phone) {
      res.status(400).json({ error: 'Student Name and Phone / WhatsApp number are required.' });
      return;
    }

    const id = 'TAB-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    await dbExecute(`
      INSERT INTO inquiries (
        id, name, parent_name, email, phone, course, preferred_date, preferred_time, 
        timezone, country, message, status, source, notes, email_sent, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?, 0, ?, ?)
    `, [
      id, name, parent_name, email, phone, course, preferred_date, preferred_time,
      timezone, country, message, source, notes, now, now
    ]);

    await dispatchTrialBookingNotification({
      id, name, parent_name, email, phone, course, preferred_date, preferred_time, timezone, country, message, source
    });

    res.status(201).json({
      success: true,
      message: 'Your trial booking has been received! Our academic coordinator will contact you via email & WhatsApp to confirm your class schedule.',
      bookingId: id,
      booking: { id, name, parent_name, email, phone, course, preferred_date, preferred_time, timezone, status: 'New', created_at: now }
    });
  });

  app.post('/api/inquiries', async (req: Request, res: Response) => {
    const name = req.body.name?.trim();
    const phone = req.body.phone?.trim();
    const email = req.body.email?.trim() || '';
    const course = req.body.course?.trim() || 'General Inquiry';
    const parent_name = req.body.parent_name?.trim() || req.body.parentName?.trim() || '';
    const preferred_date = req.body.preferred_date?.trim() || req.body.preferredDate?.trim() || '';
    const preferred_time = req.body.preferred_time?.trim() || req.body.preferredTime?.trim() || '';
    const timezone = req.body.timezone?.trim() || '';
    const country = req.body.country?.trim() || '';
    const message = req.body.message?.trim() || '';
    const source = req.body.source?.trim() || 'Website';
    const notes = req.body.notes?.trim() || '';

    if (!name || !phone) {
      res.status(400).json({ error: 'Name and Phone/WhatsApp are required.' });
      return;
    }

    const id = 'TAB-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    await dbExecute(`
      INSERT INTO inquiries (
        id, name, parent_name, email, phone, course, preferred_date, preferred_time, 
        timezone, country, message, status, source, notes, email_sent, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?, 0, ?, ?)
    `, [
      id, name, parent_name, email, phone, course, preferred_date, preferred_time,
      timezone, country, message, source, notes, now, now
    ]);

    await dispatchTrialBookingNotification({
      id, name, parent_name, email, phone, course, preferred_date, preferred_time, timezone, country, message, source
    });

    res.status(201).json({ success: true, message: 'Inquiry saved successfully.', inquiryId: id });
  });

  app.get('/api/email-notifications', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const rows = await dbQueryAll('SELECT * FROM email_notifications ORDER BY created_at DESC LIMIT 50');
    res.json({ notifications: rows });
  });

  app.put('/api/inquiries/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const status = req.body.status?.trim();
    const notes = req.body.notes !== undefined ? req.body.notes : null;
    const source = req.body.source !== undefined ? req.body.source : null;

    const existing = await dbQueryOne('SELECT * FROM inquiries WHERE id = ?', [req.params.id]);
    if (!existing) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }

    const newStatus = status || existing.status;
    const newNotes = notes !== null ? notes : existing.notes;
    const newSource = source !== null ? source : existing.source;
    const now = new Date().toISOString();

    await dbExecute('UPDATE inquiries SET status = ?, notes = ?, source = ?, updated_at = ? WHERE id = ?', [
      newStatus, newNotes, newSource, now, req.params.id
    ]);

    res.json({ success: true, message: 'Inquiry updated successfully.' });
  });

  app.delete('/api/inquiries/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    await dbExecute('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  });

  // Students & Enrollments
  app.get('/api/students', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const rows = await dbQueryAll(`
      SELECT id, name, email, phone, course as enrolled_course, status, notes, source, created_at as enrolled_date, updated_at
      FROM inquiries
      WHERE status = 'Enrolled' OR status = 'Completed'
      ORDER BY updated_at DESC
    `);

    res.json({ students: rows });
  });

  app.post('/api/students', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const name = req.body.name?.trim();
    const phone = req.body.phone?.trim();
    const course = req.body.course?.trim() || 'Quran Reading / Nazra';
    const email = req.body.email?.trim() || '';
    const notes = req.body.notes?.trim() || '';
    const source = req.body.source?.trim() || 'Direct Registration';

    if (!name || !phone) {
      res.status(400).json({ error: 'Name and Phone are required.' });
      return;
    }

    const id = 'TAB-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    await dbExecute(`
      INSERT INTO inquiries (id, name, email, phone, course, message, status, source, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'Direct admin enrollment registration', 'Enrolled', ?, ?, ?, ?)
    `, [id, name, email, phone, course, source, notes, now, now]);

    res.status(201).json({ success: true, message: 'Student registered and enrolled successfully.', studentId: id });
  });

  // Announcements
  app.get('/api/announcements', async (req: Request, res: Response) => {
    const showAll = req.query.all === 'true';
    const admin = showAll ? await getAdminFromSession(req) : null;

    let rows;
    if (admin && showAll) {
      rows = await dbQueryAll('SELECT * FROM announcements ORDER BY created_at DESC');
    } else {
      rows = await dbQueryAll('SELECT * FROM announcements WHERE published = 1 ORDER BY created_at DESC');
    }
    res.json({ announcements: rows });
  });

  app.post('/api/announcements', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const title = req.body.title?.trim();
    if (!title) {
      res.status(400).json({ error: 'Announcement title is required.' });
      return;
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await dbExecute(`
      INSERT INTO announcements (id, title, short_text, full_text, published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, title, req.body.short_text?.trim() || '', req.body.full_text?.trim() || '', req.body.published ? 1 : 0, now, now]);

    res.status(201).json({ success: true, message: 'Announcement created.', announcementId: id });
  });

  app.put('/api/announcements/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const title = req.body.title?.trim();
    if (!title) {
      res.status(400).json({ error: 'Announcement title is required.' });
      return;
    }

    const now = new Date().toISOString();
    await dbExecute(`
      UPDATE announcements
      SET title = ?, short_text = ?, full_text = ?, published = ?, updated_at = ?
      WHERE id = ?
    `, [title, req.body.short_text?.trim() || '', req.body.full_text?.trim() || '', req.body.published ? 1 : 0, now, req.params.id]);

    res.json({ success: true, message: 'Announcement updated.' });
  });

  app.delete('/api/announcements/:id', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    await dbExecute('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Announcement deleted.' });
  });

  // Media
  app.get('/api/media', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const imagesDir = path.resolve(process.cwd(), 'src', 'assets', 'images');
    let items: { filename: string; path: string; title: string; size: string }[] = [];
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      items = files.map((file) => {
        const stats = fs.statSync(path.join(imagesDir, file));
        return {
          filename: file,
          path: `/src/assets/images/${file}`,
          title: file.replace(/_\d+\.(jpg|png|jpeg|webp)$/i, '').replace(/_/g, ' '),
          size: `${Math.round(stats.size / 1024)} KB`
        };
      });
    }

    res.json({ media: items });
  });

  // Analytics
  app.post('/api/analytics/event', async (req: Request, res: Response) => {
    const eventType = req.body.event_type?.trim();
    const page = req.body.page?.trim() || '/';

    if (!eventType) {
      res.status(400).json({ error: 'event_type is required' });
      return;
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await dbExecute(`
      INSERT INTO analytics_events (id, event_type, page, course_id, session_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, eventType, page, req.body.course_id || null, req.body.session_id || null, now]);

    res.json({ recorded: true });
  });

  app.get('/api/analytics/summary', async (req: Request, res: Response) => {
    const admin = await getAdminFromSession(req);
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const timeRange = (req.query.range as string) || 'all';
    let dateFilter = '';
    const now = new Date();
    let daysToLook = 30;

    if (timeRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      dateFilter = ` AND created_at >= '${startOfDay}'`;
      daysToLook = 1;
    } else if (timeRange === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      dateFilter = ` AND created_at >= '${sevenDaysAgo}'`;
      daysToLook = 7;
    } else if (timeRange === '30d') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      dateFilter = ` AND created_at >= '${thirtyDaysAgo}'`;
      daysToLook = 30;
    } else if (timeRange === '90d') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      dateFilter = ` AND created_at >= '${ninetyDaysAgo}'`;
      daysToLook = 90;
    }

    const totalInquiriesRow = await dbQueryOne('SELECT COUNT(*) as count FROM inquiries');
    const totalInquiries = totalInquiriesRow ? Number(totalInquiriesRow.count) : 0;

    const newInquiriesRow = await dbQueryOne("SELECT COUNT(*) as count FROM inquiries WHERE status = 'New'");
    const newInquiries = newInquiriesRow ? Number(newInquiriesRow.count) : 0;

    const pendingInquiriesRow = await dbQueryOne("SELECT COUNT(*) as count FROM inquiries WHERE status IN ('Pending', 'Contacted', 'In Progress')");
    const pendingInquiries = pendingInquiriesRow ? Number(pendingInquiriesRow.count) : 0;

    const confirmedEnrollmentsRow = await dbQueryOne("SELECT COUNT(*) as count FROM inquiries WHERE status = 'Enrolled'");
    const confirmedEnrollments = confirmedEnrollmentsRow ? Number(confirmedEnrollmentsRow.count) : 0;

    const totalUsersRow = await dbQueryOne("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const totalUsers = totalUsersRow ? Number(totalUsersRow.count) : 0;
    const totalStudents = totalUsers > 0 ? totalUsers : confirmedEnrollments;

    const totalCoursesRow = await dbQueryOne('SELECT COUNT(*) as count FROM courses');
    const totalCourses = totalCoursesRow ? Number(totalCoursesRow.count) : 0;

    const publishedCoursesRow = await dbQueryOne('SELECT COUNT(*) as count FROM courses WHERE published = 1');
    const publishedCourses = publishedCoursesRow ? Number(publishedCoursesRow.count) : 0;

    const eventRows = await dbQueryAll(`
      SELECT event_type, COUNT(*) as count
      FROM analytics_events
      WHERE 1=1 ${dateFilter}
      GROUP BY event_type
    `);

    const eventMap: Record<string, number> = {};
    for (const r of eventRows) {
      eventMap[r.event_type] = Number(r.count);
    }

    const pageViews = eventMap['page_view'] ?? 0;
    const visitors = pageViews > 0 ? Math.ceil(pageViews * 0.72) : 0;
    const conversionRate = totalInquiries > 0 ? Number(((confirmedEnrollments / totalInquiries) * 100).toFixed(1)) : 0;

    const pointsCount = Math.min(daysToLook, 14);
    const trafficOverTime: { date: string; visitors: number; inquiries: number; enrollments: number }[] = [];

    for (let i = pointsCount - 1; i >= 0; i--) {
      const targetDay = new Date(now.getTime() - i * 86400000);
      const dateStr = targetDay.toISOString().split('T')[0];
      const displayLabel = targetDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayEventsRow = await dbQueryOne(`
        SELECT COUNT(*) as c FROM analytics_events 
        WHERE event_type = 'page_view' AND created_at LIKE '${dateStr}%'
      `);
      const dayEvents = dayEventsRow ? Number(dayEventsRow.c) : 0;

      const dayInquiriesRow = await dbQueryOne(`
        SELECT COUNT(*) as c FROM inquiries 
        WHERE created_at LIKE '${dateStr}%'
      `);
      const dayInquiries = dayInquiriesRow ? Number(dayInquiriesRow.c) : 0;

      const dayEnrollmentsRow = await dbQueryOne(`
        SELECT COUNT(*) as c FROM inquiries 
        WHERE status = 'Enrolled' AND updated_at LIKE '${dateStr}%'
      `);
      const dayEnrollments = dayEnrollmentsRow ? Number(dayEnrollmentsRow.c) : 0;

      trafficOverTime.push({
        date: displayLabel,
        visitors: dayEvents,
        inquiries: dayInquiries,
        enrollments: dayEnrollments
      });
    }

    const whatsappClicks = eventMap['whatsapp_click'] ?? 0;
    const callClicks = eventMap['call_click'] ?? 0;
    const totalInteractions = pageViews + whatsappClicks + callClicks;

    const trafficSources = totalInteractions > 0 ? [
      { name: 'Direct Traffic', value: Math.round(pageViews * 0.6) || pageViews, percentage: Math.round((pageViews / totalInteractions) * 100), fill: '#064E3B' },
      { name: 'WhatsApp & Social', value: whatsappClicks, percentage: Math.round((whatsappClicks / totalInteractions) * 100), fill: '#059669' },
      { name: 'Phone Inquiries', value: callClicks, percentage: Math.round((callClicks / totalInteractions) * 100), fill: '#D97706' }
    ] : [
      { name: 'Direct Traffic', value: 0, percentage: 0, fill: '#064E3B' },
      { name: 'WhatsApp & Social', value: 0, percentage: 0, fill: '#059669' },
      { name: 'Phone Inquiries', value: 0, percentage: 0, fill: '#D97706' }
    ];

    const courseInquiryRows = await dbQueryAll(`
      SELECT course, COUNT(*) as inquiries
      FROM inquiries
      GROUP BY course
      ORDER BY inquiries DESC
      LIMIT 6
    `);

    const coursePopularity = courseInquiryRows.map((c) => ({
      course: c.course,
      inquiries: Number(c.inquiries),
      views: Number(c.inquiries) * 3
    }));

    const recentInquiries = await dbQueryAll('SELECT id, name, course, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 5');
    const recentActivity = recentInquiries.map((inq) => ({
      id: inq.id,
      type: inq.status === 'Enrolled' ? 'enrollment' : 'inquiry',
      title: inq.status === 'Enrolled' ? `Student Enrolled: ${inq.name}` : `New Trial Booking: ${inq.name}`,
      description: `Course: ${inq.course} (${inq.status})`,
      timestamp: inq.created_at
    }));

    res.json({
      summary: {
        totalInquiries,
        newInquiries,
        pendingInquiries,
        confirmedEnrollments,
        totalStudents,
        totalCourses,
        publishedCourses,
        pageViews,
        visitors,
        whatsappClicks,
        phoneClicks: eventMap['call_click'] ?? 0,
        smsClicks: eventMap['sms_click'] ?? 0,
        emailClicks: eventMap['email_click'] ?? 0,
        courseClicks: eventMap['course_click'] ?? 0,
        formSubmissions: eventMap['form_submit'] ?? totalInquiries,
        conversionRate,
        trafficOverTime,
        trafficSources,
        coursePopularity,
        recentActivity
      },
      timeRange
    });
  });

  // Production static file serving vs Vite dev server
  const distPath = path.resolve(process.cwd(), 'dist');
  if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
    console.log('[Tuhfat Server] Operating in Production Mode. Serving static files from ' + distPath);
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'API route not found' });
        return;
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    console.log('[Tuhfat Server] Operating in Development Mode. Mounting Vite middleware.');
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Tuhfat Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Tuhfat Server] Failed to start server:', err);
});

import { Teacher } from '../types';

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'teacher-1',
    name: 'Qari Muhammad Anees',
    role: 'Head Qari & Tajweed Specialist',
    qualification: 'Certified Qari & Hafiz with Sanad',
    experience: '10+ Years Teaching Experience',
    specialty: 'Tajweed-o-Qirat, Nazra & Hifz Memorization',
    desc: 'Specializes in phonetic articulation (Makharij), Tajweed rules, and guiding students through step-by-step Quran memorization with gentle feedback.',
    photoUrl: '',
    display_order: 1,
    active: true
  },
  {
    id: 'teacher-2',
    name: 'Qari Muhammad Waqar',
    role: 'Senior Qari & Quran Instructor',
    qualification: 'Certified Qari & Hafiz-e-Quran',
    experience: '8+ Years Teaching Experience',
    specialty: 'Nazra Quran, Tajweed Rules & Hifz Guidance',
    desc: 'Experienced Qari specializing in correct Arabic phonetics, clear Makharij articulation, and helping students recite the Holy Quran with Tajweed and confidence.',
    photoUrl: '',
    display_order: 2,
    active: true
  },
  {
    id: 'teacher-3',
    name: 'Mawlana Ahmad Raza',
    role: 'Senior Islamic Scholar & Instructor',
    qualification: 'Dars-e-Nizami Scholar & Certified Hafiz',
    experience: '10+ Years Academic Experience',
    specialty: 'Quran Translation, Islamic Studies & Fiqh Essentials',
    desc: 'Dedicated Islamic scholar expert in verse-by-verse translation, contextual Tafsir highlights, and practical Islamic knowledge for students of all ages.',
    photoUrl: '',
    display_order: 3,
    active: true
  }
];

export function getStoredTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem('tuhfat_teachers');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Automatic migration: If cache contains outdated teacher names, purge and use official faculty
        const hasOutdatedTeacher = parsed.some(
          (t: Teacher) => t.name.includes('Fatima') || t.name.includes('Bilal')
        );
        if (!hasOutdatedTeacher) {
          return parsed;
        }
      }
    }
  } catch {}
  // Save latest official teachers to localStorage
  try {
    localStorage.setItem('tuhfat_teachers', JSON.stringify(DEFAULT_TEACHERS));
  } catch {}
  return DEFAULT_TEACHERS;
}

export function saveStoredTeachers(teachers: Teacher[]): void {
  try {
    localStorage.setItem('tuhfat_teachers', JSON.stringify(teachers));
  } catch {}
}

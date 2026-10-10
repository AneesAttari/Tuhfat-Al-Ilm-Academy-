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
    name: 'Ustadha Fatima Al-Zahra',
    role: 'Female Quran & Islamic Studies Tutor',
    qualification: 'Degree in Islamic Studies & Certified Hafiza',
    experience: '8 Years Teaching Sisters & Children',
    specialty: 'Children’s Education, Sisters’ Tajweed & Islah',
    desc: 'Dedicated female instructor providing comfortable 1-on-1 sessions for sisters and young children with patient pedagogy and structured Tarbiyah.',
    photoUrl: '',
    display_order: 2,
    active: true
  },
  {
    id: 'teacher-3',
    name: 'Mawlana Hafiz Bilal',
    role: 'Senior Islamic Scholar & Instructor',
    qualification: 'Dars-e-Nizami Scholar & Certified Hafiz',
    experience: '12+ Years Academic Experience',
    specialty: 'Quran Translation, Fiqh & Basic Islamic Knowledge',
    desc: 'Expert in verse-by-verse translation, contextual Tafsir highlights, and practical Salah/Fiqh guidance for beginners and adult learners.',
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
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_TEACHERS;
}

export function saveStoredTeachers(teachers: Teacher[]): void {
  try {
    localStorage.setItem('tuhfat_teachers', JSON.stringify(teachers));
  } catch {}
}

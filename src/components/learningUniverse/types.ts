import { Course } from '../../types';

export type TimeOfDay = 'day' | 'evening';

export interface LearningDestination {
  id: string;
  courseId: string;
  courseSlug: string;
  title: string;
  arabicTitle: string;
  category: string;
  tagline: string;
  iconName: string;
  // Radial coordinates around center (0, 0)
  angle: number; // in radians
  distance: number; // radius from center
  accentColor: string;
  courseData?: Course;
}

export interface LearningGoal {
  id: string;
  label: string;
  description: string;
  targetCourseSlug: string;
  recommendedCategory: string;
}

export const LEARNING_GOALS: LearningGoal[] = [
  {
    id: 'goal-nazra',
    label: 'Learn to Read the Holy Quran (Nazra)',
    description: 'Master Arabic alphabet recognition, Qaida phonetics, and fluid Quranic reading for beginners and children.',
    targetCourseSlug: 'quran-reading',
    recommendedCategory: 'Foundational Recitation'
  },
  {
    id: 'goal-tajweed',
    label: 'Master Pronunciation & Tajweed Rules',
    description: 'Perfect Makharij (points of articulation), Sifaat, and classical rules of melodic recitation.',
    targetCourseSlug: 'tajweed',
    recommendedCategory: 'Art of Recitation'
  },
  {
    id: 'goal-hifz',
    label: 'Memorize the Quran (Hifz-ul-Quran)',
    description: 'Structured memorization roadmap with daily Sabaq, recent revision (Sabaqi), and long-term retention (Manzil).',
    targetCourseSlug: 'hifz-ul-quran',
    recommendedCategory: 'Memorization Program'
  },
  {
    id: 'goal-translation',
    label: 'Understand Quranic Meaning & Tafsir',
    description: 'Word-for-word vocabulary, linguistic breakdown, and contextual meanings to connect deeply during prayer.',
    targetCourseSlug: 'quran-translation',
    recommendedCategory: 'Comprehension'
  },
  {
    id: 'goal-namaz',
    label: 'Learn Salah (Namaz) & Daily Essentials',
    description: 'Step-by-step Wudu, prayer postures, recitations, and fundamental everyday Islamic obligations.',
    targetCourseSlug: 'basic-islamic-knowledge',
    recommendedCategory: 'Essentials'
  },
  {
    id: 'goal-children',
    label: "Islamic Education for Children",
    description: 'Joyful, patient 1-on-1 learning covering Qaida, short Surahs, inspiring prophetic stories, and manners.',
    targetCourseSlug: 'childrens-islamic-education',
    recommendedCategory: 'Youth Focused'
  },
  {
    id: 'goal-ethics',
    label: 'Character Refinement & Daily Sunnahs',
    description: 'Cultivate humility, patience, respect for parents, and revive authentic morning and evening supplications.',
    targetCourseSlug: 'islah-character-development',
    recommendedCategory: 'Tarbiyah'
  }
];

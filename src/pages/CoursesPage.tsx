import React, { useState, useEffect } from 'react';
import { PageId, Course } from '../types';
import { COURSES as DEFAULT_COURSES } from '../data/courses';
import { trackEvent } from '../utils/analytics';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  BookOpen,
  BookMarked,
  Sparkles,
  Languages,
  GraduationCap,
  Compass,
  HeartHandshake,
  Sun,
  Baby,
  UserCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface CoursesPageProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  BookMarked,
  Sparkles,
  Languages,
  GraduationCap,
  Compass,
  HeartHandshake,
  Sun,
  Baby,
  UserCheck
};

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [filter, setFilter] = useState<'all' | 'quran' | 'islamic' | 'specialized'>('all');

  // Load published courses from database
  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => {});
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true;
    const cat = (course.category || '').toLowerCase();
    const id = (course.id || '').toLowerCase();
    const slug = (course.slug || '').toLowerCase();

    if (filter === 'quran') {
      return cat.includes('recitation') || cat.includes('memorization') || cat.includes('comprehension') ||
        ['nazra', 'hifz', 'tajweed', 'translation', 'quran-reading', 'hifz-ul-quran', 'quran-translation'].includes(id) ||
        ['quran-reading', 'hifz-ul-quran', 'tajweed', 'quran-translation'].includes(slug);
    }
    if (filter === 'islamic') {
      return cat.includes('curriculum') || cat.includes('essentials') || cat.includes('tarbiyah') || cat.includes('daily') ||
        ['islamic-studies', 'basic-knowledge', 'islah', 'dua-sunnah', 'basic-islamic-knowledge', 'islah-character-development', 'dua-and-sunnah'].includes(id) ||
        ['islamic-studies', 'basic-islamic-knowledge', 'islah-character-development', 'dua-and-sunnah'].includes(slug);
    }
    if (filter === 'specialized') {
      return cat.includes('youth') || cat.includes('coaching') || cat.includes('specialized') ||
        ['children', 'one-to-one', 'childrens-islamic-education', 'one-to-one-classes'].includes(id) ||
        ['childrens-islamic-education', 'one-to-one-classes'].includes(slug);
    }
    return true;
  });

  return (
    <div className="py-10 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <ScrollReveal direction="fade-up">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
            Curriculum Directory
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
            Our Online Courses
          </h1>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
            Tuhfat Al-Ilm Academy offers 10 structured online courses designed for beginners, children, and adult students seeking to learn or advance their Quranic recitation and Islamic understanding.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter Tabs */}
      <ScrollReveal direction="fade-up" delay={80}>
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#F4F1EA] rounded-2xl max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#064E3B]'
            }`}
          >
            All Programs (10)
          </button>
          <button
            type="button"
            onClick={() => setFilter('quran')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === 'quran'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#064E3B]'
            }`}
          >
            Quran &amp; Recitation
          </button>
          <button
            type="button"
            onClick={() => setFilter('islamic')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === 'islamic'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#064E3B]'
            }`}
          >
            Islamic Knowledge
          </button>
          <button
            type="button"
            onClick={() => setFilter('specialized')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === 'specialized'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#064E3B]'
            }`}
          >
            Children &amp; 1-on-1
          </button>
        </div>
      </ScrollReveal>

      {/* Course Cards Grid with Progressive Stagger */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredCourses.map((course, index) => {
          const IconComp = iconMap[course.iconName] || BookOpen;
          const staggerDelay = (index % 2) * 120;

          return (
            <ScrollReveal key={course.id} direction="fade-up" delay={staggerDelay}>
              <article className="h-full bg-white rounded-3xl border border-[#E2E8F0] p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:border-[#A7F3D0] hover:shadow-md transition-all group">
                <div className="space-y-4">
                  {/* Header row: Icon & Category */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]/60">
                      {course.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] group-hover:text-[#064E3B] transition-colors">
                    {course.name}
                  </h2>

                  {/* Short Description */}
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                    {course.shortDesc}
                  </p>

                  {/* Suitable Learners Box */}
                  <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs text-[#374151]">
                    <strong className="text-[#064E3B] block mb-1">Suitable Learners:</strong>
                    <span>{course.suitableLearners}</span>
                  </div>

                  {/* Features highlight */}
                  <ul className="space-y-1.5 pt-1">
                    {course.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-[#64748B] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons: Learn More (Dedicated Page) & Enroll Now */}
                <div className="mt-8 pt-5 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('course_click', { course_id: course.slug });
                      onNavigate('course-detail', course.slug);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('enroll_click', { course: course.slug });
                      onNavigate('contact', course.name);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <span>Enroll Now</span>
                  </button>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Advisory Note */}
      <ScrollReveal direction="zoom-in" delay={100}>
        <div className="bg-[#FAF9F5] rounded-2xl p-8 border border-[#E2E8F0] text-center max-w-2xl mx-auto space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
            Need Guidance Choosing the Right Program?
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            If you are unsure where to begin for yourself or your child, our admissions team will be pleased to assess current level and recommend the most suitable starting point.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#064E3B] hover:underline cursor-pointer"
            >
              <span>Contact us for a personalized recommendation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

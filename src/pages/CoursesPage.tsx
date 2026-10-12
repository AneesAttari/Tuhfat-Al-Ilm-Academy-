import React, { useState, useEffect, useMemo } from 'react';
import { Course, PageId } from '../types';
import { COURSES as DEFAULT_COURSES } from '../data/courses';
import { CourseCard } from '../components/CourseCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { trackEvent } from '../utils/analytics';
import {
  Search,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Clock,
  Users,
  Award,
  ArrowRight,
  MessageCircle,
  X,
  Filter
} from 'lucide-react';

interface CoursesPageProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  // Fetch dynamically published courses from the database if available
  useEffect(() => {
    setLoading(true);
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => {
        // Graceful fallback to DEFAULT_COURSES
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const cats = ['All'];
    courses.forEach((c) => {
      if (c.category && !cats.includes(c.category)) {
        cats.push(c.category);
      }
    });
    return cats;
  }, [courses]);

  // Filter courses by search query and category
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.name.toLowerCase().includes(q) ||
        course.shortDesc.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        (course.whatYouLearn && course.whatYouLearn.some((w) => w.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  return (
    <div className="space-y-16 lg:space-y-20 pb-20">
      {/* 1. HERO HEADER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F1EA] via-[#FAF9F5] to-white pt-10 pb-14 lg:pt-16 lg:pb-20 border-b border-[#E5E2D9]">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#064E3B]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-[#D97706]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="fade-up" delay={50}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D9B44A]" />
              <span>Comprehensive Quranic &amp; Islamic Curriculum</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={120}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight">
              Our Certified <span className="text-[#064E3B]">Online Courses</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={200}>
            <p className="mt-4 text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Explore our 9 structured 1-on-1 programs designed for children, beginners, and adults worldwide.
              Learn from certified teachers with flexible schedules in any timezone.
            </p>
          </ScrollReveal>

          {/* Quick Value Pillars */}
          <ScrollReveal direction="fade-up" delay={280}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#334155]">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <Users className="w-4 h-4 text-[#064E3B]" />
                <span>1-on-1 Personalized Attention</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <Clock className="w-4 h-4 text-[#064E3B]" />
                <span>Flexible Global Schedules</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <Award className="w-4 h-4 text-[#064E3B]" />
                <span>Qualified Male &amp; Female Teachers</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                <span>Free Trial Class Available</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. COURSES DIRECTORY CONTROLS (Search & Filter) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by name or topic..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B] transition-all bg-[#FAF9F5]/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#334155] rounded-md"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="text-xs sm:text-sm font-semibold text-[#64748B] flex items-center gap-1.5 self-center">
              <span>Showing</span>
              <span className="font-bold text-[#064E3B]">{filteredCourses.length}</span>
              <span>of {courses.length} courses</span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-[#94A3B8] shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#E2E8F0]/70'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. ALL 9 COURSE CARDS GRID (Reference Layout: faizanonline.net/courses style) */}
        {filteredCourses.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredCourses.map((course, index) => (
              <ScrollReveal
                key={course.id}
                direction="fade-up"
                delay={Math.min((index % 3) * 100, 300)}
              >
                <CourseCard
                  course={course}
                  onNavigate={onNavigate}
                  priority={index < 3}
                  index={index}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="mt-12 text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">No courses found</h3>
            <p className="text-sm text-[#64748B]">
              No courses matched your query &ldquo;{searchQuery}&rdquo;. Try another term or reset your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 4. ADMISSIONS ADVISORY & FREE TRIAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="bg-gradient-to-br from-[#064E3B] to-[#022C22] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                Free Academic Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Not sure which course is right for you or your child?
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                Book a free 3-day trial class. Our certified instructors will evaluate the student&rsquo;s current recitation,
                understand your personal learning objectives, and recommend the ideal curriculum plan.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('trial_click', { source: 'courses_page' });
                    onNavigate('contact');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-[#064E3B] bg-white hover:bg-[#FAF9F5] rounded-xl shadow transition-colors cursor-pointer"
                >
                  <span>Book Free 3-Day Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/923171503094?text=${encodeURIComponent(
                    'Assalamu Alaikum, I would like guidance on choosing the right course at Tuhfat Al-Ilm Academy.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-xl transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PageId, Course, Announcement, Teacher } from '../types';
import { COURSES as DEFAULT_COURSES } from '../data/courses';
import { DEFAULT_TEACHERS, getStoredTeachers } from '../data/teachers';
import { FAQS } from '../data/faqs';
import { trackEvent } from '../utils/analytics';
import { ScrollReveal } from '../components/ScrollReveal';
import { CourseCard } from '../components/CourseCard';
import { Card3D } from '../components/Card3D';
import { Hero3DStage } from '../components/Hero3DStage';
import { InteractiveHowItWorks } from '../components/InteractiveHowItWorks';
import {
  ArrowRight,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Clock,
  Users,
  ShieldCheck,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  CheckCircle2,
  Baby,
  UserCheck,
  Mail,
  Phone,
  Compass
} from 'lucide-react';
const heroImg = '/images/closed_quran_rehal.webp';
const mosqueImg = '/images/peaceful_mosque_courtyard.webp';
import { safeGetJson } from '../lib/apiSafe';

interface HomePageProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [teachers, setTeachers] = useState<Teacher[]>(getStoredTeachers);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<'all' | 'recitation' | 'studies'>('all');

  // Load published courses, teachers, and announcements dynamically from database
  useEffect(() => {
    safeGetJson('/api/courses')
      .then((data) => {
        if (data && data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => {});

    safeGetJson('/api/teachers')
      .then((data) => {
        if (data && data.teachers && Array.isArray(data.teachers) && data.teachers.length > 0) {
          setTeachers(data.teachers);
        }
      })
      .catch(() => {});

    safeGetJson('/api/announcements')
      .then((data) => {
        if (data && data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  // Filter courses for concrete exploration
  const filteredCourses = courses.filter((c) => {
    if (courseCategoryFilter === 'recitation') {
      return (
        c.category.toLowerCase().includes('recitation') ||
        c.category.toLowerCase().includes('memorization') ||
        c.category.toLowerCase().includes('tajweed') ||
        c.slug.includes('quran') ||
        c.slug.includes('hifz') ||
        c.slug.includes('tajweed')
      );
    }
    if (courseCategoryFilter === 'studies') {
      return (
        c.category.toLowerCase().includes('curriculum') ||
        c.category.toLowerCase().includes('essentials') ||
        c.category.toLowerCase().includes('spiritual') ||
        c.category.toLowerCase().includes('youth') ||
        c.slug.includes('islamic') ||
        c.slug.includes('islah') ||
        c.slug.includes('dua') ||
        c.slug.includes('children')
      );
    }
    return true;
  });

  // Showcase up to 6 courses on homepage
  const displayedCourses = filteredCourses.slice(0, 6);

  // 4 Top FAQs for the homepage FAQ preview
  const previewFaqs = FAQS.slice(0, 4);

  // Top 3 faculty members to feature
  const featuredTeachers = (teachers.length > 0 ? teachers : DEFAULT_TEACHERS).slice(0, 3);

  const handleScrollToCourses = () => {
    trackEvent('course_cta_click', { page: '/' });
    const target = document.getElementById('featured-courses');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('courses');
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 overflow-hidden">
      {/* Published Announcement Notice (if any) */}
      {announcements.length > 0 && (
        <aside aria-label="Announcement" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ScrollReveal direction="fade-down" duration={500}>
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#064E3B] text-white shrink-0" aria-hidden="true">
                  <Bell className="w-4 h-4" />
                </span>
                <div>
                  <strong className="text-[#064E3B] font-bold text-sm block">{announcements[0].title}</strong>
                  <span className="text-[#047857]">{announcements[0].short_text}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="hidden sm:inline-flex items-center gap-1 font-semibold text-[#064E3B] hover:underline whitespace-nowrap cursor-pointer"
              >
                <span>Inquire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </ScrollReveal>
        </aside>
      )}

      {/* 1. HERO SECTION (Research-Grounded, Responsive & Mobile-First "First Look" with 3D Depth) */}
      <section className="relative bg-gradient-to-b from-[#F4F1EA] via-[#FAF9F5] to-white pt-6 sm:pt-10 pb-12 sm:pb-16 lg:pt-16 lg:pb-24 border-b border-[#E5E2D9] overflow-hidden">
        {/* Ambient Islamic Geometric Pattern Backdrop & Soft Gold Glow */}
        <div className="absolute inset-0 bg-islamic-pattern-light opacity-70 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-32 right-10 w-[500px] h-[500px] rounded-full bg-radial from-[#D9B44A]/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              {/* Grounded Academy Merits: Clean unboxed metadata with gold typographic separators (Zero-Pill Discipline) */}
              <ScrollReveal direction="fade-up" delay={30}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3.5 gap-y-1.5 text-xs font-semibold text-[#064E3B]">
                  <span>Structured Curriculum</span>
                  <span aria-hidden="true" className="text-[#D9B44A]">·</span>
                  <span>Qualified Huffaz &amp; Scholars</span>
                  <span aria-hidden="true" className="text-[#D9B44A]">·</span>
                  <span>1-on-1 Dedicated Classes</span>
                </div>
              </ScrollReveal>

              {/* Exact Hero Heading: Confident 3-line cadence matching the academy's motto */}
              <ScrollReveal direction="fade-up" delay={80}>
                <h1 className="text-[1.85rem] sm:text-4xl lg:text-[3.25rem] font-bold tracking-tight text-[#0F172A] leading-[1.18] sm:leading-[1.15] [text-wrap:balance]">
                  <span className="block">Learn the Quran.</span>
                  <span className="block text-[#064E3B]">Understand Islam.</span>
                  <span className="block">Grow with Knowledge.</span>
                </h1>
              </ScrollReveal>

              {/* Concise, Internationally Understandable Introductory Copy */}
              <ScrollReveal direction="fade-up" delay={140}>
                <p className="text-sm sm:text-base lg:text-lg text-[#334155] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Tuhfat Al-Ilm Academy provides accessible online Quran and Islamic education for students around the world, with flexible learning designed for children and adults.
                </p>
              </ScrollReveal>

              {/* Outcome-Oriented Action Buttons (WCAG 2.2 AA touch target size >= 48px) with 3D tactile press */}
              <ScrollReveal direction="fade-up" delay={200}>
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5">
                  {/* Primary CTA: Book a Free Trial directly */}
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] active:bg-[#022C22] border border-transparent hover:border-[#D9B44A]/40 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] focus-visible:ring-offset-2 whitespace-nowrap"
                  >
                    <span>Book a Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary CTA: Explore Courses */}
                  <button
                    type="button"
                    onClick={handleScrollToCourses}
                    className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] text-sm font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] active:bg-[#A7F3D0] border border-[#A7F3D0] rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] focus-visible:ring-offset-2 whitespace-nowrap cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#064E3B]" />
                    <span>View Courses</span>
                  </button>

                  {/* 3D Interactive Learning Universe CTA */}
                  <button
                    type="button"
                    onClick={() => onNavigate('explore-journey')}
                    className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] text-sm font-semibold text-[#064E3B] bg-white hover:bg-[#FAF9F5] active:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] focus-visible:ring-offset-2 whitespace-nowrap cursor-pointer"
                    title="Explore courses in our interactive 3D universe"
                  >
                    <Compass className="w-4 h-4 text-[#D9B44A]" />
                    <span>3D Journey</span>
                  </button>

                  {/* Secondary CTA: Explicit WhatsApp link with verified number */}
                  <a
                    href="https://wa.me/923171503094?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20inquire%20about%20online%20classes%20at%20Tuhfat%20Al-Ilm%20Academy."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { page: '/' })}
                    className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] text-sm font-semibold text-[#064E3B] bg-white hover:bg-[#F0FDF4] active:bg-[#DCFCE7] border border-[#CBD5E1] hover:border-[#86EFAC] rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] focus-visible:ring-offset-2 whitespace-nowrap"
                    aria-label="Contact Tuhfat Al-Ilm Academy on WhatsApp (opens in new tab)"
                  >
                    <MessageCircle className="w-4 h-4 text-[#059669]" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Grounded Institutional Trust Strip */}
                <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Flexible Schedules</span>
                  </span>
                  <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>1-on-1 Classes</span>
                  </span>
                  <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Male &amp; Female Teachers</span>
                  </span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Hero Image Frame: 3D Perspective Stage with Multi-Layer Parallax Depth */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal direction="fade-left" delay={160} className="w-full">
                <Hero3DStage onExploreCourses={handleScrollToCourses} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LEARNING PATHWAYS: CONCRETE TEACHING OPTIONS FOR CHILDREN & ADULTS (Nielsen Norman Group Principle) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Tailored Instruction
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1.5 tracking-tight">
              Learning Options for Children &amp; Adults
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2">
              Teaching methods, class paces, and schedules are specifically adapted for every age group and starting level.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Children Pathway */}
          <ScrollReveal direction="fade-up" delay={0}>
            <Card3D tiltOptions={{ maxTilt: 5, scale: 1.015 }} className="h-full">
              <div className="h-full bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs hover:border-[#D9B44A]/40 flex flex-col justify-between transition-colors">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] flex items-center justify-center [transform:translateZ(12px)] shadow-xs">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">Programs for Children (Ages 4+)</h3>
                    <p className="text-xs font-semibold text-[#064E3B] mt-0.5">Patient, Engaging &amp; Step-by-Step</p>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Young learners begin with basic Arabic letter recognition and Makharij through the Qaida, moving steadily toward fluent Nazra Quran recitation with daily duas and Islamic manners (Adaab).
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#334155] pt-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>Gentle, encouraging guidance tailored to young attention spans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>Daily Sunnah duas, Kalimahs, and practical Islamic morals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>Regular feedback shared directly with parents</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => onNavigate('course-detail', 'childrens-islamic-education')}
                    className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors cursor-pointer"
                  >
                    <span>Explore Children’s Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card3D>
          </ScrollReveal>

          {/* Adult Learners Pathway */}
          <ScrollReveal direction="fade-up" delay={120}>
            <Card3D tiltOptions={{ maxTilt: 5, scale: 1.015 }} className="h-full">
              <div className="h-full bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs hover:border-[#D9B44A]/40 flex flex-col justify-between transition-colors">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] flex items-center justify-center [transform:translateZ(12px)] shadow-xs">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">Programs for Adult Learners</h3>
                    <p className="text-xs font-semibold text-[#1E40AF] mt-0.5">Flexible, Respectful &amp; Thorough</p>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Adult brothers and sisters can correct their recitation pronunciation, master Tajweed rules, memorize Surahs, or study Quran translation with contextual meaning at convenient times.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#334155] pt-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>Tajweed correction for clear, melodious recitation in Salah</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>Quran Translation &amp; essential Fiqh of daily worship</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>Flexible morning or evening schedules aligned with work routines</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => onNavigate('course-detail', 'tajweed')}
                    className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-[#1E40AF] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors cursor-pointer"
                  >
                    <span>Explore Tajweed &amp; Adult Courses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card3D>
          </ScrollReveal>
        </div>
      </section>

      {/* 2.5 INTERACTIVE 3D UNIVERSE PORTAL: "EXPLORE YOUR LEARNING JOURNEY" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#043D2E] to-[#022C22] text-white p-6 sm:p-10 lg:p-12 border border-[#D9B44A]/40 shadow-2xl">
            {/* Subtle Islamic Geometric Rosette in Background */}
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#D9B44A]/10 blur-2xl pointer-events-none" aria-hidden="true" />
            <div className="absolute right-6 bottom-4 opacity-10 pointer-events-none hidden md:block" aria-hidden="true">
              <Compass className="w-64 h-64 text-[#D9B44A]" />
            </div>

            <div className="relative max-w-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FDE68A] uppercase tracking-wider">
                <Compass className="w-4 h-4 text-[#D9B44A]" />
                <span>Interactive 3D Experience</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Explore Your Learning Journey in an Immersive 3D Garden
              </h2>

              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
                Step into a virtual architectural courtyard inspired by classical Islamic geometry. Tour 9 distinct course pavilions, interact with fountains and archways, and discover the personalized learning path suited to your family.
              </p>

              {/* Zero-Pill Features Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A7F3D0]">
                <span>9 Interactive Pavilions</span>
                <span aria-hidden="true" className="text-emerald-500">·</span>
                <span>Day &amp; Peaceful Evening Modes</span>
                <span aria-hidden="true" className="text-emerald-500">·</span>
                <span>Smooth 3D Orbit &amp; Zoom</span>
                <span aria-hidden="true" className="text-emerald-500">·</span>
                <span>Direct Syllabus Discovery</span>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('explore-journey')}
                  className="btn-tactile inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-[#064E3B] bg-[#FDE68A] hover:bg-[#FCD34D] active:bg-[#F59E0B] shadow-lg transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#064E3B]" />
                  <span>Enter 3D Universe</span>
                  <ArrowRight className="w-4 h-4 text-[#064E3B]" />
                </button>

                <button
                  type="button"
                  onClick={handleScrollToCourses}
                  className="btn-tactile inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer"
                >
                  <span>Or Browse Standard Course Grid</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. FEATURED COURSES SHOWCASE: ACTUAL CURRICULUM PROGRAMS */}
      <section id="featured-courses" className="bg-white py-14 sm:py-16 border-y border-[#E5E2D9] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                  Authentic Curriculum
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
                  Featured Quran &amp; Islamic Courses
                </h2>
                <p className="text-sm text-[#475569] mt-1 max-w-xl">
                  Each program is taught one-to-one with structured lesson plans and measurable milestones.
                </p>
              </div>

              {/* Functional interactive category tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setCourseCategoryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    courseCategoryFilter === 'all'
                      ? 'bg-white text-[#064E3B] font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  All Programs
                </button>
                <button
                  type="button"
                  onClick={() => setCourseCategoryFilter('recitation')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    courseCategoryFilter === 'recitation'
                      ? 'bg-white text-[#064E3B] font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Quran &amp; Tajweed
                </button>
                <button
                  type="button"
                  onClick={() => setCourseCategoryFilter('studies')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    courseCategoryFilter === 'studies'
                      ? 'bg-white text-[#064E3B] font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Islamic Studies
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Grid of Actual Course Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {displayedCourses.map((course, index) => (
              <ScrollReveal key={course.id} direction="fade-up" delay={(index % 3) * 80}>
                <CourseCard
                  course={course}
                  onNavigate={onNavigate}
                  priority={index < 3}
                  index={index}
                />
              </ScrollReveal>
            ))}
          </div>

          {/* Link to view all 9 courses */}
          <ScrollReveal direction="fade-up" delay={150}>
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#064E3B] hover:text-[#043D2E] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-colors cursor-pointer"
              >
                <span>View All 9 Academy Programs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. HOW ONLINE LEARNING WORKS: INTERACTIVE 4-STEP VISUAL EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Interactive 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1.5 tracking-tight">
              How Online Classes Work
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2">
              From your initial inquiry to regular lessons, beginning your education with us is simple, guided, and interactive.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="fade-up" delay={60}>
          <InteractiveHowItWorks onNavigate={onNavigate} />
        </ScrollReveal>
      </section>

      {/* 5. FACULTY TRANSPARENCY: MEET OUR QUALIFIED TEACHERS (Real Faculty from Data) */}
      <section className="bg-white py-14 sm:py-16 border-y border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                  Verified Faculty
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
                  Qualified Teachers &amp; Scholars
                </h2>
                <p className="text-sm text-[#475569] mt-1 max-w-xl">
                  Our instructors are certified Huffaz, Qaris, and Islamic Scholars with years of structured online teaching experience.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('teachers')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#064E3B] hover:text-[#043D2E] cursor-pointer self-start sm:self-auto"
              >
                <span>View Full Faculty Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          {/* 3 Real Instructors from verified teachers.ts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredTeachers.map((teacher, idx) => (
              <ScrollReveal key={teacher.id || idx} direction="fade-up" delay={idx * 90}>
                <Card3D tiltOptions={{ maxTilt: 5, scale: 1.015 }} className="h-full">
                  <article className="h-full bg-[#FAF9F5] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#D9B44A]/40 flex flex-col justify-between transition-colors">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] flex items-center justify-center font-bold text-base [transform:translateZ(10px)] shadow-xs">
                        {teacher.name.split(' ').slice(1, 3).map((n) => n[0]).join('') || 'TI'}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#0F172A]">{teacher.name}</h3>
                        <p className="text-xs font-semibold text-[#064E3B]">{teacher.role}</p>
                      </div>

                      <div className="space-y-1.5 pt-1 text-xs text-[#475569]">
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                          <span>{teacher.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                          <span>{teacher.experience}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748B] leading-relaxed pt-2 border-t border-[#E5E2D9]">
                        {teacher.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E5E2D9] flex items-center justify-between text-xs text-[#64748B]">
                      <span className="font-medium text-[#064E3B]">{teacher.specialty.split(',')[0]}</span>
                      <span>1-on-1 Classes</span>
                    </div>
                  </article>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ABOUT THE ACADEMY (Institutional Mission & Respectful Atmosphere) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <ScrollReveal direction="fade-right">
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md bg-white p-2">
                <img
                  src={mosqueImg}
                  alt="A peaceful mosque courtyard in soft natural daylight representing the serene environment of Tuhfat Al-Ilm Academy."
                  width={600}
                  height={450}
                  className="w-full h-auto aspect-[4/3] object-cover rounded-xl"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <ScrollReveal direction="fade-left" delay={50}>
              <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                Institutional Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
                Dedicated to Authentic Quranic Knowledge from Home
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="fade-left" delay={120}>
              <p className="text-base text-[#334155] leading-relaxed">
                Tuhfat Al-Ilm Academy is an online Islamic academy founded to make structured Quranic reading, Tajweed, and foundational Islamic understanding accessible to families across the globe.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="fade-left" delay={180}>
              <p className="text-sm text-[#475569] leading-relaxed">
                We believe learning the Holy Quran requires patience, individualized feedback, and reverence. Whether a child is learning to connect Arabic letters for the first time or an adult is perfecting their recitation rhythm, our instructors ensure every lesson is conducted with gentleness and academic rigour.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="fade-left" delay={240}>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-colors cursor-pointer"
                >
                  <span>Learn More About the Academy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS PREVIEW (Accessible Accordion) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1.5 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#475569] mt-2">
              Straightforward answers to common questions about class setup, schedules, and learning methods.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {previewFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <ScrollReveal key={idx} direction="fade-up" delay={idx * 60}>
                <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 min-h-[52px] flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F172A] hover:bg-[#FAF9F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#064E3B] shrink-0" aria-hidden="true" />
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#064E3B] shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#94A3B8] shrink-0" aria-hidden="true" />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="p-5 pt-0 text-sm text-[#475569] leading-relaxed bg-[#FAF9F5]/40 border-t border-[#E2E8F0]/60"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal direction="fade-up" delay={120}>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => onNavigate('faq')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#064E3B] hover:underline cursor-pointer min-h-[44px]"
            >
              <span>View All Academy FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. FINAL ENROLLMENT & CONTACT SECTION (Transparent Contact Coordinates) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ScrollReveal direction="zoom-in" duration={600}>
          <div className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-6">
            <span className="text-xs uppercase tracking-wider text-[#A7F3D0] font-semibold">
              Begin Your Studies
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto [text-wrap:balance]">
              Ready to Begin Your Quran and Islamic Studies?
            </h2>
            <p className="text-sm sm:text-base text-[#D1FAE5] max-w-xl mx-auto leading-relaxed">
              Connect with our admissions team to discuss your goals, select an appropriate course, and set your weekly class times.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] text-sm font-bold text-[#064E3B] bg-white hover:bg-[#FAF9F5] rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Book Free Trial Class</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/923171503094?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20enroll%20in%20Tuhfat%20Al-Ilm%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { page: '/' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] border border-[#34D399]/40 rounded-xl transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Direct WhatsApp inquiry with admissions (opens in new tab)"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Admissions</span>
              </a>
            </div>

            {/* Direct Verified Contact Coordinates */}
            <div className="pt-4 border-t border-[#047857]/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#A7F3D0]">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>+92 309 6794698</span>
              </span>
              <span aria-hidden="true" className="text-[#047857]">·</span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>tuhfatalilmacademy@gmail.com</span>
              </span>
              <span aria-hidden="true" className="text-[#047857]">·</span>
              <span>Online Classes Worldwide</span>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PageId, Course, Announcement } from '../types';
import { COURSES as DEFAULT_COURSES } from '../data/courses';
import { FAQS } from '../data/faqs';
import { trackEvent } from '../utils/analytics';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  ArrowRight,
  MessageCircle,
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
  Globe2,
  Clock,
  Users,
  ShieldCheck,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import heroImg from '../assets/images/quran_hero_learning_1791212029554.jpg';
import studyImg from '../assets/images/quran_tajweed_reading_1791212054850.jpg';

interface HomePageProps {
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

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Load published courses and announcements dynamically from database
  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => {});

    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  // 6 Featured courses for the homepage
  const featuredCourses = courses.slice(0, 6);
  // 4 Top FAQs for the homepage FAQ preview
  const previewFaqs = FAQS.slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 overflow-hidden">
      {/* Published Announcement Notice (if any) */}
      {announcements.length > 0 && (
        <aside aria-label="Announcement" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ScrollReveal direction="fade-down" duration={500}>
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#064E3B] text-white">
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

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F1EA] via-[#FAF9F5] to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E5E2D9]">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#064E3B]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-[#D97706]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <ScrollReveal direction="fade-up" delay={50}>
                {/* Clean Unboxed Kicker */}
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold tracking-wider text-[#064E3B] uppercase">
                  <span>Structured Curriculum</span>
                  <span aria-hidden="true" className="text-[#D97706]">·</span>
                  <span>Qualified Teachers</span>
                  <span aria-hidden="true" className="text-[#D97706]">·</span>
                  <span>One-to-One Attention</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="fade-up" delay={120}>
                {/* Exact Hero Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.18] [text-wrap:balance]">
                  Learn the Quran. <br className="hidden sm:inline" />
                  <span className="text-[#064E3B]">Understand Islam.</span> <br className="hidden sm:inline" />
                  Grow with Knowledge.
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="fade-up" delay={200}>
                {/* Exact Supporting Text */}
                <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Tuhfat Al-Ilm Academy provides accessible online Quran and Islamic education for students around the world, with flexible learning designed for children and adults.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="fade-up" delay={280}>
                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('course_cta_click', { page: '/' });
                      onNavigate('contact');
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-2"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://wa.me/923171503094"
                    onClick={() => trackEvent('whatsapp_click', { page: '/' })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-[#064E3B] bg-white hover:bg-[#F0FDF4] border border-[#CBD5E1] hover:border-[#86EFAC] rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#059669]" />
                    <span>Contact Us on WhatsApp</span>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Visual Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal direction="fade-left" delay={200} className="w-full max-w-md lg:max-w-none">
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden bg-white p-2.5 border border-[#E2E8F0] shadow-xl">
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-xl overflow-hidden bg-[#064E3B]/10">
                      <img
                        src={heroImg}
                        alt="Holy Quran open on an authentic wooden carved stand with warm natural lighting"
                        className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-500"
                        loading="eager"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                        <p className="font-semibold text-sm drop-shadow-sm">Tuhfat Al-Ilm Academy</p>
                        <p className="text-white/80 drop-shadow-sm text-[11px]">Individual guidance at your preferred schedule</p>
                      </div>
                    </div>
                  </div>

                  {/* Subtle trust badge */}
                  <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 bg-white py-2.5 px-4 rounded-xl border border-[#E2E8F0] shadow-md">
                    <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#0F172A]">Students Worldwide</p>
                      <p className="text-[11px] text-[#64748B]">All time zones welcomed</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACADEMY INTRODUCTION & WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Our Core Values
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2 tracking-tight">
              Why Learn With Tuhfat Al-Ilm Academy
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2">
              A patient, supportive online educational environment designed to help every learner thrive.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal direction="fade-up" delay={0}>
            <div className="h-full p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Structured Learning</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Step-by-step curriculum with progressive milestones from foundational letters to fluent recitation and memorization.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={100}>
            <div className="h-full p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Flexible Online Classes</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Timings customized to your routine, allowing students worldwide to learn from home without travel stress.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={200}>
            <div className="h-full p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">One-to-One Attention</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Individual class sessions focused entirely on the student, ensuring proper pronunciation and immediate feedback.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={300}>
            <div className="h-full p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Quran &amp; Islamic Education</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                A balanced blend of accurate Quran recitation with essential Islamic manners, daily duas, and core knowledge.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. FEATURED COURSES (Each 'Learn More' opens its OWN course detail page!) */}
      <section className="bg-white py-16 border-y border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                  Explore Programs
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
                  Featured Courses
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#064E3B] hover:text-[#043D2E] cursor-pointer"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, index) => {
              const IconComp = iconMap[course.iconName] || BookOpen;
              const staggerDelay = (index % 3) * 120;
              return (
                <ScrollReveal key={course.id} direction="fade-up" delay={staggerDelay}>
                  <div className="h-full bg-[#FAF9F5] rounded-2xl border border-[#E2E8F0] p-6 flex flex-col justify-between hover:border-[#A7F3D0] hover:shadow-md transition-all group">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-4 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-[#64748B] block mb-1">
                        {course.category}
                      </span>
                      <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#064E3B] transition-colors">
                        {course.name}
                      </h3>
                      <p className="text-sm text-[#475569] mt-2.5 leading-relaxed line-clamp-3">
                        {course.shortDesc}
                      </p>
                    </div>

                    {/* Distinction: 'Learn More' opens this specific course detail page! */}
                    <div className="mt-6 pt-4 border-t border-[#E5E2D9] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          trackEvent('course_click', { course_id: course.slug });
                          onNavigate('course-detail', course.slug);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:underline cursor-pointer"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate('contact', course.name)}
                        className="text-xs text-[#059669] hover:underline font-semibold cursor-pointer"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Clear Four Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2">
              Beginning your online classes at Tuhfat Al-Ilm Academy is straightforward.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal direction="fade-up" delay={0}>
            <div className="h-full bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <span className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Contact Us</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Message us on WhatsApp, call, or email to introduce yourself or your child.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={100}>
            <div className="h-full bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <span className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Tell Us Your Learning Goals</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Share your current level, preferred course, and what you wish to accomplish.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={200}>
            <div className="h-full bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <span className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Choose a Suitable Schedule</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Select class days and times aligned with your family or work schedule.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="fade-up" delay={300}>
            <div className="h-full bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
              <span className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-sm mb-3">
                4
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Begin Your Classes</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Connect with your dedicated instructor online and begin your learning path.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="fade-up" delay={150}>
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow transition-all cursor-pointer"
            >
              <span>Start Your Learning Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. ABOUT PREVIEW */}
      <section className="bg-white py-16 border-y border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal direction="fade-right">
                <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md">
                  <img
                    src={studyImg}
                    alt="Quran and study notebook in a calm learning atmosphere"
                    className="w-full h-auto aspect-[4/3] object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <ScrollReveal direction="fade-left" delay={50}>
                <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                  About the Academy
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
                  Dedicated to Authentic Quranic Knowledge from Home
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="fade-left" delay={120}>
                <p className="text-base text-[#475569] leading-relaxed">
                  Tuhfat Al-Ilm Academy is an online Islamic learning platform focused on helping students learn Quran and essential Islamic knowledge from home.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="fade-left" delay={180}>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  We work with learners of all ages—from young children taking their first steps in the Qaida to adults seeking Tajweed mastery or Quranic comprehension. Every lesson is conducted with patience, personal attention, and respect.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="fade-left" delay={240}>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Learn More About Us</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#475569] mt-2">
              Quick answers to help you get started with our online classes.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {previewFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <ScrollReveal key={idx} direction="fade-up" delay={idx * 75}>
                <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F172A] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#064E3B] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#064E3B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#94A3B8] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-[#475569] leading-relaxed bg-[#FAF9F5]/50 border-t border-[#E2E8F0]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal direction="fade-up" delay={150}>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => onNavigate('faq')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:underline cursor-pointer"
            >
              <span>View All FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. FINAL ENROLLMENT CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ScrollReveal direction="zoom-in" duration={700}>
          <div className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Ready to Begin Your Learning Journey?
            </h2>
            <p className="text-sm sm:text-base text-[#D1FAE5] max-w-xl mx-auto leading-relaxed">
              Reach out to Tuhfat Al-Ilm Academy today to discuss your goals, select your course, and arrange your class schedule.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold text-[#064E3B] bg-white hover:bg-[#FAF9F5] rounded-xl shadow transition-colors cursor-pointer"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/923171503094"
                onClick={() => trackEvent('whatsapp_click', { page: '/' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] border border-[#34D399]/40 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

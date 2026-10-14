import React, { useState, useEffect } from 'react';
import { Course, PageId } from '../types';
import { getRelatedCourses, getCourseImage } from '../data/courses';
import { trackEvent } from '../utils/analytics';
import { ScrollReveal } from '../components/ScrollReveal';
import { CourseCard } from '../components/CourseCard';
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
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Users,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface CourseDetailPageProps {
  course: Course;
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

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const IconComp = iconMap[course.iconName] || BookOpen;
  const relatedCourses = getRelatedCourses(course.slug, 3);

  // SEO & Structured Data for this individual course
  useEffect(() => {
    const officialBase = 'https://tuhfatalilm.online';
    const courseUrl = `${officialBase}/courses/${course.slug}`;

    const COURSE_TITLES: Record<string, string> = {
      'quran-reading': 'Online Quran Reading & Nazra Classes | Tuhfat Al-Ilm Academy',
      'tajweed': 'Online Quran Tajweed Classes | Tuhfat Al-Ilm Academy',
      'hifz-ul-quran': 'Online Quran Memorization (Hifz) Classes | Tuhfat Al-Ilm Academy',
      'quran-translation': 'Online Quran Translation & Tafseer Course | Tuhfat Al-Ilm Academy',
      'islamic-studies': 'Comprehensive Online Islamic Studies Course | Tuhfat Al-Ilm Academy',
      'basic-islamic-knowledge': 'Learn Namaz & Basic Islamic Knowledge Online | Tuhfat Al-Ilm Academy',
      'islah-character-development': 'Islamic Character & Moral Ethics Course | Tuhfat Al-Ilm Academy',
      'dua-and-sunnah': 'Daily Masnoon Duas & Sunnah Course Online | Tuhfat Al-Ilm Academy',
      'childrens-islamic-education': 'Online Quran & Islamic Classes for Kids | Tuhfat Al-Ilm Academy'
    };

    const pageTitle = COURSE_TITLES[course.slug] || `${course.name} | Tuhfat Al-Ilm Academy`;
    document.title = pageTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', course.shortDesc);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', courseUrl);

    // Update OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', course.shortDesc);
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', courseUrl);

    // Update Twitter Cards
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', course.shortDesc);

    // Inject Schema.org Course, BreadcrumbList, and FAQPage structured data
    let scriptTag = document.getElementById('course-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'course-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schemaGraph: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.name,
        description: course.detailedDesc,
        url: courseUrl,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Tuhfat Al-Ilm Academy',
          url: officialBase
        },
        educationalCredentialAwarded: 'Course Completion Assessment',
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseSchedule: 'Flexible / 1-on-1 scheduled sessions'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${officialBase}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Courses',
            item: `${officialBase}/courses`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: course.name,
            item: courseUrl
          }
        ]
      }
    ];

    if (course.faq && course.faq.length > 0) {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: course.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      });
    }

    scriptTag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph
    });

    return () => {
      const existingScript = document.getElementById('course-schema');
      if (existingScript) existingScript.remove();
    };
  }, [course]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Breadcrumbs Navigation */}
      <ScrollReveal direction="fade-in" duration={400}>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#64748B]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-[#64748B] hover:text-[#064E3B] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-[#CBD5E1]">/</span>
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="text-[#64748B] hover:text-[#064E3B] transition-colors cursor-pointer"
          >
            Courses
          </button>
          <span className="text-[#CBD5E1]">/</span>
          <span className="font-semibold text-[#064E3B] truncate max-w-[200px] sm:max-w-none" aria-current="page">
            {course.name}
          </span>
        </nav>
      </ScrollReveal>

      {/* 2. Top Navigation Bar: Back to All Courses */}
      <ScrollReveal direction="fade-in" delay={50} duration={400}>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Courses</span>
          </button>

          <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0]/70">
            {course.category}
          </span>
        </div>
      </ScrollReveal>

      {/* 3. Hero Header Section */}
      <ScrollReveal direction="fade-up" delay={80}>
        <section className="bg-gradient-to-br from-[#064E3B] to-[#022C22] text-white rounded-3xl p-7 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                <IconComp className="w-4 h-4 text-[#D9B44A]" />
                <span>International Online Curriculum</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {course.name}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-3xl">
                {course.shortDesc}
              </p>

              {/* Quick Summary Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#D9B44A]" />
                  <span>1-on-1 Dedicated Guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#D9B44A]" />
                  <span>Flexible Schedule</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D9B44A]" />
                  <span>Qualified Teachers</span>
                </div>
              </div>
            </div>

            {/* Right CTA Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
              <h2 className="text-base font-bold text-white">Ready to begin this course?</h2>
              <p className="text-xs text-emerald-100">
                Connect with our admissions team to set your schedule and start learning.
              </p>
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('enroll_click', { course: course.slug });
                    onNavigate('contact', course.name);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-[#064E3B] bg-white hover:bg-[#FAF9F5] rounded-xl shadow transition-colors cursor-pointer"
                >
                  <span>Enroll in This Course</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/923171503094?text=${encodeURIComponent(`Assalamu Alaikum, I am interested in enrolling in the "${course.name}" course at Tuhfat Al-Ilm Academy. Please provide me with schedule options.`)}`}
                  onClick={() => trackEvent('whatsapp_click', { course: course.slug })}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-xl transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us Directly</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 3b. High-Definition Course Banner Showcase */}
      <ScrollReveal direction="fade-up" delay={90}>
        <div className="w-full aspect-[3/2] sm:aspect-[21/9] max-h-[460px] rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-md bg-[#FAF9F5] relative">
          <img
            src={getCourseImage(course)}
            alt={`${course.name} Official Banner - Tuhfat Al-Ilm Academy`}
            width={1200}
            height={800}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold text-[#064E3B] bg-white/95 backdrop-blur-xs border border-white/60 shadow-xs">
              {course.category}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold text-white bg-black/50 backdrop-blur-xs border border-white/20">
              {course.duration || 'Flexible Schedule'}
            </span>
            {course.level && (
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold text-white bg-black/50 backdrop-blur-xs border border-white/20">
                {course.level}
              </span>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* 4. Course Overview & Detailed Description */}
      <ScrollReveal direction="fade-up">
        <section className="bg-white rounded-3xl p-7 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              In-Depth Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
              About the Course
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
            {course.detailedDesc}
          </p>

          {/* Suitable For Callout */}
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-2">
            <div className="flex items-center gap-2 text-[#064E3B] font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>Who This Course Is Suitable For</span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed">
              {course.suitableLearners}
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. What Students Will Learn (Syllabus & Core Topics) */}
      <section className="space-y-6">
        <ScrollReveal direction="fade-up">
          <div>
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Structured Learning Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
              What You Will Learn
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Carefully curated topics ensuring clear progression and mastery at every step.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.whatYouLearn.map((item, idx) => (
            <ScrollReveal key={idx} direction="fade-up" delay={idx * 60}>
              <div className="h-full bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-3.5 hover:border-[#A7F3D0] transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                </div>
                <p className="text-sm text-[#334155] font-medium leading-relaxed">
                  {item}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. Learning Approach & Class Format */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScrollReveal direction="fade-up" delay={0}>
          <div className="h-full bg-white rounded-3xl p-7 border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">Our Learning Approach</h3>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {course.learningApproach}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="fade-up" delay={120}>
          <div className="h-full bg-white rounded-3xl p-7 border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">Class Format &amp; Scheduling</h3>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {course.classFormat}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. Key Benefits */}
      <ScrollReveal direction="fade-up">
        <section className="bg-white rounded-3xl p-7 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Why Choose This Course
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
              Key Course Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {course.benefits.map((benefit, idx) => (
              <ScrollReveal key={idx} direction="fade-up" delay={idx * 60}>
                <div className="h-full p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </div>
                  <p className="text-sm text-[#334155] font-medium leading-relaxed">
                    {benefit}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 8. Course Specific Frequently Asked Questions */}
      <section className="bg-white rounded-3xl p-7 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-6">
        <ScrollReveal direction="fade-up">
          <div>
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Questions &amp; Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Common questions regarding our {course.name} curriculum and class arrangements.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {course.faq.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <ScrollReveal key={idx} direction="fade-up" delay={idx * 75}>
                <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F172A] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#064E3B] shrink-0" />
                      <span>{item.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#064E3B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#94A3B8] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-[#475569] leading-relaxed bg-[#FAF9F5]/50 border-t border-[#E2E8F0]/60">
                      {item.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 9. ENROLLMENT & CONTACT CTA SECTION */}
      <ScrollReveal direction="zoom-in">
        <section className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Admissions Open Worldwide
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Interested in learning {course.name}?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Contact Tuhfat Al-Ilm Academy to discuss your learning goals, preferred class schedule, and arrange your initial lesson.
            </p>
          </div>

          {/* 5 Prominent Contact Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {/* Enroll Now */}
            <button
              type="button"
              onClick={() => {
                trackEvent('enroll_click', { course: course.slug });
                onNavigate('contact', course.name);
              }}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-[#064E3B] bg-white hover:bg-[#FAF9F5] rounded-xl shadow transition-colors cursor-pointer"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* WhatsApp Us */}
            <a
              href={`https://wa.me/923171503094?text=${encodeURIComponent(`Assalamu Alaikum, I would like to inquire about the ${course.name} course at Tuhfat Al-Ilm Academy.`)}`}
              onClick={() => trackEvent('whatsapp_click', { course: course.slug })}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] border border-[#34D399]/40 rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp Us</span>
            </a>

            {/* Call Us */}
            <a
              href="tel:+923096794698"
              onClick={() => trackEvent('call_click', { course: course.slug })}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4 text-[#D9B44A]" />
              <span>Call Us</span>
            </a>

            {/* SMS */}
            <a
              href="sms:+923096794698"
              onClick={() => trackEvent('sms_click', { course: course.slug })}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#D9B44A]" />
              <span>SMS Message</span>
            </a>

            {/* Email Us */}
            <a
              href={`mailto:tuhfatalilmacademy@gmail.com?subject=${encodeURIComponent(`Inquiry for ${course.name}`)}`}
              onClick={() => trackEvent('email_click', { course: course.slug })}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4 text-[#D9B44A]" />
              <span>Email Us</span>
            </a>
          </div>
        </section>
      </ScrollReveal>

      {/* 10. RELATED COURSES: "Explore Other Courses" (3-4 related course cards) */}
      <section className="space-y-6 pt-4">
        <ScrollReveal direction="fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                Continue Learning
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
                Explore Other Courses
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:underline cursor-pointer"
            >
              <span>View All Courses Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
          {relatedCourses.map((relCourse, idx) => (
            <ScrollReveal key={relCourse.id} direction="fade-up" delay={idx * 100}>
              <CourseCard
                course={relCourse}
                onNavigate={onNavigate}
                priority={false}
                index={idx}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

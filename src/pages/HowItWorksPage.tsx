import React, { useState } from 'react';
import { PageId } from '../types';
import { trackEvent } from '../utils/analytics';
import { ScrollReveal } from '../components/ScrollReveal';
import { Card3D } from '../components/Card3D';
import {
  Compass,
  Calendar,
  Video,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Baby,
  Users,
  HeartHandshake
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate?: (page: PageId, courseSlugOrName?: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [learnerTab, setLearnerTab] = useState<'children' | 'adults' | 'sisters'>('children');

  const STEPS = [
    {
      step: '01',
      title: 'Explore Courses & Submit Inquiry',
      subtitle: 'Find the right program and share your schedule goals',
      description:
        'Browse our curriculum of 9 specialized Quranic and Islamic programs for children and adults. Fill out our simple trial booking form or message our academic coordinator instantly on WhatsApp to discuss your goals.',
      icon: Compass,
      badge: 'Step 1 of 4',
      actionLabel: 'Browse All Courses',
      actionTarget: 'courses' as PageId,
      actionHighlight: false,
      highlights: [
        'No commitment or upfront fees',
        'Tailored recommendations for children & adults',
        'Female instructor preference available'
      ]
    },
    {
      step: '02',
      title: 'Free 1-on-1 Trial Session',
      subtitle: 'Experience our gentle, patient teaching methodology',
      description:
        'We arrange a complimentary 1-on-1 trial class via Zoom or Google Meet. You or your child meet a qualified Qari or Islamic scholar, test your audio/video setup, and evaluate current recitation or Qaida level.',
      icon: Video,
      badge: 'Step 2 of 4',
      actionLabel: 'Book a Free Trial',
      actionTarget: 'contact' as PageId,
      actionHighlight: true,
      highlights: [
        '100% free with zero obligation',
        'Friendly, patient, and encouraging instructors',
        'Audio & video quality check'
      ]
    },
    {
      step: '03',
      title: 'Schedule Selection & Teacher Matching',
      subtitle: 'Set a routine that fits your family lifestyle',
      description:
        'Choose your preferred weekly days and time slots across global time zones (USA, UK, Canada, Europe, Middle East, Australia). We finalize your regular schedule and assign your dedicated permanent teacher.',
      icon: Calendar,
      badge: 'Step 3 of 4',
      actionLabel: 'Choose Your Schedule',
      actionTarget: 'contact' as PageId,
      actionHighlight: false,
      highlights: [
        'Flexible schedules around school and work',
        'Dedicated permanent instructor',
        'Easy rescheduling when life changes'
      ]
    },
    {
      step: '04',
      title: 'Interactive 1-on-1 Classes & Progress',
      subtitle: 'Consistent learning with digital screen sharing',
      description:
        'Attend your scheduled online sessions from the comfort of home. Teachers share clear digital Quranic text, Tajweed rules, and structured notes on screen, providing undivided attention and constructive feedback every class.',
      icon: BookOpen,
      badge: 'Step 4 of 4',
      actionLabel: 'Enroll Now',
      actionTarget: 'contact' as PageId,
      actionHighlight: true,
      highlights: [
        'Undivided 1-on-1 student focus',
        'Structured progress tracking and recitation reviews',
        'Supportive environment for young learners and adults'
      ]
    }
  ];

  const LEARNER_CONTENT = {
    children: {
      title: 'For Children (Ages 4–12)',
      subtitle: 'Playful, patient, and engaging foundation building',
      description: 'Children learn best through positive reinforcement and patience. Our teachers use gentle encouragement, interactive digital QA, and proven Noorani Qaida methods to make Quran learning a joyful daily habit without pressure.',
      points: [
        'Interactive Qaida & Arabic letter recognition',
        'Gamified praise & gentle pronunciation correction',
        'Short 30-minute sessions suited for young attention spans',
        'Daily progress updates for parents'
      ],
      icon: Baby
    },
    adults: {
      title: 'For Adult Learners',
      subtitle: 'Flexible timing & respectful, confidential guidance',
      description: 'Whether you are starting from scratch as a beginner or perfecting your Tajweed and memorization (Hifz) as an adult, our expert scholars provide respectful, customized lessons tailored to your busy work schedule.',
      points: [
        'Late night & early morning slots across all time zones',
        'Judgment-free, patient correction for beginners',
        'Advanced Tajweed rules and Quran translation & tafseer',
        'Direct connection with senior Qaris'
      ],
      icon: User
    },
    sisters: {
      title: 'For Sisters & Young Girls',
      subtitle: 'Qualified female Qari’ahs and comfortable learning',
      description: 'We maintain strict privacy and comfort by offering dedicated certified female teachers (Qari’ahs and Alimah scholars) for sisters and young daughters in a secure online environment.',
      points: [
        '100% verified female faculty for sisters',
        'Comfortable, private online environment',
        'Flexible scheduling around household and work routine',
        'Comprehensive Hifz, Tajweed, and Islamic studies'
      ],
      icon: Users
    }
  };

  const FAQS = [
    {
      q: 'What software or equipment is required for online classes?',
      a: 'All you need is a smartphone, tablet, laptop, or computer with a working microphone, speakers, and a stable internet connection. We conduct classes via Zoom, Google Meet, or WhatsApp video according to your preference.'
    },
    {
      q: 'Can we request a female teacher for sisters or young children?',
      a: 'Yes, absolutely. We have certified female Qari’ahs and Islamic scholars available for sisters and young learners upon request.'
    },
    {
      q: 'How are class timings accommodated for international time zones?',
      a: 'Our academy operates 24/7 across flexible global shifts. Whether you reside in New York, London, Toronto, Sydney, or Dubai, we match your lessons around your school, work, or family routine.'
    },
    {
      q: 'What happens if we need to reschedule a class?',
      a: 'We understand family commitments and work changes. You can easily coordinate with your teacher or our coordinator to reschedule sessions with advance notice.'
    },
    {
      q: 'Is there any commitment or fee for the trial class?',
      a: 'No. Our trial class is 100% free with zero upfront fees or hidden commitments. You only enroll if you are completely satisfied with the teacher and teaching method.'
    }
  ];

  return (
    <div className="py-10 sm:py-16 lg:py-20 space-y-20 lg:space-y-28">
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#064E3B]">
              <span>Simple 4-Step Learning Path</span>
              <span aria-hidden="true" className="text-[#D9B44A]">·</span>
              <span>Available Worldwide 24/7</span>
              <span aria-hidden="true" className="text-[#D9B44A]">·</span>
              <span>1-on-1 Dedicated Classes</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] [text-wrap:balance]">
              How Online Learning Works at Tuhfat Al-Ilm
            </h1>

            <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl mx-auto font-normal">
              We have designed a seamless, transparent, and supportive online learning journey for students of all ages—from absolute beginners starting Noorani Qaida to advanced Hifz students.
            </p>

            {/* Quick Hero Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  trackEvent('how_it_works_hero_trial_click');
                  if (onNavigate) onNavigate('contact');
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold text-white bg-[#064E3B] hover:bg-[#043D2E] active:bg-[#032A20] shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span>Book a Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  trackEvent('how_it_works_hero_enroll_click');
                  if (onNavigate) onNavigate('contact');
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold text-[#064E3B] bg-white hover:bg-[#FAF9F5] active:bg-[#F1F5F9] border border-[#CBD5E1] shadow-2xs transition-all cursor-pointer"
              >
                <span>Enroll Now</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  trackEvent('how_it_works_hero_courses_click');
                  if (onNavigate) onNavigate('courses');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 min-h-[46px] rounded-xl text-xs font-semibold text-[#475569] hover:text-[#064E3B] hover:bg-white/60 transition-colors cursor-pointer"
              >
                <span>Explore All 9 Courses &rarr;</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. LEARNER TYPE TABS (Interactive Customization) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                Tailored Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Who Are You Learning For?
              </h2>
              <p className="text-sm text-[#475569]">
                Select your learner category to see how our lessons are customized to your exact requirements.
              </p>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9]">
              {(['children', 'adults', 'sisters'] as const).map((tabKey) => {
                const item = LEARNER_CONTENT[tabKey];
                const TabIcon = item.icon;
                const isActive = learnerTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    type="button"
                    onClick={() => {
                      setLearnerTab(tabKey);
                      trackEvent('how_it_works_tab_click', { tab: tabKey });
                    }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#064E3B] text-white shadow-md'
                        : 'text-[#4B5563] hover:text-[#064E3B] hover:bg-white/80'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content Panel */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#059669] px-3 py-1 bg-[#ECFDF5] rounded-full border border-[#A7F3D0]">
                  <span>{LEARNER_CONTENT[learnerTab].subtitle}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {LEARNER_CONTENT[learnerTab].title}
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {LEARNER_CONTENT[learnerTab].description}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {LEARNER_CONTENT[learnerTab].points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#1E293B]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center shadow-2xs">
                  {learnerTab === 'children' && <Baby className="w-7 h-7 text-[#059669]" />}
                  {learnerTab === 'adults' && <User className="w-7 h-7 text-[#059669]" />}
                  {learnerTab === 'sisters' && <Users className="w-7 h-7 text-[#059669]" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">Ready to Get Started?</h4>
                  <p className="text-xs text-[#64748B] mt-1">Book your free trial class today with zero commitment.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('how_it_works_trial_click', { category: learnerTab });
                      if (onNavigate) onNavigate('contact');
                    }}
                    className="flex-1 py-3 px-4 bg-[#064E3B] hover:bg-[#043D2E] active:bg-[#032A20] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Book Free Trial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('how_it_works_enroll_click', { category: learnerTab });
                      if (onNavigate) onNavigate('contact');
                    }}
                    className="flex-1 py-3 px-4 bg-white hover:bg-[#FAF9F5] active:bg-[#F1F5F9] text-[#064E3B] border border-[#CBD5E1] rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Enroll Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. THE 4-STEP ROADMAP (Interactive Timeline Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
            Step-by-Step Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Your Journey in 4 Simple Steps
          </h2>
          <p className="text-sm text-[#475569]">
            From your initial inquiry to your first live online class in under 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <ScrollReveal key={idx} direction="fade-up" delay={idx * 80}>
                <Card3D tiltOptions={{ maxTilt: 5, scale: 1.015 }} className="h-full">
                  <div className="h-full bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-[#D9B44A]/40 transition-all flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs [transform:translateZ(10px)]">
                          <Icon className="w-6 h-6 text-[#059669]" />
                        </div>
                        <span className="text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#FAF9F5] text-[#064E3B] border border-[#E5E2D9]">
                          {s.step}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                          {s.badge}
                        </span>
                        <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#064E3B] transition-colors">
                          {s.title}
                        </h3>
                        <p className="text-xs font-medium text-[#475569]">
                          {s.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {s.description}
                      </p>

                      <ul className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                        {s.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-[#334155]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 mt-5 border-t border-[#F1F5F9] [transform:translateZ(12px)]">
                      <button
                        type="button"
                        onClick={() => {
                          trackEvent('how_it_works_step_action', { step: s.step, label: s.actionLabel });
                          if (onNavigate) onNavigate(s.actionTarget);
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          s.actionHighlight
                            ? 'bg-[#064E3B] hover:bg-[#043D2E] active:bg-[#032A20] text-white shadow-xs'
                            : 'bg-[#FAF9F5] hover:bg-[#ECFDF5] text-[#064E3B] border border-[#E5E2D9] hover:border-[#A7F3D0]'
                        }`}
                      >
                        <span>{s.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 4. COMPARISON: TRADITIONAL VS TUHFAT ONLINE ACADEMY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                The Tuhfat Al-Ilm Online Advantage
              </h2>
              <p className="text-sm text-[#475569]">
                Designed specifically for busy families and individuals seeking authentic, structured Islamic education without geographical limitations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traditional Learning */}
              <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-4">
                <div className="flex items-center gap-2.5 font-bold text-sm text-[#64748B]">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span>Traditional / Local Classes</span>
                </div>
                <ul className="space-y-3 text-xs text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Rigid local travel and fixed physical schedules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Crowded classrooms with limited individual attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Difficult to find qualified Qaris or female teachers locally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Hard to reschedule around school exams or work travel</span>
                  </li>
                </ul>
              </div>

              {/* Tuhfat Al-Ilm Online */}
              <div className="p-6 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-4 shadow-2xs">
                <div className="flex items-center gap-2.5 font-bold text-sm text-[#064E3B]">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span>Tuhfat Al-Ilm Academy Online</span>
                </div>
                <ul className="space-y-3 text-xs text-[#064E3B]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Learn from home with 100% flexible scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Dedicated 1-on-1 attention focused entirely on the student</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Certified Huffaz, Qaris, and female instructors available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Easy class adjustments and progress reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1.5 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#475569] mt-1.5">
              Everything you need to know about starting your online classes with us.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <ScrollReveal key={idx} direction="fade-up" delay={idx * 50}>
                <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 min-h-[52px] flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F172A] hover:bg-[#FAF9F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`how-faq-${idx}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#064E3B] shrink-0" aria-hidden="true" />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#064E3B] shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#94A3B8] shrink-0" aria-hidden="true" />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      id={`how-faq-${idx}`}
                      className="p-5 pt-0 text-sm text-[#475569] leading-relaxed bg-[#FAF9F5]/40 border-t border-[#E2E8F0]/60"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="bg-gradient-to-br from-[#064E3B] via-[#043D2E] to-[#022C22] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent_50%)] pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#34D399] bg-white/10 px-3 py-1 rounded-full inline-block">
                Start Your Journey Today
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Ready to Experience a Free Trial Class?
              </h2>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                Take the first step toward structured Quranic recitation and Islamic understanding for yourself or your children.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 relative z-10">
              <button
                type="button"
                onClick={() => {
                  trackEvent('how_it_works_cta_click', { action: 'book_trial' });
                  if (onNavigate) onNavigate('contact');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[48px] text-sm font-semibold text-[#064E3B] bg-white hover:bg-[#F0FDF4] active:bg-[#DCFCE7] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Book Free Trial Class</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  trackEvent('how_it_works_cta_click', { action: 'enroll_now' });
                  if (onNavigate) onNavigate('contact');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/35 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Enroll Now</span>
              </button>

              <a
                href="https://wa.me/923171503094?text=Assalamu%20Alaikum%2C%20I%20visited%20the%20How%20It%20Works%20page%20and%20would%20like%20to%20discuss%20trial%20classes."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { page: '/how-it-works' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] active:bg-[#046C4E] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

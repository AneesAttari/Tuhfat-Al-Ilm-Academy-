import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { COURSES } from '../data/courses';
import { trackEvent } from '../utils/analytics';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe2,
  HelpCircle,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Video,
  Lock,
  Compass
} from 'lucide-react';

interface ContactPageProps {
  initialCourse?: string;
  onNavigate?: (page: PageId, courseSlugOrName?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialCourse = '',
  onNavigate
}) => {
  const [formMode, setFormMode] = useState<'trial' | 'general'>('trial');
  const [name, setName] = useState('');
  const [parentName, setParentName] = useState('');
  const [ageGroup, setAgeGroup] = useState<'child' | 'teen' | 'adult'>('child');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState(initialCourse || 'Quran Reading / Nazra');
  const [teacherPreference, setTeacherPreference] = useState('no-preference');
  const [preferredDays, setPreferredDays] = useState('flexible');
  const [preferredTime, setPreferredTime] = useState('Flexible');
  const [preferredDate, setPreferredDate] = useState('');
  const [timezone, setTimezone] = useState('');
  const [country, setCountry] = useState('');
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<{
    id: string;
    name: string;
    course: string;
    phone: string;
    teacherPref: string;
    preferredTime: string;
  } | null>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync initialCourse prop if it changes
  useEffect(() => {
    if (initialCourse) {
      setCourse(initialCourse);
    }
  }, [initialCourse]);

  // Detect local timezone for convenient scheduling
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setTimezone(tz);
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim() || !phone.trim()) {
      setSubmitError('Please provide both the student name and WhatsApp/Phone number.');
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      parent_name: parentName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      course: course.trim(),
      preferred_date: preferredDate.trim(),
      preferred_time: `${preferredTime} (${preferredDays}, Age: ${ageGroup}, Teacher: ${teacherPreference}, Level: ${currentLevel})`,
      timezone: timezone.trim(),
      country: country.trim(),
      message: message.trim(),
      source: formMode === 'trial' ? 'Contact Page - Free Trial Booking' : 'Contact Page - Academic Inquiry'
    };

    try {
      const endpoint = formMode === 'trial' ? '/api/trial-bookings' : '/api/inquiries';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again or message us on WhatsApp.');
      }

      trackEvent('inquiry_submitted', {
        course: payload.course,
        mode: formMode
      });

      setSubmittedBooking({
        id: data.bookingId || data.booking?.id || 'TAB-' + Math.floor(100000 + Math.random() * 900000),
        name: payload.name,
        course: payload.course,
        phone: payload.phone,
        teacherPref: teacherPreference === 'female' ? 'Female Instructor' : teacherPreference === 'male' ? 'Male Instructor' : 'No Preference',
        preferredTime: `${preferredTime} · ${preferredDays}`
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Network error occurred. You can also message us directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedBooking(null);
    setName('');
    setParentName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setPreferredDate('');
  };

  const ENROLLMENT_FAQS = [
    {
      q: 'How does the introductory free trial class work?',
      a: 'The trial class is a complimentary 1-on-1 session conducted via Zoom or Google Meet. You or your child meet a qualified instructor, test your audio and screen sharing, evaluate current recitation level, and experience our gentle, patient teaching methodology with zero commitment or payment required.'
    },
    {
      q: 'Are female instructors available for sisters and young children?',
      a: 'Yes, certified female teachers are available for sisters and young children upon request. You can select this preference directly in the booking form or mention it in your WhatsApp consultation.'
    },
    {
      q: 'How do class timings work for international time zones?',
      a: 'Because our academy operates round-the-clock across international shifts, we accommodate students in the USA, Canada, UK, Europe, Australia, the Gulf, and worldwide. Classes are scheduled to match your school, work, or family routine.'
    },
    {
      q: 'What equipment or software is needed to start learning online?',
      a: 'All you need is a smartphone, tablet, laptop, or computer with a working microphone, speakers, and a stable internet connection. Our teachers share clear digital copies of the Qaida, Quran, or Islamic curriculum on screen during the class.'
    },
    {
      q: 'Can parents sit in during their children’s lessons?',
      a: 'Yes, absolutely. We encourage parents to observe the initial classes so they can see how our instructors engage with young learners, witness the lesson pacing, and discuss weekly progress goals directly.'
    }
  ];

  return (
    <div className="py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16">
      {/* 1. HERO HEADER: Institutional, Trustworthy & Dignified */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {/* Unboxed Eyebrow Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] py-1 px-3.5 bg-white/90 rounded-full border border-[#E5E2D9] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" aria-hidden="true" />
              <span>Official Admissions &amp; Academic Inquiries</span>
              <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
              <span>Online Worldwide</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] [text-wrap:balance]">
              Connect with Tuhfat Al-Ilm Academy
            </h1>

            <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl mx-auto font-normal">
              Arrange your complimentary 1-on-1 trial class, speak directly with our academic coordinators, or seek guidance on course selection for yourself or your children.
            </p>

            {/* Quick Reassurance Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-[#475569]">
              <span className="inline-flex items-center gap-1.5 text-[#064E3B]">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Complimentary Trial Class</span>
              </span>
              <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
              <span className="inline-flex items-center gap-1.5 text-[#064E3B]">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Female Teachers Available</span>
              </span>
              <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
              <span className="inline-flex items-center gap-1.5 text-[#064E3B]">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Custom Global Timings</span>
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. DIRECT ADMISSIONS CHANNELS: 4 PROMINENT TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: WhatsApp Admissions (Fastest Channel) */}
          <ScrollReveal direction="fade-up" delay={0}>
            <a
              href="https://wa.me/923171503094?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20inquire%20about%20online%20classes%20at%20Tuhfat%20Al-Ilm%20Academy."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { page: '/contact' })}
              className="group h-full bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#A7F3D0] hover:border-[#059669] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#064E3B] text-white">
                    Fastest
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">WhatsApp Admissions</h2>
                  <p className="text-xs text-[#059669] font-semibold mt-0.5">Replies in &lt; 15 mins</p>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Chat directly with our academic coordinator to arrange class schedules or ask questions.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#064E3B]">
                <span className="font-mono text-sm">+92 317 1503094</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </ScrollReveal>

          {/* Card 2: Voice Call Support */}
          <ScrollReveal direction="fade-up" delay={50}>
            <a
              href="tel:+923096794698"
              onClick={() => trackEvent('phone_call_click', { page: '/contact' })}
              className="group h-full bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Telephone Inquiries</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Direct Voice Line</p>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Speak directly with our administration team regarding course details and recommendations.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#1E40AF]">
                <span className="font-mono text-sm">+92 309 6794698</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </ScrollReveal>

          {/* Card 3: Email Admissions */}
          <ScrollReveal direction="fade-up" delay={100}>
            <a
              href="mailto:tuhfatalilmacademy@gmail.com"
              onClick={() => trackEvent('email_click', { page: '/contact' })}
              className="group h-full bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Admissions Email</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Formal Correspondence</p>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  For formal family enrollments, documentation, or institutional partnership requests.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                <span className="truncate max-w-[160px]">tuhfatalilmacademy</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                  <span>Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </ScrollReveal>

          {/* Card 4: Global Time Zone Support */}
          <ScrollReveal direction="fade-up" delay={150}>
            <div className="h-full bg-gradient-to-br from-[#FAF9F5] to-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Global Time Zones</h2>
                  <p className="text-xs text-[#064E3B] font-semibold mt-0.5">Flexible Shifts</p>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Serving students across North America, UK, Europe, Australia, the Middle East, and Asia.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F1F5F9] text-xs font-semibold text-[#064E3B] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                <span>Active Global Class Shifts</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. INTERACTIVE BOOKING / INQUIRY FORM WITH REASSURANCE SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-8">
            <ScrollReveal direction="fade-up">
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                {/* Header Switcher */}
                <div className="p-5 sm:p-7 bg-[#FAF9F5] border-b border-[#E5E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                      {formMode === 'trial' ? 'Book a Free 1-on-1 Trial Class' : 'Submit an Academic Inquiry'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#475569] mt-1">
                      {formMode === 'trial'
                        ? 'Zero obligation. Experience our teaching before committing.'
                        : 'Ask questions about our syllabus, scheduling, or fee structure.'}
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex items-center p-1 bg-white rounded-xl border border-[#E5E2D9] self-start sm:self-auto shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setFormMode('trial')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        formMode === 'trial'
                          ? 'bg-[#064E3B] text-white shadow-xs'
                          : 'text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      Free Trial Class
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode('general')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        formMode === 'general'
                          ? 'bg-[#064E3B] text-white shadow-xs'
                          : 'text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      General Inquiry
                    </button>
                  </div>
                </div>

                {/* Form Content / Success Confirmation */}
                <div className="p-6 sm:p-8">
                  {submittedBooking ? (
                    /* Success Confirmation State */
                    <div className="py-8 text-center space-y-6 animate-in fade-in duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-[#0F172A]">
                          Inquiry Received Successfully!
                        </h3>
                        <p className="text-sm text-[#475569]">
                          JazakAllah Khair, <strong className="text-[#0F172A]">{submittedBooking.name}</strong>. Your request for <strong className="text-[#064E3B]">{submittedBooking.course}</strong> has been logged in our academic system.
                        </p>
                      </div>

                      {/* Reference Voucher */}
                      <div className="inline-block p-5 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9] text-xs space-y-2 text-left max-w-sm w-full">
                        <div className="flex justify-between items-center pb-2 border-b border-[#E5E2D9]">
                          <span className="text-[#64748B]">Reference ID:</span>
                          <span className="font-mono text-base font-bold text-[#064E3B]">{submittedBooking.id}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-[#475569]">
                          <span>Teacher Preference:</span>
                          <span className="font-semibold text-[#0F172A]">{submittedBooking.teacherPref}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-[#475569]">
                          <span>Requested Timings:</span>
                          <span className="font-semibold text-[#0F172A]">{submittedBooking.preferredTime}</span>
                        </div>
                        <p className="text-[11px] text-[#059669] pt-1">
                          ✓ Our coordinator will message you on WhatsApp to confirm the exact trial time.
                        </p>
                      </div>

                      {/* WhatsApp shortcut to speed up confirmation */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={`https://wa.me/923171503094?text=${encodeURIComponent(`Assalamu Alaikum, I just submitted an inquiry (Ref: ${submittedBooking.id}) for "${submittedBooking.course}". My name is ${submittedBooking.name}. Please confirm trial class schedule options.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] rounded-xl text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Speed Up on WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleResetForm}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#FAF9F5] border border-[#E2E8F0] transition-colors cursor-pointer"
                        >
                          <span>Submit Another Inquiry</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Actual Working Interactive Form */
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {submitError && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                          <span className="font-bold">Error:</span>
                          <span>{submitError}</span>
                        </div>
                      )}

                      {/* Section 1: Student Information */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                          <span className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-xs font-bold">
                            1
                          </span>
                          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                            Student &amp; Contact Details
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          {/* Student Full Name */}
                          <div>
                            <label htmlFor="student-name" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Student Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="student-name"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Abdullah Khan"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white"
                            />
                          </div>

                          {/* Student Age Category */}
                          <div>
                            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Student Age Category
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {(['child', 'teen', 'adult'] as const).map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setAgeGroup(cat)}
                                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center capitalize ${
                                    ageGroup === cat
                                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-2xs'
                                      : 'bg-white text-[#475569] border-[#CBD5E1] hover:border-[#94A3B8]'
                                  }`}
                                >
                                  {cat === 'child' ? 'Child (4-12)' : cat === 'teen' ? 'Teen (13-17)' : 'Adult (18+)'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Parent / Guardian Name (if under 18) */}
                          <div>
                            <label htmlFor="parent-name" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Parent / Guardian Name <span className="text-[#94A3B8] font-normal">(for students under 18)</span>
                            </label>
                            <input
                              type="text"
                              id="parent-name"
                              value={parentName}
                              onChange={(e) => setParentName(e.target.value)}
                              placeholder="e.g. Muhammad Khan"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white"
                            />
                          </div>

                          {/* WhatsApp / Phone Number */}
                          <div>
                            <label htmlFor="phone" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              WhatsApp / Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="e.g. +44 7123 456789 or +1 234 567 8900"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white font-mono"
                            />
                          </div>

                          {/* Email Address */}
                          <div>
                            <label htmlFor="email" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Email Address <span className="text-[#94A3B8] font-normal">(for class invitations)</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white"
                            />
                          </div>

                          {/* Country / City */}
                          <div>
                            <label htmlFor="country" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Country &amp; City
                            </label>
                            <input
                              type="text"
                              id="country"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              placeholder="e.g. London UK, Dallas USA, Dubai UAE"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Course & Academic Preferences */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                          <span className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-xs font-bold">
                            2
                          </span>
                          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                            Course &amp; Learning Preferences
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          {/* Course Selection */}
                          <div>
                            <label htmlFor="course" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Program of Interest <span className="text-rose-500">*</span>
                            </label>
                            <select
                              id="course"
                              value={course}
                              onChange={(e) => setCourse(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white cursor-pointer"
                            >
                              <optgroup label="Quranic Recitation & Memorization">
                                <option value="Quran Reading / Nazra">Quran Reading / Nazra (with Tajweed)</option>
                                <option value="Hifz-ul-Quran">Hifz-ul-Quran (Memorization Program)</option>
                                <option value="Tajweed-ul-Quran">Tajweed-ul-Quran (Rules & Phonetics)</option>
                                <option value="Quran Translation & Tafseer">Quran Translation &amp; Tafseer</option>
                              </optgroup>
                              <optgroup label="Islamic Studies & Character Development">
                                <option value="Children’s Islamic Education">Children’s Islamic Education</option>
                                <option value="Basic Islamic Knowledge">Basic Islamic Knowledge (Farz Uloom)</option>
                                <option value="Islamic Studies">Comprehensive Islamic Studies</option>
                                <option value="Dua and Sunnah Course">Dua &amp; Daily Sunnah Course</option>
                                <option value="Islah & Character Development">Islah &amp; Character Development</option>
                              </optgroup>
                              <option value="General Academic Consultation">Not Sure Yet · General Guidance</option>
                            </select>
                          </div>

                          {/* Teacher Gender Preference */}
                          <div>
                            <label htmlFor="teacher-pref" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Teacher Preference
                            </label>
                            <select
                              id="teacher-pref"
                              value={teacherPreference}
                              onChange={(e) => setTeacherPreference(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white cursor-pointer"
                            >
                              <option value="no-preference">No Preference (First Available)</option>
                              <option value="female">Female Instructor (For sisters & young children)</option>
                              <option value="male">Male Instructor</option>
                            </select>
                          </div>

                          {/* Preferred Class Days */}
                          <div>
                            <label htmlFor="days-pref" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Preferred Schedule Days
                            </label>
                            <select
                              id="days-pref"
                              value={preferredDays}
                              onChange={(e) => setPreferredDays(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white cursor-pointer"
                            >
                              <option value="flexible">Flexible / Any Days</option>
                              <option value="weekdays">Weekdays (Monday to Friday)</option>
                              <option value="weekends">Weekends Only (Saturday & Sunday)</option>
                              <option value="3-days">3 Days a Week (Mon / Wed / Fri)</option>
                              <option value="2-days">2 Days a Week (Tue / Thu)</option>
                            </select>
                          </div>

                          {/* Preferred Time of Day */}
                          <div>
                            <label htmlFor="timing" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Preferred Time of Day
                            </label>
                            <select
                              id="timing"
                              value={preferredTime}
                              onChange={(e) => setPreferredTime(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white cursor-pointer"
                            >
                              <option value="Flexible">Flexible / Any Time</option>
                              <option value="Morning (7:00 AM - 12:00 PM)">Morning (7:00 AM - 12:00 PM)</option>
                              <option value="Afternoon (12:00 PM - 5:00 PM)">Afternoon (12:00 PM - 5:00 PM)</option>
                              <option value="Evening (5:00 PM - 10:00 PM)">Evening (5:00 PM - 10:00 PM)</option>
                              <option value="Night (10:00 PM - Midnight)">Late Evening / Night</option>
                            </select>
                          </div>

                          {/* Current Reading Level */}
                          <div>
                            <label htmlFor="reading-level" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Student's Current Level
                            </label>
                            <select
                              id="reading-level"
                              value={currentLevel}
                              onChange={(e) => setCurrentLevel(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white cursor-pointer"
                            >
                              <option value="beginner">Complete Beginner (Starting Noorani Qaida)</option>
                              <option value="slow-reader">Can identify Arabic letters / Reads slowly</option>
                              <option value="intermediate">Can read Quran (needs Tajweed & fluency)</option>
                              <option value="advanced">Fluent reader (ready for Hifz or Tafseer)</option>
                            </select>
                          </div>

                          {/* Detected Timezone */}
                          <div>
                            <label htmlFor="timezone" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                              Detected Timezone
                            </label>
                            <input
                              type="text"
                              id="timezone"
                              value={timezone}
                              onChange={(e) => setTimezone(e.target.value)}
                              placeholder="e.g. Europe/London or America/New_York"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Notes / Special Requests */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                          <span className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-xs font-bold">
                            3
                          </span>
                          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                            Special Goals or Notes
                          </h3>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                            Additional Details <span className="text-[#94A3B8] font-normal">(optional)</span>
                          </label>
                          <textarea
                            id="message"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="e.g. Would like lessons in Urdu/English, child is 7 years old, prefers quiet evening slots..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 text-sm outline-none transition-all bg-white resize-y"
                          />
                        </div>
                      </div>

                      {/* Submit CTA and Guarantee Bar */}
                      <div className="pt-2 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 min-h-[50px] text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] active:bg-[#022C22] disabled:opacity-60 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-2"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Submitting Inquiry...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>
                                {formMode === 'trial' ? 'Request Free Trial Class' : 'Submit Academic Inquiry'}
                              </span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <Lock className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Strict privacy · No payment details required</span>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Reassurance & Next Steps Sidebar (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Box 1: What Happens Next */}
            <ScrollReveal direction="fade-left" delay={50}>
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#064E3B] font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#059669]" />
                  <span>What Happens After You Submit?</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#A7F3D0]">
                      1
                    </span>
                    <div>
                      <strong className="text-[#0F172A] block font-semibold">Teacher Matching</strong>
                      <span className="text-[#64748B]">Our coordinator reviews your preferences and pairs you with a certified instructor.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#A7F3D0]">
                      2
                    </span>
                    <div>
                      <strong className="text-[#0F172A] block font-semibold">WhatsApp Confirmation</strong>
                      <span className="text-[#64748B]">We message you on WhatsApp to agree on the exact date and hour in your local timezone.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#A7F3D0]">
                      3
                    </span>
                    <div>
                      <strong className="text-[#0F172A] block font-semibold">1-on-1 Trial Class</strong>
                      <span className="text-[#64748B]">Join your class link on Zoom/Meet. Receive an initial level assessment with zero obligation.</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Box 2: Quick WhatsApp Support Card */}
            <ScrollReveal direction="fade-left" delay={100}>
              <div className="bg-gradient-to-br from-[#064E3B] to-[#043D2E] text-white p-6 rounded-3xl shadow-sm space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#34D399] bg-white/10 px-2 py-0.5 rounded-full inline-block">
                  Need Quick Assistance?
                </span>
                <h4 className="text-base font-bold">Have Questions Right Now?</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Skip the form and chat with an admissions coordinator directly on WhatsApp.
                </p>
                <a
                  href="https://wa.me/923171503094?text=Assalamu%20Alaikum%2C%20I%20have%20a%20few%20questions%20about%20classes%20at%20Tuhfat%20Al-Ilm%20Academy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#064E3B] hover:bg-[#F0FDF4] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs mt-1"
                >
                  <MessageCircle className="w-4 h-4 text-[#059669]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Box 3: Child Safety & Verified Credentials */}
            <ScrollReveal direction="fade-left" delay={150}>
              <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-[#E5E2D9] space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#064E3B] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>Student Safety &amp; Trust Guarantee</span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Every teacher is thoroughly vetted with verified credentials from recognized Islamic institutions. Parents are always welcome to observe classes.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. INSTITUTIONAL ASSURANCE: 4 PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">1-on-1 Individual Attention</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Dedicated session time focused 100% on individual pronunciation, Makharij vocal practice, and personalized feedback.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Flexible Rescheduling</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Adjust class times easily around exams, family commitments, vacations, or sudden work routine changes.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Male &amp; Female Faculty</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Certified female teachers available for sisters and young children to ensure a comfortable and focused environment.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Worldwide Students</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Trusted by Muslim families across the UK, USA, Canada, Europe, Middle East, Australia, and worldwide.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. ENROLLMENT & TRIAL FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
              Before You Begin
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1.5 tracking-tight">
              Admissions &amp; Trial FAQ
            </h2>
            <p className="text-sm text-[#475569] mt-1.5">
              Clear answers to the most common questions prospective students and parents ask before starting.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {ENROLLMENT_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <ScrollReveal key={idx} direction="fade-up" delay={idx * 50}>
                <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 min-h-[52px] flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F172A] hover:bg-[#FAF9F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`enroll-faq-${idx}`}
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
                      id={`enroll-faq-${idx}`}
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
    </div>
  );
};

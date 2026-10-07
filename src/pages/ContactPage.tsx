import React, { useState, useEffect, useId } from 'react';
import { MessageCircle, Phone, Mail, CheckCircle2, Clock, Globe2, MessageSquare, AlertCircle, Calendar, Send, Sparkles, User, ArrowRight } from 'lucide-react';
import { Course } from '../types';
import { COURSES as DEFAULT_COURSES } from '../data/courses';
import { trackEvent } from '../utils/analytics';
import { ScrollReveal } from '../components/ScrollReveal';

interface ContactPageProps {
  initialCourse?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialCourse }) => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    phone: '',
    email: '',
    course: initialCourse || 'Quran Reading / Nazra',
    preferredDate: '',
    preferredTime: 'Evening (5:00 PM - 9:00 PM)',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    country: '',
    message: ''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<{
    bookingId: string;
    name: string;
    course: string;
    email: string;
    phone: string;
  } | null>(null);

  const nameId = useId();
  const parentNameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const courseId = useId();
  const dateId = useId();
  const timeId = useId();
  const messageId = useId();

  // Dynamically load live published courses from database
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

  // Update selected course if initialCourse prop changes
  useEffect(() => {
    if (initialCourse) {
      setFormData((prev) => ({ ...prev, course: initialCourse }));
    }
  }, [initialCourse]);

  // Primary Submission Flow: Save to DB & Send Email Notification to Academy
  const handleSubmitEmailBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const parentName = formData.parentName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const course = formData.course;
    const preferredDate = formData.preferredDate.trim();
    const preferredTime = formData.preferredTime;
    const timezone = formData.timezone;
    const country = formData.country.trim();
    const message = formData.message.trim();

    if (!name || name.length < 2) {
      setFormError('Please enter the student full name (at least 2 characters).');
      return;
    }

    if (!country) {
      setFormError('Please enter your country/location.');
      return;
    }

    if (!phone || phone.length < 6) {
      setFormError('Please enter your valid phone / WhatsApp number.');
      return;
    }

    if (email && (!email.includes('@') || !email.includes('.'))) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!course) {
      setFormError('Please select a course.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/trial-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          parentName,
          email,
          phone,
          course,
          preferredDate,
          preferredTime,
          timezone,
          country,
          message,
          source: 'Website Trial Booking (Email Primary)'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to submit booking. Please try again or contact via WhatsApp.');
      } else {
        trackEvent('form_submit', { page: '/contact', course, method: 'email_primary' });
        setSubmittedBooking({
          bookingId: data.bookingId || 'TAB-' + Math.floor(100000 + Math.random() * 900000),
          name,
          course,
          email: email || 'Not provided',
          phone
        });
      }
    } catch {
      setFormError('Network connection issue. Please verify your connection or reach us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative Option: Save to DB and open WhatsApp
  const handleSendWhatsApp = async () => {
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim() || 'Not specified';
    const course = formData.course;
    const message = formData.message.trim() || 'I would like to arrange a free trial class.';

    if (!name) {
      setFormError('Please enter the student name before opening WhatsApp.');
      return;
    }

    if (!phone) {
      setFormError('Please enter your contact phone or WhatsApp number.');
      return;
    }

    setFormError(null);

    // Save inquiry to backend database asynchronously
    try {
      await fetch('/api/trial-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          parentName: formData.parentName.trim(),
          email,
          phone,
          course,
          preferredDate: formData.preferredDate.trim(),
          preferredTime: formData.preferredTime,
          timezone: formData.timezone,
          message,
          source: 'WhatsApp Trial Booking'
        })
      });
    } catch {}

    trackEvent('whatsapp_click', { page: '/contact', course });

    const messageTemplate = `Assalamu Alaikum,
I would like to book a Free Trial Class at Tuhfat Al-Ilm Academy.

Student Name: ${name}
${formData.parentName ? `Parent Name: ${formData.parentName}\n` : ''}Phone/WhatsApp: ${phone}
Email: ${email}
Selected Course: ${course}
Preferred Date/Time: ${formData.preferredDate || 'Flexible'} (${formData.preferredTime})
Message / Goals: ${message}

Please confirm our trial lesson schedule.`;

    const encoded = encodeURIComponent(messageTemplate);
    window.location.href = `https://wa.me/923171503094?text=${encoded}`;
  };

  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <ScrollReveal direction="fade-up">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#064E3B] text-xs font-semibold border border-[#A7F3D0] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Admissions Open Across All Timezones</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
            Book a Free Trial Class &amp; Inquire
          </h1>
          <p className="text-base sm:text-lg text-[#475569] mt-3 leading-relaxed">
            Experience our 1-on-1 personalized teaching methodology with zero commitment. Submit your trial booking below or reach out directly.
          </p>
        </div>
      </ScrollReveal>

      {/* Main Grid: Direct Contact Channels & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal direction="fade-right" delay={50}>
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Direct Contact Channels</h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Connect directly with our academic admissions office:
                </p>
              </div>

              {/* Direct Channel Cards with Action Buttons */}
              <div className="space-y-3.5">
                {/* 1. WhatsApp */}
                <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-[#34D399]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider">WhatsApp Admissions</span>
                      <p className="text-base font-bold text-[#0F172A]">+92 317 1503094</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/923171503094"
                    onClick={() => trackEvent('whatsapp_click', { page: '/contact' })}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-xl transition-colors shadow-xs"
                    aria-label="Open WhatsApp with Tuhfat Al-Ilm Academy"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Direct (+92 317 1503094)</span>
                  </a>
                </div>

                {/* 2. Phone Call */}
                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-200 text-[#064E3B] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Voice Helpline</span>
                      <p className="text-base font-bold text-[#0F172A]">+92 309 6794698</p>
                    </div>
                  </div>
                  <a
                    href="tel:+923096794698"
                    onClick={() => trackEvent('call_click', { page: '/contact' })}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#1E2320] bg-white hover:bg-neutral-100 border border-[#CBD5E1] rounded-xl transition-colors shadow-xs"
                    aria-label="Call Tuhfat Al-Ilm Academy on +92 309 6794698"
                  >
                    <Phone className="w-4 h-4 text-[#064E3B]" />
                    <span>Call Academy Directly</span>
                  </a>
                </div>

                {/* 3. Official Email */}
                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-200 text-[#064E3B] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="break-all">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Admissions Email</span>
                      <p className="text-sm font-bold text-[#0F172A]">tuhfatalilmacademy@gmail.com</p>
                    </div>
                  </div>
                  <a
                    href="mailto:tuhfatalilmacademy@gmail.com"
                    onClick={() => trackEvent('email_click', { page: '/contact' })}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#1E2320] bg-white hover:bg-neutral-100 border border-[#CBD5E1] rounded-xl transition-colors shadow-xs"
                    aria-label="Send email to Tuhfat Al-Ilm Academy"
                  >
                    <Mail className="w-4 h-4 text-[#064E3B]" />
                    <span>Send Email Message</span>
                  </a>
                </div>
              </div>

              {/* Quick Information */}
              <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Classes available in UK, USA, Canada, UAE, Europe &amp; Worldwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Flexible 1-on-1 scheduling adapted to your availability</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Trial Booking & Enrollment Form */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="fade-left" delay={80}>
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E2E8F0] shadow-sm">
              {submittedBooking ? (
                /* SUCCESS CONFIRMATION STATE */
                <div className="py-6 space-y-6 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto border-2 border-[#A7F3D0]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2 max-w-lg mx-auto">
                    <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                      Booking Confirmed &amp; Notification Sent
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                      JazakAllahu Khairan, {submittedBooking.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      Your trial class booking for <strong>{submittedBooking.course}</strong> has been received by our academic office.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] text-left text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Booking Reference:</span>
                      <span className="font-mono font-bold text-[#0F172A]">{submittedBooking.bookingId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Student:</span>
                      <span className="font-bold text-[#0F172A]">{submittedBooking.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Selected Program:</span>
                      <span className="font-semibold text-[#064E3B]">{submittedBooking.course}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Contact:</span>
                      <span className="text-[#0F172A]">{submittedBooking.phone}</span>
                    </div>
                  </div>

                  {/* Action Buttons in Confirmation */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/923171503094?text=${encodeURIComponent(`Assalamu Alaikum, I just submitted trial booking ref: ${submittedBooking.bookingId} for ${submittedBooking.name} (${submittedBooking.course}).`)}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] shadow-sm transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Now</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedBooking(null);
                        setFormData({
                          name: '',
                          parentName: '',
                          phone: '',
                          email: '',
                          course: 'Quran Reading / Nazra',
                          preferredDate: '',
                          preferredTime: 'Evening (5:00 PM - 9:00 PM)',
                          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                          country: '',
                          message: ''
                        });
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold text-[#334155] bg-[#F4F1EA] hover:bg-[#E5E2D9] transition-colors cursor-pointer"
                    >
                      <span>Book Another Class</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM VIEW */
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] mb-1">
                      <Send className="w-3.5 h-3.5" />
                      <span>Online Trial &amp; Enrollment Application</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Book Your Free Trial Class</h2>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                      Fill in your details below. Your booking is saved immediately to our admissions database and dispatched directly to the academy owner via email.
                    </p>
                  </div>

                  {formError && (
                    <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitEmailBooking} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Student Name */}
                      <div>
                        <label htmlFor={nameId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Student Full Name *
                        </label>
                        <input
                          type="text"
                          id={nameId}
                          required
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formError) setFormError(null);
                          }}
                          placeholder="e.g., Abdullah / Sister Fatima"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        />
                      </div>

                      {/* Parent / Guardian Name (Optional) */}
                      <div>
                        <label htmlFor={parentNameId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Parent / Guardian Name (Optional)
                        </label>
                        <input
                          type="text"
                          id={parentNameId}
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                          placeholder="For young students / children"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone / WhatsApp */}
                      <div>
                        <label htmlFor={phoneId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          id={phoneId}
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formError) setFormError(null);
                          }}
                          placeholder="e.g., +92 317 1503094"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label htmlFor={emailId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Email Address (For Schedule Confirmation)
                        </label>
                        <input
                          type="email"
                          id={emailId}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="yourname@gmail.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Course Selection */}
                      <div>
                        <label htmlFor={courseId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Course Interested In *
                        </label>
                        <select
                          id={courseId}
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                          <option value="General Inquiry">General Question / Other</option>
                        </select>
                      </div>

                      {/* Preferred Time of Day */}
                      <div>
                        <label htmlFor={timeId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Preferred Class Time
                        </label>
                        <select
                          id={timeId}
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        >
                          <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                          <option value="Afternoon (12:00 PM - 5:00 PM)">Afternoon (12:00 PM - 5:00 PM)</option>
                          <option value="Evening (5:00 PM - 9:00 PM)">Evening (5:00 PM - 9:00 PM)</option>
                          <option value="Night (9:00 PM - 12:00 AM)">Night (9:00 PM - 12:00 AM)</option>
                          <option value="Flexible / Any Time">Flexible / Any Time</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Date, Timezone & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor={dateId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Preferred Date (Optional)
                        </label>
                        <input
                          type="date"
                          id={dateId}
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Country / Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="e.g. UK, USA, Canada, UAE"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Detected Timezone
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formData.timezone}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-neutral-50 text-[#64748B] cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Message / Background */}
                    <div>
                      <label htmlFor={messageId} className="block text-xs font-semibold text-[#374151] mb-1.5">
                        Notes / Current Level / Special Requests (Optional)
                      </label>
                      <textarea
                        id={messageId}
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Share details about the student's age, previous experience, or preferred days..."
                        className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                      />
                    </div>

                    {/* PRIMARY & ALTERNATIVE ACTION BUTTONS */}
                    <div className="pt-2 space-y-3">
                      {/* Primary Option: Submit via Email & Database */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-2 disabled:opacity-60"
                      >
                        <Send className="w-4 h-4 text-emerald-300" />
                        <span>{isSubmitting ? 'Submitting & Notifying Academy...' : 'Book Free Trial (Email Notification to Academy)'}</span>
                      </button>

                      {/* Alternative Option: Send via WhatsApp */}
                      <div className="flex items-center gap-3">
                        <div className="h-px bg-[#E2E8F0] flex-1" />
                        <span className="text-[11px] font-semibold text-[#94A3B8] uppercase">or instantly</span>
                        <div className="h-px bg-[#E2E8F0] flex-1" />
                      </div>

                      <button
                        type="button"
                        onClick={handleSendWhatsApp}
                        className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl text-xs font-bold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      >
                        <MessageCircle className="w-4 h-4 text-[#059669]" />
                        <span>Send Booking via WhatsApp (+92 317 1503094)</span>
                      </button>
                    </div>
                  </form>

                  {/* Information note */}
                  <div className="mt-5 p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs text-[#64748B] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0F172A] block mb-0.5">100% Free Trial with Zero Obligation</strong>
                      <span>Your trial booking is securely registered and our admissions coordinator will confirm your free lesson slot via email &amp; WhatsApp.</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};


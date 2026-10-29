import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { trackEvent } from '../utils/analytics';
import {
  MessageCircle,
  FileCheck2,
  Calendar,
  MonitorCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Volume2,
  Clock,
  ShieldCheck,
  Globe2,
  BookOpen,
  Award,
  Check
} from 'lucide-react';

interface InteractiveHowItWorksProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
}

export const InteractiveHowItWorks: React.FC<InteractiveHowItWorksProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<'child' | 'tajweed' | 'hifz' | 'islamic'>('child');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'tajweed' | 'hifz'>('beginner');
  const [selectedTimezone, setSelectedTimezone] = useState<'UK' | 'USEast' | 'USWest' | 'Gulf' | 'PK' | 'AUS'>('UK');
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | 'evening'>('evening');
  const [activeTajweedRule, setActiveTajweedRule] = useState<'all' | 'qalqalah' | 'ghunnah' | 'madd'>('all');
  const [audioTesting, setAudioTesting] = useState(false);
  const [audioSuccess, setAudioSuccess] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Contact Admissions',
      shortDesc: 'Instant WhatsApp or inquiry form',
      icon: MessageCircle
    },
    {
      num: 2,
      title: 'Goal & Level Review',
      shortDesc: 'Personalized curriculum placement',
      icon: FileCheck2
    },
    {
      num: 3,
      title: 'Schedule Selection',
      shortDesc: 'Worldwide flexible time slots',
      icon: Calendar
    },
    {
      num: 4,
      title: 'Live 1-on-1 Classes',
      shortDesc: 'Direct interactive digital lessons',
      icon: MonitorCheck
    }
  ];

  // Timezone data for interactive world schedule visualizer
  const timezones = {
    UK: { name: 'UK & Europe', city: 'London (GMT)', sampleMorning: '08:00 - 11:00', sampleAfternoon: '14:00 - 17:00', sampleEvening: '18:00 - 21:00' },
    USEast: { name: 'USA & Canada (East)', city: 'New York (EST)', sampleMorning: '07:00 - 10:00', sampleAfternoon: '15:00 - 18:00', sampleEvening: '19:00 - 22:00' },
    USWest: { name: 'USA & Canada (West)', city: 'Los Angeles (PST)', sampleMorning: '08:00 - 11:00', sampleAfternoon: '14:00 - 17:00', sampleEvening: '18:00 - 21:00' },
    Gulf: { name: 'Gulf Countries', city: 'Dubai (GST)', sampleMorning: '09:00 - 12:00', sampleAfternoon: '16:00 - 19:00', sampleEvening: '20:00 - 23:00' },
    PK: { name: 'Pakistan & South Asia', city: 'Islamabad (PKT)', sampleMorning: '08:00 - 12:00', sampleAfternoon: '14:00 - 18:00', sampleEvening: '19:00 - 23:00' },
    AUS: { name: 'Australia & NZ', city: 'Sydney (AEST)', sampleMorning: '07:00 - 10:00', sampleAfternoon: '16:00 - 19:00', sampleEvening: '19:30 - 22:30' }
  };

  // Safe synthesized web audio tone for classroom audio verification
  const handleTestAudio = () => {
    if (audioTesting) return;
    setAudioTesting(true);
    setAudioSuccess(false);
    trackEvent('audio_check_test', { step: 4 });

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 harmonic
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5 harmonic

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.85);
      }
    } catch {}

    setTimeout(() => {
      setAudioTesting(false);
      setAudioSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 select-none">
      {/* 4 Step Nav Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                setActiveStep(s.num);
                trackEvent('how_it_works_step_click', { step: s.num });
              }}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden group will-change-transform ${
                isActive
                  ? 'bg-gradient-to-br from-[#064E3B] to-[#043D2E] text-white border-[#D9B44A]/60 shadow-[0_14px_30px_-8px_rgba(6,78,59,0.38),0_0_0_1px_rgba(217,180,74,0.35)] scale-[1.02]'
                  : 'bg-white hover:bg-[#FAF9F5] text-[#334155] border-[#E2E8F0] hover:border-[#D9B44A]/40 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                    isActive
                      ? 'bg-[#D9B44A] text-[#064E3B] shadow-xs'
                      : 'bg-[#ECFDF5] text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-white'
                  }`}
                >
                  {s.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9B44A]' : 'text-[#059669]'}`} />
              </div>

              <h4 className={`font-bold text-sm sm:text-base leading-snug ${isActive ? 'text-white' : 'text-[#0F172A]'}`}>
                {s.title}
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-emerald-100/90' : 'text-[#64748B]'}`}>
                {s.shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Stage Preview Card */}
      <div className="bg-white rounded-3xl border border-[#D9B44A]/25 p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden [transform-style:preserve-3d]">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-radial from-[#D9B44A]/10 via-[#064E3B]/5 to-transparent pointer-events-none" />

        {/* STEP 1: CONTACT ADMISSIONS */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                <Clock className="w-3.5 h-3.5 text-[#059669]" />
                <span>Immediate Coordinator Response</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Step 1: Contact Admissions
              </h3>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Connect with our academic administration in seconds. Whether via WhatsApp or our free trial booking form, share your goals, preferred language, and time zone.
              </p>

              {/* Interactive Inquirer Filter */}
              <div className="pt-1">
                <span className="block text-xs font-semibold text-[#64748B] mb-2">Simulate an Inquiry Topic:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'child', label: 'Child (Qaida & Duas)' },
                    { id: 'tajweed', label: 'Adult Tajweed' },
                    { id: 'hifz', label: 'Quran Hifz (Memorization)' },
                    { id: 'islamic', label: 'Islamic Studies' }
                  ].map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopic(topic.id as typeof selectedTopic)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedTopic === topic.id
                          ? 'bg-[#064E3B] text-white shadow-xs'
                          : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#334155] pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>No payment or card required for 3-day free trial</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Option to request male or female instructors for sisters and children</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Personalized placement according to current proficiency</span>
                </li>
              </ul>

              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="btn-tactile inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#064E3B] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#043D2E] cursor-pointer"
                >
                  <span>Book Free Trial Class</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/923171503094?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20inquire%20about%20online%20Quran%20classes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tactile inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#064E3B] border border-[#CBD5E1] text-xs sm:text-sm font-semibold hover:bg-[#F0FDF4] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#059669]" />
                  <span>WhatsApp Coordinator</span>
                </a>
              </div>
            </div>

            {/* Interactive Fast-Track Preview Simulator */}
            <div className="lg:col-span-5 bg-[#FAF9F5] p-5 sm:p-6 rounded-2xl border border-[#E5E2D9] space-y-3.5 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] text-xs">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-[#059669]" />
                  Admissions Fast-Track
                </span>
                <span className="text-[11px] text-[#064E3B] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] font-semibold">
                  Coordinator Online
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] text-[#334155] shadow-xs">
                  <p className="font-semibold text-[#064E3B] text-[11px] mb-1">Academic Admissions:</p>
                  "Assalamu Alaikum! Welcome to Tuhfat Al-Ilm Academy. We are ready to organize your 1-on-1 trial class. Which course or age group are you inquiring for?"
                </div>

                <div className="bg-[#ECFDF5] p-3.5 rounded-xl border border-[#A7F3D0] text-[#064E3B] ml-4 shadow-xs">
                  <p className="font-semibold text-[#047857] text-[11px] mb-1">Parent / Student Inquiry:</p>
                  {selectedTopic === 'child' && '"Looking for a gentle 1-on-1 teacher for my 6-year-old child to learn Noorani Qaida and daily duas."'}
                  {selectedTopic === 'tajweed' && '"Seeking an experienced Qari to correct pronunciation, Noon Sakinah rules, and Salah recitation."'}
                  {selectedTopic === 'hifz' && '"Interested in full Quran memorization with a certified Hafiz, 5 days a week."'}
                  {selectedTopic === 'islamic' && '"Looking for fundamental Islamic studies, Hadith basics, and Fiqh of Taharah and Salah."'}
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] text-[#334155] shadow-xs">
                  <p className="font-semibold text-[#064E3B] text-[11px] mb-1">Academic Admissions:</p>
                  "Alhamdulillah, we have dedicated instructors available in your time zone. We can arrange your first 1-on-1 trial session within 24 hours!"
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
                Average response time: <strong className="text-[#064E3B]">Under 15 minutes</strong>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GOAL & LEVEL REVIEW */}
        {activeStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                <FileCheck2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Individualized Assessment</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Step 2: Goal &amp; Level Review
              </h3>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                We assess the student’s current level to establish the right learning track, preventing students from feeling rushed or held back.
              </p>

              {/* Interactive Level Switcher */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedLevel('beginner')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLevel === 'beginner'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  Beginner (Qaida &amp; Makharij)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLevel('tajweed')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLevel === 'tajweed'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  Tajweed &amp; Recitation
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLevel('hifz')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLevel === 'hifz'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  Quran Hifz (Memorization)
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs sm:text-sm text-[#334155] space-y-2 shadow-xs">
                {selectedLevel === 'beginner' && (
                  <>
                    <p className="font-bold text-[#064E3B] text-sm sm:text-base">Target: Alphabet Recognition, Throat &amp; Tongue Origins</p>
                    <p className="text-[#475569] leading-relaxed">
                      Begins with single Arabic letters, identifying throat (Halq) and tongue (Lisaan) articulation points, then progresses through Harakaat (Fatha, Kasra, Damma) to fluent joined words.
                    </p>
                  </>
                )}
                {selectedLevel === 'tajweed' && (
                  <>
                    <p className="font-bold text-[#064E3B] text-sm sm:text-base">Target: Accurate Pronunciation in Salah &amp; Daily Tilawat</p>
                    <p className="text-[#475569] leading-relaxed">
                      Targeted mastery of Noon Sakinah &amp; Tanween (Izhar, Idgham, Iqlab, Ikhfa), Meem Sakinah, Raa &amp; Laam rules, and Waqf (stopping punctuation) with melodious rhythm.
                    </p>
                  </>
                )}
                {selectedLevel === 'hifz' && (
                  <>
                    <p className="font-bold text-[#064E3B] text-sm sm:text-base">Target: Disciplined 3-Part Daily Retention</p>
                    <p className="text-[#475569] leading-relaxed">
                      Structured daily routine: Sabaq (newly memorized lines), Sabqi (recent Juz consolidation), and Manzil (cumulative revision) guided by certified Huffaz.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Evaluation Outcome Placement Report Card */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-[#CBD5E1] shadow-md space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Assessment Outcome</span>
              <h4 className="font-bold text-base text-[#0F172A]">Sample Placement Report</h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Recommended Course:</span>
                  <span className="font-bold text-[#064E3B]">
                    {selectedLevel === 'beginner' ? 'Noorani Qaida' : selectedLevel === 'tajweed' ? 'Tajweed-ul-Quran' : 'Hifz-ul-Quran'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Session Duration:</span>
                  <span className="font-semibold text-[#334155]">30 Minutes / Session</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Instruction Format:</span>
                  <span className="font-semibold text-[#334155]">1-on-1 Dedicated Instructor</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Weekly Frequency:</span>
                  <span className="font-semibold text-[#334155]">3, 4, or 5 Days Available</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="btn-tactile w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] hover:bg-[#D1FAE5] cursor-pointer"
              >
                Browse All Course Outlines &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE SELECTION */}
        {activeStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                <Globe2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Global Scheduling Matrix</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Step 3: Schedule Selection
              </h3>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                We accommodate students worldwide. Select your regional timezone below to see sample morning, afternoon, and evening slots:
              </p>

              {/* Timezone Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {(Object.keys(timezones) as Array<keyof typeof timezones>).map((key) => {
                  const tz = timezones[key];
                  const isSelected = selectedTimezone === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTimezone(key)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                          : 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <span className="block font-bold text-xs">{tz.name}</span>
                      <span className={`text-[10px] block ${isSelected ? 'text-emerald-200' : 'text-[#64748B]'}`}>
                        {tz.city}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slot Selection */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {[
                  { id: 'morning', label: 'Morning Slot', time: timezones[selectedTimezone].sampleMorning },
                  { id: 'afternoon', label: 'Afternoon Slot', time: timezones[selectedTimezone].sampleAfternoon },
                  { id: 'evening', label: 'Evening Slot', time: timezones[selectedTimezone].sampleEvening }
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id as typeof selectedSlot)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedSlot === slot.id
                        ? 'bg-[#059669] text-white border-[#059669] shadow-xs'
                        : 'bg-[#FAF9F5] text-[#475569] border-[#E5E2D9] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <span className="block text-xs font-bold">{slot.label}</span>
                    <span className="text-[10px] opacity-85 block mt-0.5">{slot.time}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-[#64748B]">
                Selected Window: <strong className="text-[#064E3B] capitalize">{selectedSlot}</strong> in <strong className="text-[#0F172A]">{timezones[selectedTimezone].city}</strong>.
              </p>
            </div>

            {/* Schedule Confirmation Card */}
            <div className="lg:col-span-5 bg-[#FAF9F5] p-6 rounded-2xl border border-[#E5E2D9] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#064E3B] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#059669]" />
                  Weekly Availability
                </span>
                <span className="text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md">
                  Active Timetable
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#334155]">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <span>Monday — Thursday:</span>
                  <span className="font-bold text-[#064E3B]">Open Slots</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <span>Friday:</span>
                  <span className="font-bold text-[#064E3B]">Flexible / Jumu'ah Hours</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <span>Saturday — Sunday:</span>
                  <span className="font-bold text-[#064E3B]">Weekend Tracks</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="btn-tactile w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#064E3B] text-white shadow-xs hover:bg-[#043D2E] cursor-pointer"
              >
                Inquire For Your Preferred Time &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LIVE 1-ON-1 ONLINE CLASSES WITH INTERACTIVE TAJWEED & AUDIO SIMULATOR */}
        {activeStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                <MonitorCheck className="w-3.5 h-3.5 text-[#059669]" />
                <span>Interactive Digital Classroom</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Step 4: Live 1-on-1 Classes
              </h3>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Classes take place over Zoom or Google Meet with high-definition digital Quran text on screen. The instructor guides, corrects pronunciation instantly, and provides undivided attention.
              </p>

              {/* Tajweed Interactive Rule Highlighter */}
              <div className="pt-1">
                <span className="block text-xs font-semibold text-[#64748B] mb-2">
                  Click a Tajweed Rule to see how it's taught in class:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Rules' },
                    { id: 'qalqalah', label: 'Qalqalah (Echoing)' },
                    { id: 'ghunnah', label: 'Ghunnah (Nasalization)' },
                    { id: 'madd', label: 'Madd (Elongation)' }
                  ].map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => setActiveTajweedRule(rule.id as typeof activeTajweedRule)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTajweedRule === rule.id
                          ? 'bg-[#064E3B] text-white shadow-xs'
                          : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {rule.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Verification Test Simulator */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestAudio}
                  disabled={audioTesting}
                  className="btn-tactile inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#064E3B] hover:bg-[#F0FDF4] cursor-pointer"
                >
                  <Volume2 className={`w-4 h-4 ${audioTesting ? 'animate-bounce text-[#059669]' : 'text-[#64748B]'}`} />
                  <span>{audioTesting ? 'Testing Audio Levels...' : 'Test Classroom Audio'}</span>
                </button>

                {audioTesting && (
                  <div className="flex items-center gap-1.5 py-1 px-3 bg-[#ECFDF5] rounded-lg border border-[#A7F3D0]">
                    <div className="flex items-end gap-1 h-3.5">
                      <span className="w-1 bg-[#059669] h-2 animate-pulse" />
                      <span className="w-1 bg-[#059669] h-3.5 animate-pulse" />
                      <span className="w-1 bg-[#059669] h-1.5 animate-pulse" />
                      <span className="w-1 bg-[#059669] h-3 animate-pulse" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#064E3B]">Checking Web Audio...</span>
                  </div>
                )}

                {audioSuccess && !audioTesting && (
                  <span className="text-xs font-bold text-[#059669] inline-flex items-center gap-1 bg-[#ECFDF5] px-2.5 py-1 rounded-lg border border-[#A7F3D0]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Audio Verified 100% Clear!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Simulated Live Classroom 3D Card */}
            <div className="lg:col-span-5 bg-[#064E3B] rounded-2xl p-6 text-white space-y-4 shadow-2xl border border-[#D9B44A]/40 [transform-style:preserve-3d]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-emerald-100">Live 1-on-1 Session</span>
                </div>
                <span className="text-white/70 text-[11px]">HD Audio &amp; Screen Share</span>
              </div>

              {/* Digital Quran text preview with dynamic Tajweed rule highlights */}
              <div className="bg-white/10 backdrop-blur-xs p-5 rounded-xl text-center border border-white/10 [transform:translateZ(15px)]">
                <p className="font-arabic text-2xl sm:text-3xl text-white leading-loose mb-2">
                  {/* Surah Al-Ikhlas with interactive highlights */}
                  <span>قُلْ هُوَ اللَّهُ </span>
                  <span
                    className={`transition-colors duration-300 font-bold px-1 rounded ${
                      activeTajweedRule === 'qalqalah' || activeTajweedRule === 'all'
                        ? 'text-[#FDE68A] bg-[#D9B44A]/25 ring-1 ring-[#D9B44A]/60'
                        : 'text-white'
                    }`}
                  >
                    أَحَدٌ
                  </span>
                  <span> · </span>
                  <span>اللَّهُ </span>
                  <span
                    className={`transition-colors duration-300 font-bold px-1 rounded ${
                      activeTajweedRule === 'qalqalah' || activeTajweedRule === 'all'
                        ? 'text-[#FDE68A] bg-[#D9B44A]/25 ring-1 ring-[#D9B44A]/60'
                        : 'text-white'
                    }`}
                  >
                    الصَّمَدُ
                  </span>
                </p>

                {/* Tajweed Contextual Rule Explanation */}
                <div className="text-[11px] text-emerald-100 bg-black/20 p-2.5 rounded-lg border border-white/10">
                  {activeTajweedRule === 'qalqalah' && (
                    <span><strong>Qalqalah on د (Daal):</strong> Clear echoing bounce on Waqf (stopping).</span>
                  )}
                  {activeTajweedRule === 'ghunnah' && (
                    <span><strong>Ghunnah:</strong> 2-count nasal resonance on Noon and Meem Mushaddad.</span>
                  )}
                  {activeTajweedRule === 'madd' && (
                    <span><strong>Madd:</strong> Vocal prolongation from 2 to 6 Harakaat counts.</span>
                  )}
                  {activeTajweedRule === 'all' && (
                    <span>Surah Al-Ikhlas · Real-time teacher correction &amp; Makharij annotation</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 text-white/90">
                  <Award className="w-3.5 h-3.5 text-[#D9B44A]" />
                  <span>Certified Teacher</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="btn-tactile px-4 py-2 rounded-xl bg-[#D9B44A] text-[#064E3B] font-bold text-xs hover:bg-[#E2C365] cursor-pointer shadow-sm"
                >
                  Start Your Free Trial
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

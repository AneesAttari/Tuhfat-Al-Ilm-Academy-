import React from 'react';
import { PageId } from '../types';
import { ArrowRight, MessageCircle, Phone, Mail, Clock, Laptop, BookOpen, CheckCircle2, MessageSquare } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface HowItWorksPageProps {
  onNavigate: (page: PageId) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Header */}
      <ScrollReveal direction="fade-up">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
            Simple Onboarding
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mt-2 tracking-tight">
            How It Works
          </h1>
          <p className="text-base sm:text-lg text-[#475569] mt-4 leading-relaxed">
            Enrolling in online Quran and Islamic classes at Tuhfat Al-Ilm Academy is a smooth, transparent 4-step process designed around your schedule and learning goals.
          </p>
        </div>
      </ScrollReveal>

      {/* Detailed 4 Steps Cards */}
      <div className="space-y-6">
        {/* Step 1 */}
        <ScrollReveal direction="fade-up" delay={0}>
          <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#A7F3D0] transition-colors">
            <div className="lg:col-span-2 flex items-center lg:justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                01
              </div>
            </div>
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">First Step</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Contact Tuhfat Al-Ilm Academy
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Reach out directly to our admissions team through WhatsApp, a phone call, or email. Let us know who the student is (child or adult) and your preferred language of instruction.
              </p>
            </div>
            <div className="lg:col-span-3 flex flex-col gap-2">
              <a
                href="https://wa.me/923171503094"
                className="inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#059669]" />
                <span>WhatsApp: +92 317 1503094</span>
              </a>
              <a
                href="tel:+923096794698"
                className="inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#374151] bg-[#FAF9F5] hover:bg-neutral-100 border border-[#E5E2D9] rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4 text-[#64748B]" />
                <span>Call: +92 309 6794698</span>
              </a>
              <a
                href="sms:+923096794698"
                className="inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#374151] bg-[#FAF9F5] hover:bg-neutral-100 border border-[#E5E2D9] rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#64748B]" />
                <span>SMS: +92 309 6794698</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 2 */}
        <ScrollReveal direction="fade-up" delay={80}>
          <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#A7F3D0] transition-colors">
            <div className="lg:col-span-2 flex items-center lg:justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                02
              </div>
            </div>
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Second Step</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Tell Us About Your Learning Goals
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Share your current level with our academic advisor. Whether starting with Arabic alphabet basics (Qaida), improving Tajweed rules, working toward Quran memorization (Hifz), or studying Islamic fundamentals, we tailor the curriculum to your goals.
              </p>
            </div>
            <div className="lg:col-span-3 bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E2D9] text-xs text-[#64748B] space-y-1">
              <p className="font-semibold text-[#0F172A]">Key Highlights:</p>
              <p>• Level assessment</p>
              <p>• Course selection guidance</p>
              <p>• Pacing discussion</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 3 */}
        <ScrollReveal direction="fade-up" delay={80}>
          <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#A7F3D0] transition-colors">
            <div className="lg:col-span-2 flex items-center lg:justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                03
              </div>
            </div>
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Third Step</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Discuss a Suitable Schedule
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                We arrange class slots that seamlessly fit your family, work, and school timetable across different international timezones. You can select your preferred days per week and daily class duration.
              </p>
            </div>
            <div className="lg:col-span-3 bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E2D9] text-xs text-[#64748B] space-y-1">
              <p className="font-semibold text-[#0F172A]">Schedule Flexibility:</p>
              <p>• Weekday &amp; Weekend slots</p>
              <p>• Morning &amp; Evening hours</p>
              <p>• International timezones</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 4 */}
        <ScrollReveal direction="fade-up" delay={80}>
          <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#A7F3D0] transition-colors">
            <div className="lg:col-span-2 flex items-center lg:justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                04
              </div>
            </div>
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Fourth Step</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Begin Online Classes
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Connect with your dedicated instructor online. Each lesson features interactive reading, recitation correction, structured review of previous material, and encouragement to foster consistent habit.
              </p>
            </div>
            <div className="lg:col-span-3 bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E2D9] text-xs text-[#64748B] space-y-1">
              <p className="font-semibold text-[#0F172A]">Class Experience:</p>
              <p>• Live one-to-one instruction</p>
              <p>• Real-time feedback</p>
              <p>• Continuous revision track</p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Equipment & Requirements */}
      <ScrollReveal direction="fade-up">
        <div className="bg-[#FAF9F5] rounded-3xl p-8 border border-[#E2E8F0]">
          <h3 className="text-xl font-bold text-[#0F172A] mb-6 text-center">
            What You Need to Get Started
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mx-auto sm:mx-0">
                <Laptop className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">A Connected Device</h4>
              <p className="text-xs text-[#64748B]">
                Any Android smartphone, tablet, laptop, or desktop computer with internet access.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto sm:mx-0">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Consistent Time</h4>
              <p className="text-xs text-[#64748B]">
                A regular daily or weekly time slot set aside for focused recitation and practice.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center mx-auto sm:mx-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">A Willing Heart</h4>
              <p className="text-xs text-[#64748B]">
                Eagerness to learn the book of Allah SWT with sincerity and dedication.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Professional CTA at bottom */}
      <ScrollReveal direction="zoom-in" delay={100}>
        <div className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ready to Start?
          </h2>
          <p className="text-sm sm:text-base text-[#D1FAE5] max-w-xl mx-auto">
            Contact our team today to take the first step toward beginning your online Quran and Islamic classes.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-[#064E3B] bg-white hover:bg-[#FAF9F5] rounded-xl shadow transition-colors cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/923171503094"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] border border-[#34D399]/40 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp (+92 317 1503094)</span>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

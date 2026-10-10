import React, { useState, useEffect } from 'react';
import { PageId, Teacher } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { ShieldCheck, GraduationCap, Award, Heart, CheckCircle2, ArrowRight, UserCheck, MessageCircle } from 'lucide-react';
import { getStoredTeachers, saveStoredTeachers } from '../data/teachers';

interface TeachersPageProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
}

export const TeachersPage: React.FC<TeachersPageProps> = ({ onNavigate }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(getStoredTeachers);

  useEffect(() => {
    setTeachers(getStoredTeachers());

    fetch('/api/teachers')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.teachers && Array.isArray(data.teachers) && data.teachers.length > 0) {
          setTeachers(data.teachers);
          saveStoredTeachers(data.teachers);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="py-10 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <ScrollReveal direction="fade-up">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#064E3B] text-xs font-semibold border border-[#A7F3D0] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>Certified &amp; Vetted Faculty</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
            Our Qualified Teachers &amp; Scholars
          </h1>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
            At Tuhfat Al-Ilm Academy, our instructors are certified Huffaz, Qaris, and Islamic Scholars chosen for their academic rigour, patience, and commitment to individual student progress.
          </p>
        </div>
      </ScrollReveal>

      {/* Teacher Qualifications Standards */}
      <ScrollReveal direction="fade-up" delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0F172A] text-base">Certified Sanad &amp; Ijazah</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Instructors hold authentic chains of recitation and formal certification from reputable Islamic institutions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0F172A] text-base">Dedicated Female Tutors</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Qualified female Quran tutors available upon request for sisters, young girls, and toddlers.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0F172A] text-base">Patient 1-on-1 Pedagogy</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Gentle, encouraging environment designed to build confidence in learners of all age groups and backgrounds.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Faculty Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teachers.filter((t) => t.active !== false).map((t, idx) => (
          <ScrollReveal key={idx} direction="fade-up" delay={idx * 100}>
            <div className="h-full bg-white rounded-3xl border border-[#E2E8F0] p-7 flex flex-col justify-between shadow-sm hover:border-[#A7F3D0] hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-xl shadow-sm overflow-hidden shrink-0">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{t.name.split(' ')[1]?.[0] || t.name[0] || 'Q'}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">{t.name}</h3>
                  <span className="text-xs font-semibold text-[#059669] block mt-0.5">{t.role}</span>
                </div>

                <div className="space-y-2 text-xs text-[#475569] bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E2D9]">
                  <p className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-4 h-4 text-[#064E3B] shrink-0" />
                    <span>{t.qualification}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Award className="w-4 h-4 text-[#D97706] shrink-0" />
                    <span>{t.experience}</span>
                  </p>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">{t.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] rounded-xl border border-[#A7F3D0] transition-colors cursor-pointer"
                >
                  <span>Request Class with {t.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA Box */}
      <ScrollReveal direction="fade-up">
        <div className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-title">
            Book a Free 1-on-1 Trial Class with Our Instructors
          </h2>
          <p className="text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Experience our personal teaching methodology during a free evaluation session across any timezone worldwide.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-[#064E3B] bg-white hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <span>Book Free Trial Class</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/923171503094"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp +92 317 1503094</span>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

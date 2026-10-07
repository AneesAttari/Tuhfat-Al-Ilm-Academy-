import React from 'react';
import { PageId } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { BookOpen, Download, FileText, CheckCircle2, Sparkles, ArrowRight, Sun, Heart, Compass } from 'lucide-react';

interface ResourcesPageProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate }) => {
  const resources = [
    {
      title: 'Foundational Qaida & Phonetics Overview',
      category: 'Nazra & Beginners',
      icon: BookOpen,
      desc: 'Summary of Arabic letter articulation points (Makharij), Harakat, Tanween, and Sukoon rules for beginners starting their Quran journey.',
      items: [
        'Alphabet recognition & single-letter sounds',
        'Rules of Harakat (Fatha, Kasra, Damma)',
        'Madd rules and connecting letters into words'
      ]
    },
    {
      title: 'Essential Tajweed Rules Cheat Sheet',
      category: 'Tajweed-o-Qirat',
      icon: Sparkles,
      desc: 'Quick reference guide for rules of Noon Saakin & Tanween (Izhar, Idgham, Iqlab, Ikhfa) and Meem Saakin conventions.',
      items: [
        'Rules of Noon Saakin & Tanween',
        'Ghunnah, Qalqalah & Sifaat al-Huroof',
        'Rules of Waqf (stopping) and resuming recitation'
      ]
    },
    {
      title: 'Authentic Daily Protection Duas (Hisn al-Muslim)',
      category: 'Dua & Sunnah',
      icon: Sun,
      desc: 'Essential morning and evening supplications, prayers for leaving home, entering the mosque, eating, and seeking forgiveness.',
      items: [
        'Morning & evening protective Adhkar',
        'Daily duas for meals, travel & sleep',
        'Supplications for anxiety, distress & guidance'
      ]
    },
    {
      title: 'Step-by-Step Salah / Namaz Guide',
      category: 'Basic Islamic Knowledge',
      icon: Compass,
      desc: 'Clear, illustrated summary of Wudu, Ghusl, posture rules, Tashahhud, and Dua Qunoot for daily prayers.',
      items: [
        'Method of Wudu & Taharah',
        '5 Daily Salah positions & recitations',
        'Common prayer mistakes and how to avoid them'
      ]
    }
  ];

  return (
    <div className="py-10 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <ScrollReveal direction="fade-up">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#064E3B] text-xs font-semibold border border-[#A7F3D0] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#059669]" />
            <span>Free Learning Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
            Islamic Learning Resources &amp; Guides
          </h1>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
            Access free study guides, Tajweed rules summaries, daily supplications, and Salah reference materials provided by Tuhfat Al-Ilm Academy.
          </p>
        </div>
      </ScrollReveal>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((res, idx) => {
          const IconComp = res.icon;
          return (
            <ScrollReveal key={idx} direction="fade-up" delay={idx * 80}>
              <article className="h-full bg-white rounded-3xl border border-[#E2E8F0] p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:border-[#A7F3D0] hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]/60">
                      {res.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#0F172A]">{res.title}</h2>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{res.desc}</p>

                  <ul className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                    {res.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs text-[#374151] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('contact', res.title)}
                    className="inline-flex items-center gap-2 py-2.5 px-4 text-xs font-bold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] rounded-xl border border-[#A7F3D0] transition-colors cursor-pointer"
                  >
                    <span>Request Study Material</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('contact', res.title)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#064E3B] font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Enroll Banner */}
      <ScrollReveal direction="fade-up">
        <div className="bg-[#FAF9F5] rounded-3xl p-8 border border-[#E2E8F0] text-center max-w-3xl mx-auto space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
            Want 1-on-1 Guided Lessons with a Certified Teacher?
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Our structured courses pair you with a personal instructor to master these guides with direct correction during live online sessions.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer"
            >
              <span>Enroll for Live 1-on-1 Classes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

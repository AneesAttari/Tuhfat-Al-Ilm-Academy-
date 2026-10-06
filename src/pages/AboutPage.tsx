import React from 'react';
import { PageId } from '../types';
import { ArrowRight, Compass, Heart, Users, BookOpen, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import studyImg from '../assets/images/quran_tajweed_reading_1791212054850.jpg';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Header */}
      <ScrollReveal direction="fade-up">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
            Dedicated Online Academy
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mt-2 tracking-tight">
            About Tuhfat Al-Ilm Academy
          </h1>
          <p className="text-base sm:text-lg text-[#475569] mt-4 leading-relaxed">
            Tuhfat Al-Ilm Academy is an online Islamic academy dedicated to providing structured Quran and Islamic education for students around the world from the comfort of their homes.
          </p>
        </div>
      </ScrollReveal>

      {/* Hero Visual & Intro Card */}
      <ScrollReveal direction="fade-up" delay={80}>
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Accessible, Respectful, and Individualized Islamic Learning
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                In an interconnected world, many families and individuals wish to study the Holy Quran and strengthen their Islamic foundation, but struggle to find qualified, patient teachers with schedules that match their daily commitments.
              </p>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Tuhfat Al-Ilm Academy was established to bridge that gap. We offer personalized, one-to-one and small group online sessions led by dedicated instructors, allowing learners in any country to study comfortably and progress steadily.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm">
                <img
                  src={studyImg}
                  alt="Studying the Quran with notes in an educational setting"
                  className="w-full h-auto aspect-[16/10] object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CORE SECTIONS: Mission, Approach, Who We Teach, Learning Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Our Mission */}
        <ScrollReveal direction="fade-up" delay={0}>
          <div className="h-full bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#A7F3D0] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Our Mission</h3>
              <p className="text-sm sm:text-base text-[#475569] mt-3 leading-relaxed">
                Our mission is to make authentic Quranic reading, Tajweed pronunciation, memorization, and essential Islamic values easily accessible to students of all backgrounds worldwide. We aim to nurture a lifelong love and reverence for the Holy Quran in every learner.
              </p>
            </div>
            <ul className="space-y-2 border-t border-[#F1F5F9] pt-4 text-xs text-[#64748B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Cultivating love and understanding of Allah’s book</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Reliable online access regardless of geographic location</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        {/* Section 2: Our Approach */}
        <ScrollReveal direction="fade-up" delay={120}>
          <div className="h-full bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#A7F3D0] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Our Approach</h3>
              <p className="text-sm sm:text-base text-[#475569] mt-3 leading-relaxed">
                We believe effective learning takes place in an atmosphere of warmth, patience, and mutual respect. We do not rush students through verses; rather, we ensure each sound, vowel, and rule is mastered thoroughly before advancing to the next level.
              </p>
            </div>
            <ul className="space-y-2 border-t border-[#F1F5F9] pt-4 text-xs text-[#64748B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Gentle, constructive correction for every student</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Adaptation to each student’s unique learning speed</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        {/* Section 3: Who We Teach */}
        <ScrollReveal direction="fade-up" delay={0}>
          <div className="h-full bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#A7F3D0] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Who We Teach</h3>
              <p className="text-sm sm:text-base text-[#475569] mt-3 leading-relaxed">
                Tuhfat Al-Ilm Academy welcomes a diverse international student body. Our programs are tailored for young children beginning with the Arabic alphabet, older youth polishing Tajweed or memorizing, as well as adult learners who want flexible evening or weekend classes.
              </p>
            </div>
            <ul className="space-y-2 border-t border-[#F1F5F9] pt-4 text-xs text-[#64748B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Children starting from age 4 and older</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Adult brothers and sisters desiring private one-to-one lessons</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        {/* Section 4: Our Learning Philosophy */}
        <ScrollReveal direction="fade-up" delay={120}>
          <div className="h-full bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#A7F3D0] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Our Learning Philosophy</h3>
              <p className="text-sm sm:text-base text-[#475569] mt-3 leading-relaxed">
                Knowledge (Ilm) is a noble trust. We emphasize not just mechanical recitation, but the character (Adab), intention, and moral values that accompany sacred learning. Students are encouraged to reflect upon what they learn and practice the daily Sunnahs in their lives.
              </p>
            </div>
            <ul className="space-y-2 border-t border-[#F1F5F9] pt-4 text-xs text-[#64748B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Balancing recitation skill with Islamic manners and character</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Continuous encouragement and positive motivation</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>

      {/* Call to Action Banner */}
      <ScrollReveal direction="zoom-in" delay={100}>
        <div className="bg-[#FAF9F5] border border-[#E2E8F0] rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Join Tuhfat Al-Ilm Academy Today
          </h3>
          <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto">
            Take the first step toward learning the Holy Quran and essential Islamic knowledge with our dedicated instructors.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-colors cursor-pointer"
            >
              <span>Explore Our Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow transition-colors cursor-pointer"
            >
              <span>Contact &amp; Enroll</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

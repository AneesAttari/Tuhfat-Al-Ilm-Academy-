import React, { useState } from 'react';
import { FAQS } from '../data/faqs';
import { HelpCircle, ChevronDown, MessageSquare, ArrowRight, BookOpen, Phone, CheckCircle2 } from 'lucide-react';
import { PageId } from '../types';

interface FaqPageProps {
  onNavigate?: (page: PageId, extra?: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Clear Answers for Parents & Students
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E2320] tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#4B5563]">
            Have questions about our online Quran classes, scheduling, certified scholars, or free trial process? Find everything you need right here.
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. trial class, female teachers, schedule, fees)..."
              className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white border border-[#E5E2D9] text-[#1E2320] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent shadow-sm transition-all"
            />
            <HelpCircle className="w-5 h-5 text-[#9CA3AF] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-[#064E3B]/30 shadow-md ring-1 ring-[#064E3B]/20' : 'border-[#E5E2D9] hover:border-[#CBD5E1]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-[#1E2320] leading-snug">
                      {faq.question}
                    </span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen ? 'bg-[#ECFDF5] text-[#064E3B] rotate-180' : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#4B5563] leading-relaxed border-t border-[#F3F4F6]">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E2D9] p-8">
              <p className="text-base font-medium text-[#4B5563] mb-2">No matching questions found.</p>
              <p className="text-xs text-[#6B7280] mb-4">Feel free to message our admissions team directly via WhatsApp or email.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-[#064E3B] underline hover:text-[#043D2E]"
              >
                Clear search query
              </button>
            </div>
          )}
        </div>

        {/* Call to Action Box */}
        <div className="mt-12 bg-gradient-to-br from-[#064E3B] to-[#043D2E] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-sm">
              Free Consultation & Trial
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Still have questions about our classes?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
              Our academic advisors are available 24/7 to guide you through course selection, teacher pairing, and convenient scheduling for your child or yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#064E3B] font-semibold text-sm hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  Book Free Trial Class
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <a
                href="https://wa.me/923171503094?text=Assalamu%20Alaikum%2C%20I%20have%20questions%20about%20online%20Quran%20classes%20at%20Tuhfat%20Al-Ilm%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-sm transition-all border border-emerald-500/30"
              >
                <Phone className="w-4 h-4" />
                WhatsApp Admissions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

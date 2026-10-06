import React, { useState } from 'react';
import { PageId } from '../types';
import { FAQS } from '../data/faqs';
import { ChevronDown, MessageCircle, Mail, Phone, ArrowRight, HelpCircle } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface FaqPageProps {
  onNavigate: (page: PageId) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 lg:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <ScrollReveal direction="fade-up">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
            Got Questions?
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mt-2 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-[#475569] mt-4 leading-relaxed">
            Find clear answers regarding class formats, scheduling, enrollment, and teaching methods at Tuhfat Al-Ilm Academy.
          </p>
        </div>
      </ScrollReveal>

      {/* Accessible Accordion with Staggered Reveals */}
      <div className="space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          const answerId = `faq-answer-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <ScrollReveal key={index} direction="fade-up" delay={index * 50}>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:border-[#A7F3D0] transition-colors">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-semibold text-[#0F172A] hover:text-[#064E3B] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-inset transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold pr-2">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#064E3B]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 text-sm sm:text-base text-[#475569] leading-relaxed border-t border-[#F1F5F9] pt-4"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Contact Banner for Unanswered Questions */}
      <ScrollReveal direction="zoom-in" delay={100}>
        <div className="bg-[#FAF9F5] rounded-3xl p-8 border border-[#E2E8F0] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">
            Have a Question Not Listed Here?
          </h3>
          <p className="text-sm text-[#475569] max-w-md mx-auto">
            Our team is available to assist you. Contact us directly through WhatsApp or email for prompt assistance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/923171503094"
              className="inline-flex items-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#064E3B] bg-white hover:bg-[#F0FDF4] border border-[#CBD5E1] rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#059669]" />
              <span>Chat on WhatsApp (+92 317 1503094)</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <span>Go to Contact Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

import React from 'react';
import { PageId } from '../types';
import { BookOpen, ArrowLeft, Home, HelpCircle, PhoneCall } from 'lucide-react';
import { Logo } from '../components/Logo';

interface NotFoundPageProps {
  onNavigate: (page: PageId) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mx-auto">
          <Logo size="lg" variant="icon" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-bold font-mono text-[#064E3B]">404</span>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            The page or course link you are looking for could not be found or may have moved.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2.5 text-left">
          <span className="text-[11px] font-bold text-[#064E3B] uppercase tracking-wider block">
            Popular Navigation Destination:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#ECFDF5] text-[#0F172A] hover:text-[#064E3B] border border-[#E5E2D9] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#064E3B]" />
              <span>Homepage</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#ECFDF5] text-[#0F172A] hover:text-[#064E3B] border border-[#E5E2D9] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#064E3B]" />
              <span>All Courses</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('faq')}
              className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#ECFDF5] text-[#0F172A] hover:text-[#064E3B] border border-[#E5E2D9] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#064E3B]" />
              <span>FAQ Page</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#ECFDF5] text-[#0F172A] hover:text-[#064E3B] border border-[#E5E2D9] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#064E3B]" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};

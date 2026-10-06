import React from 'react';
import { PageId } from '../types';
import { MessageCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#022C22] text-[#D1FAE5] pt-14 pb-10 border-t border-[#064E3B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#064E3B]/60">
          {/* Column 1: Brand & Subtitle */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center text-left group cursor-pointer focus:outline-none"
            >
              <Logo variant="horizontal" size="md" />
            </button>
            <p className="text-sm font-medium text-[#6EE7B7]">
              Online Quran &amp; Islamic Education
            </p>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Providing accessible online Quran and Islamic education for students around the world through qualified teachers and structured classes.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Navigation
            </p>
            <ul className="space-y-2 text-xs text-[#A7F3D0]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Courses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact &amp; Enroll
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Courses with Dedicated Page Links */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Featured Programs
            </p>
            <ul className="space-y-2 text-xs text-[#A7F3D0]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('course-detail', 'quran-reading')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Quran Reading / Nazra
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('course-detail', 'hifz-ul-quran')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hifz-ul-Quran
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('course-detail', 'tajweed')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tajweed
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('course-detail', 'quran-translation')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Quran Translation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('course-detail', 'childrens-islamic-education')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Children&apos;s Islamic Education
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('course-detail', 'one-to-one-classes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  One-to-One Classes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Official Contact
            </p>
            <div className="space-y-2.5 text-xs text-[#A7F3D0]">
              {/* WhatsApp */}
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#6EE7B7]">WhatsApp:</span>
                  <a
                    href="https://wa.me/923171503094"
                    onClick={() => trackEvent('whatsapp_click', { page: 'footer' })}
                    className="font-semibold text-white hover:text-[#34D399] transition-colors"
                  >
                    +92 317 1503094
                  </a>
                </div>
              </div>

              {/* Call */}
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#6EE7B7]">Phone Call:</span>
                  <a
                    href="tel:+923096794698"
                    onClick={() => trackEvent('call_click', { page: 'footer' })}
                    className="font-semibold text-white hover:text-[#34D399] transition-colors"
                  >
                    +92 309 6794698
                  </a>
                </div>
              </div>

              {/* SMS / Message */}
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#6EE7B7]">SMS / Message:</span>
                  <a
                    href="sms:+923096794698"
                    onClick={() => trackEvent('sms_click', { page: 'footer' })}
                    className="font-semibold text-white hover:text-[#34D399] transition-colors"
                  >
                    +92 309 6794698
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <div className="break-all">
                  <span className="block text-[#6EE7B7]">Email:</span>
                  <a
                    href="mailto:tuhfatalilmacademy@gmail.com"
                    onClick={() => trackEvent('email_click', { page: 'footer' })}
                    className="font-semibold text-white hover:text-[#34D399] transition-colors"
                  >
                    tuhfatalilmacademy@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-2">
          <p>© 2026 Tuhfat Al-Ilm Academy. All rights reserved.</p>
          <div className="flex items-center gap-3 text-center sm:text-right">
            <span>International Online Islamic Academy</span>
            <span className="text-[#064E3B] select-none">·</span>
            <button
              type="button"
              onClick={() => onNavigate('admin-login')}
              className="text-[#6EE7B7]/70 hover:text-white transition-colors cursor-pointer text-[11px]"
              title="Staff & Administrative Access"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

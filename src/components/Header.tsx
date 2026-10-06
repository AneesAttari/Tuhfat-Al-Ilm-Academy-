import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, User, LogOut, BookOpen, MessageSquare } from 'lucide-react';
import { PageId, User as UserType } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  currentPage: PageId;
  currentUser?: UserType | null;
  onNavigate: (page: PageId) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  currentUser = null,
  onNavigate,
  onLogout
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileDrawerOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileDrawerOpen) setMobileDrawerOpen(false);
        if (userDropdownOpen) setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen, userDropdownOpen]);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileDrawerOpen(false);
    setUserDropdownOpen(false);
  };

  const isCoursesActive = currentPage === 'courses' || currentPage === 'course-detail';

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      {/* Main Professional Sticky Header (Starts immediately - no top bar) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E2D9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand Name - always points to "/" */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center group text-left focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-2 rounded-lg p-1 cursor-pointer"
            aria-label="Tuhfat Al-Ilm Academy - Home"
          >
            <Logo variant="horizontal" size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4B5563]">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-[#064E3B] py-1 cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[#064E3B] font-bold border-b-2 border-[#064E3B]'
                  : ''
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-[#064E3B] py-1 cursor-pointer ${
                currentPage === 'about'
                  ? 'text-[#064E3B] font-bold border-b-2 border-[#064E3B]'
                  : ''
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('courses')}
              className={`transition-colors hover:text-[#064E3B] py-1 cursor-pointer ${
                isCoursesActive
                  ? 'text-[#064E3B] font-bold border-b-2 border-[#064E3B]'
                  : ''
              }`}
            >
              Courses
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className={`transition-colors hover:text-[#064E3B] py-1 cursor-pointer ${
                currentPage === 'how-it-works'
                  ? 'text-[#064E3B] font-bold border-b-2 border-[#064E3B]'
                  : ''
              }`}
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className={`transition-colors hover:text-[#064E3B] py-1 cursor-pointer ${
                currentPage === 'faq'
                  ? 'text-[#064E3B] font-bold border-b-2 border-[#064E3B]'
                  : ''
              }`}
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-[#064E3B] py-1 cursor-pointer ${
                currentPage === 'contact'
                  ? 'text-[#064E3B] font-bold border-b-2 border-[#064E3B]'
                  : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-1 cursor-pointer"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>

            {/* User Profile / Login Button */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-[#064E3B] transition-all focus:outline-none focus:ring-2 focus:ring-[#064E3B] cursor-pointer"
                  aria-expanded={userDropdownOpen}
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="text-xs font-semibold max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E2D9] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-[#E5E2D9] bg-[#FAF9F5]">
                      <p className="text-xs font-bold text-[#064E3B] truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {currentUser.email}
                      </p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#ECFDF5] text-[#047857] text-[10px] font-semibold rounded-full border border-[#A7F3D0]">
                        Student Account
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => handleNavClick('courses')}
                        className="w-full text-left px-4 py-2 text-xs text-[#374151] hover:bg-[#F4F1EA] hover:text-[#064E3B] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-[#064E3B]" />
                        <span>Explore Courses</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('contact')}
                        className="w-full text-left px-4 py-2 text-xs text-[#374151] hover:bg-[#F4F1EA] hover:text-[#064E3B] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-[#064E3B]" />
                        <span>Contact &amp; Support</span>
                      </button>
                    </div>

                    <div className="border-t border-[#E5E2D9] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="p-2.5 rounded-xl text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#064E3B] cursor-pointer flex items-center gap-1.5"
                title="Student Login / Sign Up"
                aria-label="Student Login / Sign Up"
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-semibold pr-1">Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Right: Profile Icon & Hamburger Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser ? (
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="w-9 h-9 rounded-xl bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                title={currentUser.name}
              >
                {getInitials(currentUser.name)}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="p-2 rounded-xl text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#064E3B] cursor-pointer"
                title="Student Login / Sign Up"
                aria-label="Student Login / Sign Up"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2.5 rounded-xl text-[#1E2320] bg-neutral-100 hover:bg-[#ECFDF5] hover:text-[#064E3B] focus:outline-none focus:ring-2 focus:ring-[#064E3B] transition-colors cursor-pointer"
              aria-expanded={mobileDrawerOpen}
              aria-label="Open navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION: PROFESSIONAL RIGHT-SIDE DRAWER (Slides smoothly from RIGHT) */}
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileDrawerOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Side Drawer sliding smoothly from the RIGHT */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out lg:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E5E2D9] flex items-center justify-between bg-[#FAF9F5]">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-left cursor-pointer focus:outline-none"
          >
            <Logo variant="horizontal" size="sm" />
          </button>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="p-2 rounded-lg text-[#4B5563] hover:text-[#064E3B] hover:bg-neutral-200/60 focus:outline-none focus:ring-2 focus:ring-[#064E3B] transition-colors cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {/* User Status Card in Mobile Menu if logged in */}
          {currentUser ? (
            <div className="p-3 mb-4 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">
                  {getInitials(currentUser.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#064E3B] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-[#6B7280] truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-1.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('login')}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] mb-3 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
              currentPage === 'home'
                ? 'bg-[#ECFDF5] text-[#064E3B]'
                : 'text-[#374151] hover:bg-neutral-50 hover:text-[#064E3B]'
            }`}
          >
            <span>Home</span>
            {currentPage === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
              currentPage === 'about'
                ? 'bg-[#ECFDF5] text-[#064E3B]'
                : 'text-[#374151] hover:bg-neutral-50 hover:text-[#064E3B]'
            }`}
          >
            <span>About Us</span>
            {currentPage === 'about' && <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('courses')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
              isCoursesActive
                ? 'bg-[#ECFDF5] text-[#064E3B]'
                : 'text-[#374151] hover:bg-neutral-50 hover:text-[#064E3B]'
            }`}
          >
            <span>Courses</span>
            {isCoursesActive && <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('how-it-works')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
              currentPage === 'how-it-works'
                ? 'bg-[#ECFDF5] text-[#064E3B]'
                : 'text-[#374151] hover:bg-neutral-50 hover:text-[#064E3B]'
            }`}
          >
            <span>How It Works</span>
            {currentPage === 'how-it-works' && <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('faq')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
              currentPage === 'faq'
                ? 'bg-[#ECFDF5] text-[#064E3B]'
                : 'text-[#374151] hover:bg-neutral-50 hover:text-[#064E3B]'
            }`}
          >
            <span>FAQ</span>
            {currentPage === 'faq' && <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
              currentPage === 'contact'
                ? 'bg-[#ECFDF5] text-[#064E3B]'
                : 'text-[#374151] hover:bg-neutral-50 hover:text-[#064E3B]'
            }`}
          >
            <span>Contact &amp; Enroll</span>
            {currentPage === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('admin-login')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer border-t border-[#E5E2D9]/60 mt-3 ${
              currentPage === 'admin-login'
                ? 'bg-[#ECFDF5] text-[#064E3B] font-semibold'
                : 'text-[#64748B] hover:bg-neutral-50 hover:text-[#064E3B]'
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>Admin Portal</span>
            </span>
          </button>
        </nav>

        {/* Drawer Footer CTA */}
        <div className="p-5 border-t border-[#E5E2D9] bg-[#FAF9F5] space-y-3">
          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <span>Enroll Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[11px] text-[#6B7280]">
            Tuhfat Al-Ilm Academy · Online Classes Worldwide
          </p>
        </div>
      </aside>
    </>
  );
};

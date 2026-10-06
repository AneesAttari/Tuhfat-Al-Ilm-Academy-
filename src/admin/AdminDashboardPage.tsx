import React, { useState, useEffect } from 'react';
import { PageId, AdminUser, Inquiry, Course, Announcement, AnalyticsSummary, AdminTab } from '../types';
import { Logo } from '../components/Logo';
import { AdminOverviewView } from './AdminOverviewView';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';
import { ContentManager } from './content/ContentManager';
import { AdminInquiriesView } from './inquiries/AdminInquiriesView';
import { AdminStudentsView } from './students/AdminStudentsView';
import { AdminAnnouncementsView } from './announcements/AdminAnnouncementsView';
import { AdminMediaView } from './media/AdminMediaView';
import { AdminSettingsView } from './settings/AdminSettingsView';
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  MessageSquareQuote,
  Users,
  Bell,
  Image,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardPageProps {
  admin: AdminUser;
  initialTab?: AdminTab;
  onLogout: () => void;
  onNavigatePublic: (page: PageId, extraParam?: string) => void;
  onTabChange?: (tab: AdminTab) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  admin,
  initialTab = 'overview',
  onLogout,
  onNavigatePublic,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global data states
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  // Sync tab with initialTab prop if it changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    if (onTabChange) {
      onTabChange(tab);
    } else {
      let targetPath = '/admin';
      if (tab !== 'overview') {
        targetPath = `/admin/${tab}`;
      }
      try {
        window.history.pushState({ page: 'admin-dashboard', adminTab: tab }, '', targetPath);
      } catch {}
    }
  };

  // Fetch initial data
  const fetchAnalytics = () => {
    fetch('/api/analytics/summary?range=30d')
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setAnalytics(data.summary);
      })
      .catch(() => {});
  };

  const fetchInquiries = () => {
    fetch('/api/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (data.inquiries) setInquiries(data.inquiries);
      })
      .catch(() => {});
  };

  const fetchCourses = () => {
    fetch('/api/courses?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          const mapped: Course[] = data.courses.map((c: any) => ({
            id: c.id,
            slug: c.id === 'nazra' ? 'quran-reading' : c.id === 'hifz' ? 'hifz-ul-quran' : c.id === 'translation' ? 'quran-translation' : c.id,
            name: c.title,
            category: c.category,
            shortDesc: c.short_description,
            detailedDesc: c.description,
            suitableLearners: c.suitable_for,
            iconName: c.icon,
            features: [],
            whatYouLearn: [],
            learningApproach: '',
            classFormat: '',
            benefits: [],
            faq: [],
            published: c.published,
            display_order: c.display_order,
            duration: c.duration,
            instructor: c.instructor,
            level: c.level,
            image_url: c.image_url
          }));
          setCourses(mapped);
        }
      })
      .catch(() => {});
  };

  const fetchAnnouncements = () => {
    fetch('/api/announcements?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements) setAnnouncements(data.announcements);
      })
      .catch(() => {});
  };

  const fetchSiteSettings = () => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSiteSettings(data.settings);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAnalytics();
    fetchInquiries();
    fetchCourses();
    fetchAnnouncements();
    fetchSiteSettings();
  }, []);

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'content', label: 'Courses & Content', icon: BookOpen, badge: courses.length },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquareQuote, badge: inquiries.filter((i) => i.status === 'New').length },
    { id: 'students', label: 'Students & Enrollments', icon: Users, badge: inquiries.filter((i) => i.status === 'Enrolled').length },
    { id: 'announcements', label: 'Announcements', icon: Bell, badge: announcements.filter((a) => a.published).length },
    { id: 'media', label: 'Media Assets', icon: Image },
    { id: 'settings', label: 'Admin Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#064E3B] hover:bg-neutral-100 lg:hidden cursor-pointer"
            aria-label="Open administration menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigatePublic('home')}
            className="flex items-center text-left cursor-pointer focus:outline-none"
          >
            <Logo variant="horizontal" size="sm" />
          </button>
        </div>

        {/* Right Top Status & Actions */}
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => onNavigatePublic('home')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-[#334155] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>View Live Website</span>
          </button>

          <div className="h-4 w-px bg-[#E2E8F0] hidden sm:block" />

          <div className="hidden md:flex items-center gap-2 text-right">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#64748B] font-medium truncate max-w-[140px]">{admin.email}</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-colors cursor-pointer"
            title="Log out of admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Dynamic Tab View */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="w-64 bg-white border-r border-[#E2E8F0] hidden lg:flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-3">
                Navigation Menu
              </span>
              <nav className="mt-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#064E3B] text-white shadow-xs'
                          : 'text-[#475569] hover:bg-[#FAF9F5] hover:text-[#064E3B]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-50 text-[#064E3B] border border-emerald-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer Link */}
          <div className="pt-4 border-t border-[#F1F5F9] space-y-2">
            <button
              type="button"
              onClick={() => onNavigatePublic('home')}
              className="w-full inline-flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#064E3B] hover:bg-[#FAF9F5] cursor-pointer"
            >
              <span>Return to Public Website</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <div className="px-3 text-[10px] text-[#94A3B8]">
              Tuhfat Al-Ilm Academy v2.4
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        <div
          className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
            mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileSidebarOpen(false)}
        />
        <aside
          className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col justify-between p-5 transform transition-transform duration-300 ease-out lg:hidden ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center">
                <Logo variant="horizontal" size="sm" />
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'text-[#475569] hover:bg-[#FAF9F5] hover:text-[#064E3B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-emerald-50 text-[#064E3B]'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
            <button
              type="button"
              onClick={() => onNavigatePublic('home')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#334155] cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* DYNAMIC CONTENT REGION */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <AdminOverviewView
                analytics={analytics}
                inquiries={inquiries}
                courses={courses}
                announcements={announcements}
                onNavigateTab={handleTabClick}
                onOpenCreateCourse={() => handleTabClick('content')}
                onOpenCreateAnnouncement={() => handleTabClick('announcements')}
              />
            )}

            {/* 2. Analytics */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard onNavigateTab={(t) => handleTabClick(t as AdminTab)} />
            )}

            {/* 3. Courses & Content */}
            {(activeTab === 'content' || activeTab === 'courses') && (
              <ContentManager
                courses={courses}
                siteSettings={siteSettings}
                onRefreshCourses={fetchCourses}
                onRefreshSettings={fetchSiteSettings}
              />
            )}

            {/* 4. Inquiries */}
            {activeTab === 'inquiries' && (
              <AdminInquiriesView
                inquiries={inquiries}
                courses={courses.map((c) => ({ id: c.id, name: c.name }))}
                onRefreshInquiries={fetchInquiries}
              />
            )}

            {/* 5. Students & Enrollments */}
            {activeTab === 'students' && (
              <AdminStudentsView
                courses={courses.map((c) => ({ id: c.id, name: c.name }))}
              />
            )}

            {/* 6. Announcements */}
            {activeTab === 'announcements' && (
              <AdminAnnouncementsView
                announcements={announcements}
                onRefreshAnnouncements={fetchAnnouncements}
              />
            )}

            {/* 7. Media */}
            {activeTab === 'media' && <AdminMediaView />}

            {/* 8. Settings */}
            {activeTab === 'settings' && (
              <AdminSettingsView adminEmail={admin.email} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

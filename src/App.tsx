import React, { useState, useEffect, useCallback } from 'react';
import { PageId, AdminTab, User, Course, AdminUser } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { TeachersPage } from './pages/TeachersPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { HealthPage } from './pages/HealthPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { useAuth } from './lib/AuthContext';
import { COURSES, getCourseBySlug } from './data/courses';
import { trackPageView } from './utils/analytics';

interface RouteState {
  page: PageId;
  courseSlug?: string;
  courseNameForContact?: string;
  adminTab?: AdminTab;
}

const BASE_PAGE_TITLES: Record<PageId, string> = {
  home: 'Tuhfat Al-Ilm Academy | Online Quran & Islamic Education',
  about: 'Tuhfat Al-Ilm Academy | About Us',
  courses: 'Tuhfat Al-Ilm Academy | Courses',
  'course-detail': 'Tuhfat Al-Ilm Academy | Course Details',
  teachers: 'Tuhfat Al-Ilm Academy | Our Qualified Teachers',
  'how-it-works': 'Tuhfat Al-Ilm Academy | How It Works',
  resources: 'Tuhfat Al-Ilm Academy | Learning Resources',
  faq: 'Tuhfat Al-Ilm Academy | FAQ',
  contact: 'Tuhfat Al-Ilm Academy | Contact & Enrollment',
  health: 'Tuhfat Al-Ilm Academy | System Health Status',
  'not-found': 'Tuhfat Al-Ilm Academy | Page Not Found',
  login: 'Tuhfat Al-Ilm Academy | Student Sign In',
  register: 'Tuhfat Al-Ilm Academy | Create Account',
  'admin-login': 'Tuhfat Al-Ilm Academy | Admin Portal',
  'admin-dashboard': 'Tuhfat Al-Ilm Academy | Admin Dashboard'
};

const PAGE_DESCRIPTIONS: Partial<Record<PageId, string>> = {
  home: 'Tuhfat Al-Ilm Academy provides accessible online Quran and Islamic education for children and adults around the world, including Nazra, Hifz, Tajweed, and Islamic studies.',
  about: 'Learn about Tuhfat Al-Ilm Academy, our qualified faculty, certified scholars, and structured online Quran teaching methodology.',
  courses: 'Explore our 9 online Quran and Islamic programs: Quran Reading / Nazra, Hifz-ul-Quran, Tajweed, Quran Translation, Islamic Studies, Basic Islamic Knowledge, Islah, Dua and Sunnah, and Children’s Islamic Education.',
  teachers: 'Meet our certified Huffaz, Qaris, and Islamic Scholars dedicated to structured 1-on-1 online teaching for children and adult learners.',
  'how-it-works': 'Discover our simple enrollment process: free trial class, schedule selection, personalized 1-on-1 tutoring, and regular progress tracking.',
  resources: 'Free Islamic and Quranic learning materials, Qaida pronunciation rules, Tajweed summary sheets, and authentic daily Adhkar.',
  faq: 'Frequently Asked Questions about class schedules, female instructors, child education, pricing, and 1-on-1 online Quran learning.',
  contact: 'Book a Free Trial Class or contact Tuhfat Al-Ilm Academy admissions via WhatsApp +923171503094, phone, email, or online form.',
  health: 'Live infrastructure health telemetry and database status for Tuhfat Al-Ilm Academy.',
  'not-found': 'The requested page could not be found. Explore our Quran and Islamic education programs at Tuhfat Al-Ilm Academy.'
};

function parseRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { page: 'home' };
  }

  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const rawHash = window.location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/+$/, '');

  // 1. Check path routing
  if (rawPath === '' || rawPath === '/') {
    // If path is root, check hash as fallback
    if (rawHash) {
      if (rawHash === 'about') return { page: 'about' };
      if (rawHash === 'courses') return { page: 'courses' };
      if (rawHash.startsWith('courses/')) {
        const slug = rawHash.replace('courses/', '');
        return { page: 'course-detail', courseSlug: slug };
      }
      if (rawHash === 'teachers') return { page: 'teachers' };
      if (rawHash === 'how-it-works') return { page: 'how-it-works' };
      if (rawHash === 'resources') return { page: 'resources' };
      if (rawHash === 'faq') return { page: 'faq' };
      if (rawHash === 'contact') return { page: 'contact' };
      if (rawHash === 'health') return { page: 'health' };
      if (rawHash === 'login') return { page: 'login' };
      if (rawHash === 'register') return { page: 'register' };
      if (rawHash === 'admin-login') return { page: 'admin-login' };
      if (rawHash === 'admin' || rawHash === 'admin-dashboard') return { page: 'admin-dashboard' };
      if (rawHash.startsWith('admin/')) {
        const tab = rawHash.replace('admin/', '') as AdminTab;
        return { page: 'admin-dashboard', adminTab: tab };
      }
    }
    return { page: 'home' };
  }

  if (rawPath === '/about') return { page: 'about' };
  if (rawPath === '/courses') return { page: 'courses' };
  if (rawPath.startsWith('/courses/')) {
    const slug = rawPath.replace('/courses/', '');
    return { page: 'course-detail', courseSlug: slug };
  }
  if (rawPath === '/teachers') return { page: 'teachers' };
  if (rawPath === '/how-it-works') return { page: 'how-it-works' };
  if (rawPath === '/resources') return { page: 'resources' };
  if (rawPath === '/faq') return { page: 'faq' };
  if (rawPath === '/contact') return { page: 'contact' };
  if (rawPath === '/health') return { page: 'health' };
  if (rawPath === '/login') return { page: 'login' };
  if (rawPath === '/register') return { page: 'register' };
  if (rawPath === '/admin-login' || rawPath === '/admin/login') return { page: 'admin-login' };
  if (rawPath === '/admin' || rawPath === '/admin-dashboard') return { page: 'admin-dashboard' };
  if (rawPath.startsWith('/admin/')) {
    const tab = rawPath.replace('/admin/', '') as AdminTab;
    return { page: 'admin-dashboard', adminTab: tab };
  }

  return { page: 'not-found' };
}

export default function App() {
  const { adminUser, currentUser, isAdmin, adminSignOut, userSignOut } = useAuth();
  const [route, setRoute] = useState<RouteState>(parseRouteFromLocation);

  // Sync route on popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRouteFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title, metadata, canonical URL, and track page views
  useEffect(() => {
    let title = BASE_PAGE_TITLES[route.page] || BASE_PAGE_TITLES.home;
    let description = PAGE_DESCRIPTIONS[route.page] || PAGE_DESCRIPTIONS.home;
    let canonicalPath = route.page === 'home' ? '/' : `/${route.page}`;

    if (route.page === 'course-detail' && route.courseSlug) {
      const course = getCourseBySlug(route.courseSlug);
      if (course) {
        title = `Tuhfat Al-Ilm Academy | ${course.name}`;
        description = course.shortDesc;
        canonicalPath = `/courses/${course.slug}`;
      }
    } else if (route.page === 'admin-dashboard') {
      title = 'Tuhfat Al-Ilm Academy | Admin Dashboard';
      canonicalPath = route.adminTab ? `/admin/${route.adminTab}` : '/admin';
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description || '');

    const fullCanonicalUrl = `https://tuhfatalilm.online${canonicalPath}`;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', fullCanonicalUrl);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title || '');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || '');

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonicalUrl);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!route.page.startsWith('admin-') && route.page !== 'admin-dashboard') {
      trackPageView(canonicalPath);
    }
  }, [route]);

  const navigateTo = useCallback((page: PageId, courseSlugOrName?: string, extraParam?: string) => {
    let nextPath = '/';
    const nextRoute: RouteState = { page };

    if (page === 'home') {
      nextPath = '/';
    } else if (page === 'course-detail' && courseSlugOrName) {
      nextPath = `/courses/${courseSlugOrName}`;
      nextRoute.courseSlug = courseSlugOrName;
    } else if (page === 'contact' && courseSlugOrName) {
      nextPath = '/contact';
      nextRoute.courseNameForContact = courseSlugOrName;
    } else if (page === 'admin-dashboard') {
      const tab = (courseSlugOrName as AdminTab) || 'overview';
      nextPath = tab === 'overview' ? '/admin' : `/admin/${tab}`;
      nextRoute.adminTab = tab;
    } else {
      nextPath = `/${page}`;
    }

    try {
      window.history.pushState(null, '', nextPath);
    } catch {}

    setRoute(nextRoute);
  }, []);

  const handleAdminLoginSuccess = useCallback((admin: AdminUser) => {
    navigateTo('admin-dashboard');
  }, [navigateTo]);

  const handleUserAuthSuccess = useCallback((user: User) => {
    if (user.role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('home');
    }
  }, [navigateTo]);

  // Render Admin Dashboard view
  if (route.page === 'admin-dashboard') {
    if (isAdmin && adminUser) {
      return (
        <AdminDashboardPage
          admin={adminUser}
          initialTab={route.adminTab || 'overview'}
          onLogout={adminSignOut}
          onNavigatePublic={navigateTo}
          onTabChange={(tab) => {
            const nextPath = tab === 'overview' ? '/admin' : `/admin/${tab}`;
            try {
              window.history.pushState(null, '', nextPath);
            } catch {}
            setRoute({ page: 'admin-dashboard', adminTab: tab });
          }}
        />
      );
    }

    // If not authenticated as admin, show Admin Login Portal
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
        <Header currentPage="admin-login" currentUser={currentUser} onNavigate={navigateTo} onLogout={userSignOut} />
        <main className="flex-grow">
          <AdminLoginPage
            onLoginSuccess={handleAdminLoginSuccess}
            onNavigate={navigateTo}
          />
        </main>
        <Footer onNavigate={navigateTo} />
      </div>
    );
  }

  // Render normal pages
  const renderContent = () => {
    switch (route.page) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'courses':
        return <CoursesPage onNavigate={navigateTo} />;
      case 'course-detail': {
        const selectedCourse = (route.courseSlug ? getCourseBySlug(route.courseSlug) : null) || COURSES[0];
        return <CourseDetailPage course={selectedCourse} onNavigate={navigateTo} />;
      }
      case 'teachers':
        return <TeachersPage onNavigate={navigateTo} />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'resources':
        return <ResourcesPage onNavigate={navigateTo} />;
      case 'faq':
        return <FaqPage />;
      case 'contact':
        return <ContactPage />;
      case 'health':
        return <HealthPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage initialMode="login" onAuthSuccess={handleUserAuthSuccess} onNavigate={navigateTo} />;
      case 'register':
        return <LoginPage initialMode="register" onAuthSuccess={handleUserAuthSuccess} onNavigate={navigateTo} />;
      case 'admin-login':
        return <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} onNavigate={navigateTo} />;
      case 'not-found':
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1E2320]">
      <Header
        currentPage={route.page}
        currentUser={currentUser}
        onNavigate={navigateTo}
        onLogout={userSignOut}
      />
      <main id="main-content" className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

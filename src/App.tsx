import React, { useState, useEffect, useCallback } from 'react';
import { PageId, AdminTab, User, Course, AdminUser } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { useAuth } from './lib/AuthContext';
import { COURSES, getCourseBySlug } from './data/courses';
import { trackPageView } from './utils/analytics';
import { WelcomeScreen } from './components/WelcomeScreen';

// Code-split subpages and admin bundle so initial load is ultra-fast
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const CoursesPage = React.lazy(() => import('./pages/CoursesPage').then(m => ({ default: m.CoursesPage })));
const CourseDetailPage = React.lazy(() => import('./pages/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })));
const TeachersPage = React.lazy(() => import('./pages/TeachersPage').then(m => ({ default: m.TeachersPage })));
const HowItWorksPage = React.lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const ResourcesPage = React.lazy(() => import('./pages/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const FaqPage = React.lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const HealthPage = React.lazy(() => import('./pages/HealthPage').then(m => ({ default: m.HealthPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const AdminLoginPage = React.lazy(() => import('./admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = React.lazy(() => import('./admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

interface RouteState {
  page: PageId;
  courseSlug?: string;
  courseNameForContact?: string;
  adminTab?: AdminTab;
}

const COURSE_SEO_TITLES: Record<string, string> = {
  'quran-reading': 'Online Quran Reading & Nazra Classes | Tuhfat Al-Ilm Academy',
  'tajweed': 'Online Quran Tajweed Classes | Tuhfat Al-Ilm Academy',
  'hifz-ul-quran': 'Online Quran Memorization (Hifz) Classes | Tuhfat Al-Ilm Academy',
  'quran-translation': 'Online Quran Translation & Tafseer Course | Tuhfat Al-Ilm Academy',
  'islamic-studies': 'Comprehensive Online Islamic Studies Course | Tuhfat Al-Ilm Academy',
  'basic-islamic-knowledge': 'Learn Namaz & Basic Islamic Knowledge Online | Tuhfat Al-Ilm Academy',
  'islah-character-development': 'Islamic Character & Moral Ethics Course | Tuhfat Al-Ilm Academy',
  'dua-and-sunnah': 'Daily Masnoon Duas & Sunnah Course Online | Tuhfat Al-Ilm Academy',
  'childrens-islamic-education': 'Online Quran & Islamic Classes for Kids | Tuhfat Al-Ilm Academy'
};

const LEGACY_COURSE_SLUGS: Record<string, string> = {
  nazra: 'quran-reading',
  hifz: 'hifz-ul-quran',
  translation: 'quran-translation',
  'basic-knowledge': 'basic-islamic-knowledge',
  islah: 'islah-character-development',
  'dua-sunnah': 'dua-and-sunnah',
  children: 'childrens-islamic-education'
};

const BASE_PAGE_TITLES: Record<PageId, string> = {
  home: 'Tuhfat Al-Ilm Academy | Online Quran & Islamic Classes',
  about: 'About Us | Tuhfat Al-Ilm Academy',
  courses: 'Online Quran Courses & Islamic Curriculum | Tuhfat Al-Ilm Academy',
  'course-detail': 'Course Details | Tuhfat Al-Ilm Academy',
  teachers: 'Certified Online Quran Teachers & Scholars | Tuhfat Al-Ilm Academy',
  'how-it-works': 'How Online Quran Classes Work | Tuhfat Al-Ilm Academy',
  resources: 'Free Islamic & Quran Learning Resources | Tuhfat Al-Ilm Academy',
  faq: 'Online Quran Classes FAQ | Tuhfat Al-Ilm Academy',
  contact: 'Book Free Trial Class & Contact Admissions | Tuhfat Al-Ilm Academy',
  health: 'Tuhfat Al-Ilm Academy | System Health Status',
  'not-found': 'Page Not Found | Tuhfat Al-Ilm Academy',
  login: 'Student Sign In | Tuhfat Al-Ilm Academy',
  register: 'Create Student Account | Tuhfat Al-Ilm Academy',
  'admin-login': 'Admin Portal | Tuhfat Al-Ilm Academy',
  'admin-dashboard': 'Admin Dashboard | Tuhfat Al-Ilm Academy'
};

const PAGE_DESCRIPTIONS: Partial<Record<PageId, string>> = {
  home: 'Tuhfat Al-Ilm Academy provides accessible online Quran and Islamic education worldwide for children and adults, including Nazra, Hifz, Tajweed, and Islamic studies.',
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
        let slug = rawHash.replace('courses/', '');
        if (LEGACY_COURSE_SLUGS[slug]) slug = LEGACY_COURSE_SLUGS[slug];
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
    let slug = rawPath.replace('/courses/', '');
    if (LEGACY_COURSE_SLUGS[slug]) slug = LEGACY_COURSE_SLUGS[slug];
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
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isDirectAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/health');
    if (isDirectAdmin) return false;
    return true;
  });

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
        title = COURSE_SEO_TITLES[course.slug] || `${course.name} | Tuhfat Al-Ilm Academy`;
        description = course.shortDesc;
        canonicalPath = `/courses/${course.slug}`;
      }
    } else if (route.page === 'admin-dashboard') {
      title = 'Admin Dashboard | Tuhfat Al-Ilm Academy';
      canonicalPath = route.adminTab ? `/admin/${route.adminTab}` : '/admin';
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description || '');

    const fullCanonicalUrl = `https://tuhfatalilm.online${canonicalPath}`;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', fullCanonicalUrl);

    // Robots directive: noindex for admin/health routes; index & follow for all public learning pages
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    if (route.page.startsWith('admin-') || route.page === 'admin-dashboard' || route.page === 'health') {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title || '');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || '');

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonicalUrl);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title || '');

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description || '');

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

  const renderSuspenseFallback = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-3 border-[#064E3B] border-t-transparent animate-spin" />
    </div>
  );

  // Render Admin Dashboard view
  if (route.page === 'admin-dashboard') {
    if (isAdmin && adminUser) {
      return (
        <React.Suspense fallback={renderSuspenseFallback()}>
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
        </React.Suspense>
      );
    }

    // If not authenticated as admin, show Admin Login Portal
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
        <Header currentPage="admin-login" currentUser={currentUser} onNavigate={navigateTo} onLogout={userSignOut} />
        <main className="flex-grow">
          <React.Suspense fallback={renderSuspenseFallback()}>
            <AdminLoginPage
              onLoginSuccess={handleAdminLoginSuccess}
              onNavigate={navigateTo}
            />
          </React.Suspense>
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
        return <ContactPage initialCourse={route.courseNameForContact} onNavigate={navigateTo} />;
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
      {showWelcome && (
        <WelcomeScreen onFinish={() => setShowWelcome(false)} />
      )}
      <Header
        currentPage={route.page}
        currentUser={currentUser}
        onNavigate={navigateTo}
        onLogout={userSignOut}
      />
      <main id="main-content" className="flex-grow">
        <React.Suspense fallback={renderSuspenseFallback()}>
          {renderContent()}
        </React.Suspense>
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

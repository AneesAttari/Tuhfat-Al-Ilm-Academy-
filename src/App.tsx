import React, { useState, useEffect, useCallback } from 'react';
import { PageId, AdminUser, User, Course } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { COURSES, getCourseBySlug } from './data/courses';
import { MessageCircle } from 'lucide-react';
import { trackPageView, trackEvent } from './utils/analytics';

const BASE_PAGE_TITLES: Record<PageId, string> = {
  home: 'Tuhfat Al-Ilm Academy | Online Quran & Islamic Education',
  about: 'Tuhfat Al-Ilm Academy | About Us',
  courses: 'Tuhfat Al-Ilm Academy | Courses',
  'course-detail': 'Tuhfat Al-Ilm Academy | Course Details',
  'how-it-works': 'Tuhfat Al-Ilm Academy | How It Works',
  faq: 'Tuhfat Al-Ilm Academy | FAQ',
  contact: 'Tuhfat Al-Ilm Academy | Contact & Enrollment',
  login: 'Tuhfat Al-Ilm Academy | Student Sign In',
  register: 'Tuhfat Al-Ilm Academy | Create Account',
  'admin-login': 'Tuhfat Al-Ilm Academy | Admin Portal',
  'admin-dashboard': 'Tuhfat Al-Ilm Academy | Admin Dashboard'
};

interface RouteState {
  page: PageId;
  courseSlug?: string;
  courseNameForContact?: string;
}

const parseRouteFromLocation = (): RouteState => {
  if (typeof window === 'undefined') {
    return { page: 'home' };
  }

  // First check hash (e.g. #/courses/quran-reading, #login, or #about)
  let raw = window.location.pathname;
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash && (hash.startsWith('/') || hash.includes('/'))) {
    raw = '/' + hash.replace(/^\//, '');
  } else if (hash) {
    if (hash === 'about') return { page: 'about' };
    if (hash === 'courses') return { page: 'courses' };
    if (hash === 'how-it-works') return { page: 'how-it-works' };
    if (hash === 'faq') return { page: 'faq' };
    if (hash === 'contact' || hash === 'enroll') return { page: 'contact' };
    if (hash === 'login' || hash === 'signin') return { page: 'login' };
    if (hash === 'register' || hash === 'signup') return { page: 'register' };
    if (hash === 'admin/login' || hash === 'admin-login') return { page: 'admin-login' };
    if (hash === 'admin/dashboard' || hash === 'admin-dashboard' || hash === 'admin') return { page: 'admin-dashboard' };
  }

  // Normalize pathname: remove leading & trailing slashes, remove .html
  const cleanPath = raw
    .toLowerCase()
    .replace(/\.html$/, '')
    .replace(/^\/+|\/+$/g, '')
    .trim();

  // Root URL "/" MUST strictly resolve to HOME
  if (!cleanPath || cleanPath === '' || cleanPath === 'index') {
    return { page: 'home' };
  }

  // User auth routes
  if (cleanPath === 'login' || cleanPath === 'signin') {
    return { page: 'login' };
  }
  if (cleanPath === 'register' || cleanPath === 'signup') {
    return { page: 'register' };
  }

  // Admin routes
  if (cleanPath === 'admin/login' || cleanPath === 'admin-login') {
    return { page: 'admin-login' };
  }
  if (cleanPath === 'admin/dashboard' || cleanPath === 'admin-dashboard' || cleanPath === 'admin') {
    return { page: 'admin-dashboard' };
  }

  // Direct Course Detail routes: /courses/[slug] or /courses/[id]
  if (cleanPath.startsWith('courses/')) {
    const slugPart = cleanPath.substring('courses/'.length).trim();
    if (slugPart) {
      const foundCourse = getCourseBySlug(slugPart);
      if (foundCourse) {
        return { page: 'course-detail', courseSlug: foundCourse.slug };
      }
    }
    return { page: 'courses' };
  }

  // Top level pages
  if (cleanPath === 'courses') return { page: 'courses' };
  if (cleanPath === 'about') return { page: 'about' };
  if (cleanPath === 'how-it-works') return { page: 'how-it-works' };
  if (cleanPath === 'faq') return { page: 'faq' };
  if (cleanPath === 'contact' || cleanPath === 'enroll') return { page: 'contact' };

  // Strict fallback to HOME
  return { page: 'home' };
};

export default function App() {
  const [route, setRoute] = useState<RouteState>(parseRouteFromLocation());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [dbCourses, setDbCourses] = useState<Course[]>(COURSES);

  // Check persistent student user session on startup
  useEffect(() => {
    fetch('/api/user/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          if (data.user.role === 'admin') {
            setAdminUser({ id: data.user.id, email: data.user.email });
          }
        }
      })
      .catch(() => {});

    // Fetch dynamic courses
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setDbCourses(data.courses);
        }
      })
      .catch(() => {});
  }, []);

  // Sync document title and scroll to top whenever route changes
  useEffect(() => {
    let title = BASE_PAGE_TITLES[route.page] || BASE_PAGE_TITLES.home;

    if (route.page === 'course-detail' && route.courseSlug) {
      const course = dbCourses.find(c => c.slug === route.courseSlug || c.id === route.courseSlug) || getCourseBySlug(route.courseSlug);
      if (course) {
        title = `Tuhfat Al-Ilm Academy | ${course.name}`;
      }
    }

    document.title = title;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track public page views
    if (!route.page.startsWith('admin-')) {
      let publicPath = '/';
      if (route.page === 'course-detail' && route.courseSlug) {
        publicPath = `/courses/${route.courseSlug}`;
      } else if (route.page !== 'home') {
        publicPath = `/${route.page}`;
      }
      trackPageView(publicPath);
    }
  }, [route, dbCourses]);

  // Handle browser back and forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRouteFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check admin session status when visiting admin pages
  useEffect(() => {
    if (route.page === 'admin-dashboard' && !adminUser) {
      fetch('/api/auth/session')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.admin) {
            setAdminUser(data.admin);
          } else {
            navigateTo('admin-login');
          }
        })
        .catch(() => {
          navigateTo('admin-login');
        });
    }
  }, [route.page, adminUser]);

  const navigateTo = useCallback((page: PageId, courseSlugOrName?: string) => {
    let nextRoute: RouteState = { page };
    let targetPath = '/';

    if (page === 'home') {
      targetPath = '/';
      nextRoute = { page: 'home' };
    } else if (page === 'course-detail' && courseSlugOrName) {
      const course = getCourseBySlug(courseSlugOrName);
      if (course) {
        targetPath = `/courses/${course.slug}`;
        nextRoute = { page: 'course-detail', courseSlug: course.slug };
      } else {
        targetPath = '/courses';
        nextRoute = { page: 'courses' };
      }
    } else if (page === 'courses') {
      targetPath = '/courses';
      nextRoute = { page: 'courses' };
    } else if (page === 'about') {
      targetPath = '/about';
      nextRoute = { page: 'about' };
    } else if (page === 'how-it-works') {
      targetPath = '/how-it-works';
      nextRoute = { page: 'how-it-works' };
    } else if (page === 'faq') {
      targetPath = '/faq';
      nextRoute = { page: 'faq' };
    } else if (page === 'contact') {
      targetPath = '/contact';
      nextRoute = { page: 'contact', courseNameForContact: courseSlugOrName };
    } else if (page === 'login') {
      targetPath = '/login';
      nextRoute = { page: 'login' };
    } else if (page === 'register') {
      targetPath = '/register';
      nextRoute = { page: 'register' };
    } else if (page === 'admin-login') {
      targetPath = '/admin/login';
      nextRoute = { page: 'admin-login' };
    } else if (page === 'admin-dashboard') {
      targetPath = '/admin/dashboard';
      nextRoute = { page: 'admin-dashboard' };
    }

    setRoute(nextRoute);

    try {
      window.history.pushState(nextRoute, '', targetPath);
    } catch {
      window.location.hash = targetPath;
    }
  }, []);

  const handleUserLogout = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST' });
    } catch {}
    setCurrentUser(null);
    navigateTo('home');
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setAdminUser(null);
    navigateTo('admin-login');
  };

  const isAdminPage = route.page === 'admin-login' || route.page === 'admin-dashboard';
  const currentCourse = route.page === 'course-detail' && route.courseSlug
    ? (dbCourses.find(c => c.slug === route.courseSlug || c.id === route.courseSlug) || getCourseBySlug(route.courseSlug))
    : null;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2320] flex flex-col font-sans selection:bg-[#064E3B] selection:text-white">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#064E3B] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Main Public Header (Omitted on admin pages) */}
      {!isAdminPage && (
        <Header
          currentPage={route.page}
          currentUser={currentUser}
          onNavigate={(p) => navigateTo(p)}
          onLogout={handleUserLogout}
        />
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-grow flex flex-col">
        {/* 1. PUBLIC HOME PAGE */}
        {route.page === 'home' && <HomePage onNavigate={navigateTo} />}

        {/* 2. PUBLIC ABOUT PAGE */}
        {route.page === 'about' && <AboutPage onNavigate={navigateTo} />}

        {/* 3. PUBLIC ALL COURSES DIRECTORY */}
        {route.page === 'courses' && <CoursesPage onNavigate={navigateTo} />}

        {/* 4. DEDICATED INDIVIDUAL COURSE DETAIL PAGE */}
        {route.page === 'course-detail' && currentCourse && (
          <CourseDetailPage course={currentCourse} onNavigate={navigateTo} />
        )}

        {/* Fallback if course detail accessed with invalid slug */}
        {route.page === 'course-detail' && !currentCourse && (
          <CoursesPage onNavigate={navigateTo} />
        )}

        {/* 5. PUBLIC HOW IT WORKS PAGE */}
        {route.page === 'how-it-works' && <HowItWorksPage onNavigate={navigateTo} />}

        {/* 6. PUBLIC FAQ PAGE */}
        {route.page === 'faq' && <FaqPage onNavigate={navigateTo} />}

        {/* 7. PUBLIC CONTACT / ENROLLMENT PAGE */}
        {route.page === 'contact' && (
          <ContactPage initialCourse={route.courseNameForContact} />
        )}

        {/* 8. NORMAL USER LOGIN / REGISTRATION PAGE */}
        {(route.page === 'login' || route.page === 'register') && (
          <LoginPage
            initialMode={route.page === 'register' ? 'register' : 'login'}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'admin') {
                setAdminUser({ id: user.id, email: user.email });
              }
            }}
            onNavigate={navigateTo}
          />
        )}

        {/* 9. PRIVATE ADMIN LOGIN */}
        {route.page === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={(admin) => {
              setAdminUser(admin);
              navigateTo('admin-dashboard');
            }}
            onNavigate={navigateTo}
          />
        )}

        {/* 10. PRIVATE ADMIN DASHBOARD */}
        {route.page === 'admin-dashboard' && (
          adminUser ? (
            <AdminDashboardPage
              admin={adminUser}
              onLogout={handleAdminLogout}
              onNavigatePublic={navigateTo}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 bg-[#F4F1EA]">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#64748B]">Verifying administrator session...</p>
              </div>
            </div>
          )
        )}
      </main>

      {/* Public Footer (Omitted on admin pages) */}
      {!isAdminPage && <Footer onNavigate={navigateTo} />}

      {/* Floating WhatsApp Quick Action Button on Public Pages */}
      {!isAdminPage && (
        <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-5 right-5 z-30">
          <a
            href="https://wa.me/923171503094"
            onClick={() => trackEvent('whatsapp_click', { page: 'floating_button' })}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#059669] focus:ring-offset-2 group cursor-pointer"
            aria-label="Chat on WhatsApp with Tuhfat Al-Ilm Academy"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-xs font-semibold hidden sm:inline">Chat on WhatsApp</span>
          </a>
        </aside>
      )}
    </div>
  );
}


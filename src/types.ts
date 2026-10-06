export type PageId =
  | 'home'
  | 'about'
  | 'courses'
  | 'course-detail'
  | 'how-it-works'
  | 'faq'
  | 'contact'
  | 'login'
  | 'register'
  | 'admin-login'
  | 'admin-dashboard';

export type AdminTab =
  | 'overview'
  | 'analytics'
  | 'content'
  | 'courses'
  | 'inquiries'
  | 'students'
  | 'announcements'
  | 'media'
  | 'settings';

export interface CourseFaq {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDesc: string;
  detailedDesc: string;
  suitableLearners: string;
  iconName: string;
  features: string[];
  whatYouLearn: string[];
  learningApproach: string;
  classFormat: string;
  benefits: string[];
  faq: CourseFaq[];
  published?: number | boolean;
  display_order?: number;
  duration?: string;
  instructor?: string;
  level?: string;
  image_url?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  status: 'New' | 'Contacted' | 'Pending' | 'In Progress' | 'Enrolled' | 'Completed' | 'Closed' | 'Archived';
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolled_course: string;
  status: string;
  source?: string;
  notes?: string;
  enrolled_date: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  short_text: string;
  full_text: string;
  published: number;
  created_at: string;
  updated_at: string;
}

export interface TimeSeriesPoint {
  date: string;
  visitors: number;
  inquiries: number;
  enrollments: number;
}

export interface TrafficSourcePoint {
  name: string;
  value: number;
  percentage: number;
  fill?: string;
}

export interface CoursePopularityPoint {
  course: string;
  inquiries: number;
  views: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'inquiry' | 'enrollment' | 'course' | 'content' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalInquiries: number;
  newInquiries: number;
  pendingInquiries: number;
  confirmedEnrollments: number;
  totalStudents: number;
  totalCourses: number;
  publishedCourses: number;
  pageViews: number;
  visitors: number;
  whatsappClicks: number;
  phoneClicks: number;
  smsClicks: number;
  emailClicks: number;
  courseClicks: number;
  formSubmissions: number;
  conversionRate: number;
  trafficOverTime?: TimeSeriesPoint[];
  trafficSources?: TrafficSourcePoint[];
  coursePopularity?: CoursePopularityPoint[];
  recentActivity?: RecentActivityItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  status?: 'active' | 'inactive' | 'suspended' | string;
  phone?: string;
  auth_provider: 'local' | 'google';
  created_at?: string;
  updated_at?: string;
  enrolled_count?: number;
  inquiries_count?: number;
}

export interface AdminUser {
  id: string;
  email: string;
}

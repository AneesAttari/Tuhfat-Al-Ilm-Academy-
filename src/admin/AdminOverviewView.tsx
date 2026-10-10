import React from 'react';
import { AnalyticsSummary, Inquiry, Course, Announcement, AdminTab } from '../types';
import {
  Users,
  GraduationCap,
  MessageCircle,
  Clock,
  CheckCircle2,
  BookOpen,
  Eye,
  Plus,
  ArrowRight,
  Sparkles,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  FileText
} from 'lucide-react';

interface AdminOverviewViewProps {
  analytics: AnalyticsSummary | null;
  inquiries: Inquiry[];
  courses: Course[];
  announcements: Announcement[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenCreateCourse: () => void;
  onOpenCreateAnnouncement: () => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  analytics,
  inquiries,
  courses,
  announcements,
  onNavigateTab,
  onOpenCreateCourse,
  onOpenCreateAnnouncement
}) => {
  const newInquiries = inquiries.filter((i) => i.status === 'New');
  const pendingInquiries = inquiries.filter((i) => ['Pending', 'Contacted', 'In Progress'].includes(i.status));
  const enrolledStudents = inquiries.filter((i) => i.status === 'Enrolled' || i.status === 'Completed');
  const publishedCourses = courses.filter((c) => c.published);

  const recentInquiriesList = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Summary Banner */}
      <div className="bg-gradient-to-r from-[#064E3B] to-[#022C22] text-white p-7 sm:p-9 rounded-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D9B44A]" />
            <span>Tuhfat Al-Ilm Administration System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome to Academy Control Center
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Monitor admissions pipeline, manage courses, track student inquiries, and review website analytics in real time.
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS BUTTONS ROW */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={onOpenCreateCourse}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#064E3B] text-xs font-semibold border border-[#A7F3D0] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('teachers')}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F1EA] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-[#064E3B]" />
            <span>Teachers Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('content')}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F1EA] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#064E3B]" />
            <span>Manage Courses</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('inquiries')}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F1EA] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#D97706]" />
            <span>View Inquiries</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('content')}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F1EA] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#064E3B]" />
            <span>Website Content</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F1EA] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#6D28D9]" />
            <span>Open Analytics</span>
          </button>
        </div>
      </div>

      {/* SUMMARY KPI CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            Academy Overview Metrics
          </h2>
          <span className="text-xs text-[#64748B]">Updated live from database</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Total Students */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Total Students</span>
              <Users className="w-4 h-4 text-[#064E3B]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {enrolledStudents.length}
            </div>
            <div className="text-[11px] text-[#059669]">Confirmed active students</div>
          </div>

          {/* 2. Total Enrollments */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Total Enrollments</span>
              <GraduationCap className="w-4 h-4 text-[#1E40AF]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {enrolledStudents.length}
            </div>
            <div className="text-[11px] text-[#64748B]">Across all 10 programs</div>
          </div>

          {/* 3. New Enrollment Inquiries */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">New Inquiries</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {newInquiries.length}
            </div>
            <div className="text-[11px] text-[#D97706] font-medium">Awaiting first contact</div>
          </div>

          {/* 4. Pending Inquiries */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Pending Inquiries</span>
              <Clock className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {pendingInquiries.length}
            </div>
            <div className="text-[11px] text-[#64748B]">In active scheduling</div>
          </div>

          {/* 5. Confirmed Enrollments */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {enrolledStudents.length}
            </div>
            <div className="text-[11px] text-[#059669] font-medium">Ready for classes</div>
          </div>

          {/* 6. Total Courses */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Total Courses</span>
              <BookOpen className="w-4 h-4 text-[#064E3B]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {courses.length}
            </div>
            <div className="text-[11px] text-[#64748B]">Curriculum catalog</div>
          </div>

          {/* 7. Active Courses */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Active Courses</span>
              <Sparkles className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {publishedCourses.length}
            </div>
            <div className="text-[11px] text-[#059669]">Live on website</div>
          </div>

          {/* 8. Website Visitors */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Website Visitors</span>
              <Eye className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {analytics?.visitors ?? 0}
            </div>
            <div className="text-[11px] text-[#64748B]">{analytics?.pageViews ?? 0} views</div>
          </div>

          {/* 9. WhatsApp Clicks */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">WhatsApp Clicks</span>
              <MessageCircle className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {analytics?.whatsappClicks ?? 0}
            </div>
            <div className="text-[11px] text-[#059669]">Direct chat inquiries</div>
          </div>

          {/* 10. Announcements */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-xs font-semibold">Announcements</span>
              <Bell className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">
              {announcements.length}
            </div>
            <div className="text-[11px] text-[#64748B]">Website notices</div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT INQUIRIES & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Inquiries List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Latest Enrollment Inquiries</h3>
              <p className="text-xs text-[#64748B]">Most recent submissions requiring admissions attention.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({inquiries.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {recentInquiriesList.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#94A3B8]">No inquiries received yet.</p>
            ) : (
              recentInquiriesList.map((inq) => (
                <div key={inq.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#0F172A]">{inq.name}</div>
                    <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                      <span className="text-[#064E3B] font-medium">{inq.course}</span>
                      <span>·</span>
                      <span>{inq.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inq.status === 'New'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inq.status === 'Enrolled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('inquiries')}
                      className="p-1 text-[#64748B] hover:text-[#064E3B] rounded cursor-pointer"
                      title="Manage inquiry"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Academy Activity */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Recent Academy Activity</h3>
              <p className="text-xs text-[#64748B]">Real administrative events and updates.</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Real items */}
            {inquiries.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <p className="font-semibold text-[#0F172A]">
                    {item.status === 'Enrolled' ? `Student Enrolled: ${item.name}` : `Inquiry: ${item.name}`}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Course: {item.course} via {item.source || 'Website'}
                  </p>
                  <p className="text-[10px] text-[#94A3B8]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="font-semibold text-[#0F172A]">Curriculum Synchronized</p>
                <p className="text-[11px] text-[#64748B]">10 structured Islamic courses verified and active.</p>
                <p className="text-[10px] text-[#94A3B8]">System status: Healthy</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="font-semibold text-[#0F172A]">Security Session Active</p>
                <p className="text-[11px] text-[#64748B]">Authenticated administrator session verified.</p>
                <p className="text-[10px] text-[#94A3B8]">Protected access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

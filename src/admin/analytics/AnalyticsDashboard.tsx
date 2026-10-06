import React, { useState, useEffect } from 'react';
import { AnalyticsSummary, TimeSeriesPoint, TrafficSourcePoint, CoursePopularityPoint } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Phone,
  Calendar,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface AnalyticsDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  const fetchAnalytics = async (range: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/summary?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        if (json.summary) {
          setData(json.summary);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange]);

  const trafficData: TimeSeriesPoint[] = data?.trafficOverTime || [];
  const sourceData: TrafficSourcePoint[] = data?.trafficSources || [];
  const courseData: CoursePopularityPoint[] = data?.coursePopularity || [];

  return (
    <div className="space-y-8">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
            Academy Intelligence
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-0.5 tracking-tight">
            Analytics &amp; Engagement Insights
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Real visitor activity, inquiry pipeline conversion, and course popularity metrics.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF9F5] border border-[#E2E8F0] rounded-xl text-xs font-semibold">
          {(['today', '7d', '30d', '90d', 'all'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === r
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#064E3B] hover:bg-white/80'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => fetchAnalytics(timeRange)}
            className="p-1.5 text-[#64748B] hover:text-[#064E3B] rounded-lg transition-colors cursor-pointer"
            title="Refresh analytics data"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            {data?.visitors ?? 0}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#059669]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{data?.pageViews ?? 0} total pageviews</span>
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">New Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            {data?.newInquiries ?? 0}
          </div>
          <div className="text-[11px] text-[#64748B]">
            <span>{data?.totalInquiries ?? 0} total inquiries captured</span>
          </div>
        </div>

        {/* Confirmed Enrollments */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            {data?.confirmedEnrollments ?? 0}
          </div>
          <div className="text-[11px] text-[#059669] font-medium">
            <span>{data?.pendingInquiries ?? 0} currently pending</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            {data?.conversionRate ?? 0}%
          </div>
          <div className="text-[11px] text-[#64748B]">
            <span>Inquiry to enrollment ratio</span>
          </div>
        </div>
      </div>

      {/* Main Charts: 1. Traffic & Inquiries Over Time */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              Traffic &amp; Inquiries Trend Over Time
            </h2>
            <p className="text-xs text-[#64748B]">
              Daily pageviews compared against new student inquiry submissions.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-[#064E3B]">
              <span className="w-3 h-3 rounded-full bg-[#064E3B]" /> Visitors
            </span>
            <span className="flex items-center gap-1.5 text-[#D97706]">
              <span className="w-3 h-3 rounded-full bg-[#D97706]" /> Inquiries
            </span>
            <span className="flex items-center gap-1.5 text-[#059669]">
              <span className="w-3 h-3 rounded-full bg-[#059669]" /> Enrollments
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#064E3B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#064E3B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#064E3B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
              <Area type="monotone" dataKey="inquiries" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorInquiries)" name="Inquiries" />
              <Area type="monotone" dataKey="enrollments" stroke="#059669" strokeWidth={2} fillOpacity={0} name="Enrollments" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Grid: Course Popularity & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Course Interest Breakdown (Horizontal Bar) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              Course Inquiries &amp; Interest Distribution
            </h2>
            <p className="text-xs text-[#64748B]">
              Number of student leads generated per individual course program.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="course" type="category" width={140} stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="inquiries" fill="#064E3B" radius={[0, 6, 6, 0]} name="Inquiries" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Traffic Sources (Donut Chart) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              Traffic Sources Breakdown
            </h2>
            <p className="text-xs text-[#64748B]">
              Origins of visitors finding Tuhfat Al-Ilm Academy.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || '#064E3B'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sources Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1F5F9] text-xs">
            {sourceData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                <span className="text-[#334155] font-medium truncate">{s.name}</span>
                <span className="text-[#64748B] font-mono ml-auto">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

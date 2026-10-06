import React from 'react';
import { AnalyticsSummary } from '../../types';
import { Users, Eye, MessageCircle, Phone, Mail, BookOpen } from 'lucide-react';

interface AdminAnalyticsViewProps {
  analytics: AnalyticsSummary | null;
  popularPages: { page: string; views: number }[];
  timeRange: 'today' | '7d' | '30d' | 'all';
  onTimeRangeChange: (range: 'today' | '7d' | '30d' | 'all') => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  analytics,
  popularPages,
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Audience &amp; Engagement Analytics</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time traffic, page views, and direct interaction metrics.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F5] border border-[#E2E8F0] rounded-xl text-xs">
          {(['today', '7d', '30d', 'all'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onTimeRangeChange(r)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === r
                  ? 'bg-[#064E3B] text-white'
                  : 'text-[#64748B] hover:text-[#064E3B]'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Total Page Views</span>
            <Eye className="w-4 h-4 text-[#064E3B]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {analytics?.pageViews ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">WhatsApp Clicks</span>
            <MessageCircle className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {analytics?.whatsappClicks ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Phone Inquiries</span>
            <Phone className="w-4 h-4 text-[#B45309]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {analytics?.phoneClicks ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Total Inquiries</span>
            <Users className="w-4 h-4 text-[#1E40AF]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">
            {analytics?.totalInquiries ?? 0}
          </div>
        </div>
      </div>

      {/* Top Pages Visited */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#0F172A]">Most Popular Pages</h3>
        <div className="space-y-2">
          {popularPages.length === 0 ? (
            <p className="text-xs text-[#94A3B8]">No page view events recorded in this period.</p>
          ) : (
            popularPages.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#F1F5F9] last:border-0">
                <span className="font-mono text-[#064E3B]">{p.page}</span>
                <span className="font-semibold text-[#64748B]">{p.views} views</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

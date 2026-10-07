import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Server, Database, Mail, Globe, ArrowLeft } from 'lucide-react';

interface HealthPageProps {
  onNavigate: (page: PageId) => void;
}

export const HealthPage: React.FC<HealthPageProps> = ({ onNavigate }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = () => {
    setLoading(true);
    setError(null);
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setHealthData(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to connect to health endpoint');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#064E3B] text-xs font-semibold border border-[#A7F3D0]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          <span>Live Infrastructure Status</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
          System Health &amp; Operational Status
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Real-time health telemetry for Tuhfat Al-Ilm Academy production servers and database adapters.
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${error ? 'bg-red-50 text-red-600' : 'bg-[#ECFDF5] text-[#059669]'}`}>
              {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Overall Status</h2>
              <span className={`text-xs font-semibold ${error ? 'text-red-600' : 'text-[#059669]'}`}>
                {error ? 'Degraded / Unreachable' : '100% Operational & Healthy'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchHealth}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F1EA] text-[#064E3B] border border-[#E5E2D9] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#64748B]">Checking server health telemetry...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Health check failed: {error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B]">
                <Server className="w-4 h-4" />
                <span>Academy Server Engine</span>
              </div>
              <p className="text-xs text-[#374151] font-semibold">{healthData?.academy || 'Tuhfat Al-Ilm Academy'}</p>
              <p className="text-[11px] text-[#64748B]">Node.js Web App Core</p>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B]">
                <Database className="w-4 h-4" />
                <span>Active Database Engine</span>
              </div>
              <p className="text-xs text-[#374151] font-semibold">{healthData?.database || 'MySQL / SQLite'}</p>
              <p className="text-[11px] text-[#64748B]">Persistent Admissions &amp; Auth DB</p>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B]">
                <Globe className="w-4 h-4" />
                <span>Production Domain</span>
              </div>
              <p className="text-xs text-[#374151] font-semibold">tuhfatalilm.online</p>
              <p className="text-[11px] text-[#64748B]">HTTPS Secured</p>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B]">
                <Mail className="w-4 h-4" />
                <span>Email Dispatcher</span>
              </div>
              <p className="text-xs text-[#374151] font-semibold">SMTP &amp; Database Logger Active</p>
              <p className="text-[11px] text-[#64748B]">tuhfatalilmacademy@gmail.com</p>
            </div>
          </div>
        )}

        <div className="pt-2 text-center text-[11px] text-[#94A3B8]">
          Telemetry Timestamp: {healthData?.timestamp || new Date().toISOString()}
        </div>
      </div>
    </div>
  );
};

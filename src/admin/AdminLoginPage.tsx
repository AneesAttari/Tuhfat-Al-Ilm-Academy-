import React, { useState, useEffect } from 'react';
import { PageId, AdminUser } from '../types';
import { Lock, Mail, ShieldAlert, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onNavigate: (page: PageId) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check current session
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.admin) {
          onLoginSuccess(data.admin);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMsg(null);
    setGoogleSubmitting(true);

    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() || 'tuhfatulilmacademy@gmail.com' })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Google authentication failed.');
        return;
      }

      if (data.admin) {
        onLoginSuccess(data.admin);
      }
    } catch {
      setError('Unable to complete Google sign-in. Please verify your connection.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please enter both your admin email and password.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
        return;
      }

      if (data.isAdmin || data.redirect === 'admin-dashboard' || data.user?.role === 'admin') {
        setSuccessMsg('Authentication successful. Loading Admin Dashboard...');
        setTimeout(() => {
          onLoginSuccess(data.admin || { id: data.user.id, email: data.user.email });
        }, 300);
      } else {
        setError('This account does not have administrator privileges.');
      }
    } catch {
      setError('Unable to connect to the server. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Lockup */}
        <div className="flex items-center justify-center mb-3">
          <Logo size="lg" variant="icon" />
        </div>

        <h1 className="text-center text-2xl font-bold tracking-tight text-[#0F172A]">
          Tuhfat Al-Ilm Academy
        </h1>
        <p className="mt-1 text-center text-xs font-semibold text-[#059669] uppercase tracking-wider">
          Administration Portal
        </p>

        {/* Authorized Admin Notice */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#475569]">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>Authorized Academy Personnel Only</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-[#E2E8F0]">
          {/* Success Notification */}
          {successMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#064E3B] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Continue with Google */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              disabled={googleSubmitting}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#CBD5E1] rounded-2xl bg-white hover:bg-neutral-50 text-sm font-semibold text-[#1F2937] shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B] disabled:opacity-60"
            >
              {googleSubmitting ? (
                <span className="w-4 h-4 border-2 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#94A3B8] font-semibold text-[10px] tracking-wider">
                  Or sign in with password
                </span>
              </div>
            </div>
          </div>

          {/* Password Login Form */}
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuhfatulilmacademy@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent bg-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-md hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Public Return Link */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#064E3B] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#94A3B8]">
          Tuhfat Al-Ilm Academy Administration System
        </p>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PageId, AdminUser } from '../types';
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../lib/AuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onNavigate: (page: PageId) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const {
    adminUser,
    loginWithGoogle,
    loginWithEmailPassword,
    sendPasswordReset,
    adminSignOut
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already authenticated as admin, automatically proceed
  useEffect(() => {
    if (adminUser) {
      onLoginSuccess(adminUser);
    }
  }, [adminUser, onLoginSuccess]);

  // Real Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setGoogleSubmitting(true);

    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google authentication was cancelled or could not be completed.');
        return;
      }

      if (result.admin) {
        setSuccessMsg(`Welcome, ${result.admin.email}! Opening Administrator Dashboard...`);
        setTimeout(() => {
          onLoginSuccess(result.admin!);
        }, 300);
      } else {
        setError('Access Denied: This Google account is not authorized to access the administrator area.');
      }
    } catch (err: any) {
      setError(err?.message || 'Google authentication failed. Please try again.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  // Email & Password login (via Firebase Auth and verified credentials)
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await loginWithEmailPassword(cleanEmail, password);
      if (!result.success) {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
        return;
      }

      if (result.admin) {
        setSuccessMsg('Authentication successful. Redirecting to Administrator Dashboard...');
        setTimeout(() => {
          onLoginSuccess(result.admin!);
        }, 300);
      } else {
        setError('Access Denied: This account is not registered as an authorized administrator.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Password reset via Firebase Auth
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your administrator email address.');
      return;
    }

    setResetSubmitting(true);
    try {
      const res = await sendPasswordReset(cleanEmail);
      if (res.success) {
        setSuccessMsg(`Password reset instructions have been dispatched to ${cleanEmail}. Please check your inbox.`);
        setIsResetMode(false);
      } else {
        setError(res.error || 'Could not send reset email. Please ensure the email address is correct.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email.');
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Islamic Geometric & Ambient Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#064E3B 1px, transparent 1px), radial-gradient(#064E3B 1px, #F8F9FA 1px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px'
        }}
      />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-800 via-amber-600 to-emerald-900" />

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Navigation Return Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Academy Website</span>
          </button>
          <span className="text-[11px] font-arabic text-amber-800/80 tracking-wide font-medium">
            رَبِّ زِدْنِي عِلْمًا
          </span>
        </div>

        {/* Dignified Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-slate-200/80 mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            Tuhfat Al-Ilm Academy
          </h1>
          <p className="text-xs font-arabic text-emerald-800 font-semibold mt-1">
            تحفة العلم &bull; بوابة الإدارة الأكاديمية
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Administrative &amp; Faculty Portal
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p className="font-semibold">{error}</p>
                {error.includes('Access Denied') && (
                  <button
                    type="button"
                    onClick={() => {
                      adminSignOut();
                      setError(null);
                    }}
                    className="mt-2 text-[11px] text-rose-700 font-bold underline hover:text-rose-900 cursor-pointer block"
                  >
                    Try signing in with a different Google account
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{successMsg}</div>
            </div>
          )}

          {!isResetMode ? (
            <>
              {/* Primary Action: Continue with Google */}
              <div className="mb-6">
                <button
                  type="button"
                  disabled={googleSubmitting || submitting}
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-800 disabled:opacity-60"
                  aria-label="Continue with Google"
                >
                  {googleSubmitting ? (
                    <span className="w-4 h-4 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              </div>

              {/* Clean Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-500 font-medium">
                    or sign in with credentials
                  </span>
                </div>
              </div>

              {/* Secondary Option: Email & Password */}
              <form className="space-y-4" onSubmit={handleEmailPasswordSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@tuhfatalilm.com"
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent bg-white transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent bg-white transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || googleSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-950 shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Forgot Password Form */
            <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
              <div className="text-center pb-2">
                <h2 className="text-sm font-bold text-slate-900">Reset Administrator Password</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your email address to receive password reset instructions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tuhfatalilm.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-950 shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-800 disabled:opacity-50"
                >
                  {resetSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Discreet Security Footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>Restricted Access &bull; Protected by Firebase Authentication</span>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} Tuhfat Al-Ilm Academy &bull; All Rights Reserved
        </p>
      </div>
    </div>
  );
};

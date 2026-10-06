import React, { useState } from 'react';
import { PageId, User } from '../types';
import { Logo } from '../components/Logo';
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  ShieldCheck,
  KeyRound,
  RefreshCw
} from 'lucide-react';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: User) => void;
  onNavigate: (page: PageId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onNavigate
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password Reset fields
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetCodeHint, setResetCodeHint] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to sign in. Please verify your credentials.');
        return;
      }

      if (data.isAdmin || data.redirect === 'admin-dashboard' || data.user?.role === 'admin') {
        setSuccessMsg('Welcome, Administrator! Opening Admin Dashboard...');
        setTimeout(() => {
          onAuthSuccess(data.user);
          onNavigate('admin-dashboard');
        }, 300);
        return;
      }

      if (data.user) {
        setSuccessMsg(`Welcome back, ${data.user.name || 'Student'}! Redirecting...`);
        setTimeout(() => {
          onAuthSuccess(data.user);
          onNavigate('home');
        }, 400);
      }
    } catch {
      setError('Unable to reach academy server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 || data.code === 'EMAIL_ALREADY_EXISTS') {
          setError('An account with this email already exists. Please switch to Sign In below.');
        } else {
          setError(data.error || 'Unable to create account. Please try again.');
        }
        return;
      }

      if (data.user) {
        setSuccessMsg(`Account created successfully! Welcome to Tuhfat Al-Ilm, ${data.user.name}!`);
        setTimeout(() => {
          onAuthSuccess(data.user);
          onNavigate('home');
        }, 500);
      }
    } catch {
      setError('Unable to connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unable to process password reset.');
        return;
      }

      setSuccessMsg('Reset code generated! Please enter your code and new password below.');
      if (data.code) {
        setResetCode(data.code);
        setResetCodeHint(data.code);
      }
      setMode('reset');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = resetCode.trim();

    if (!cleanEmail) {
      setError('Email is required.');
      return;
    }

    if (!cleanCode) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
        return;
      }

      setSuccessMsg('Password reset successfully! You can now log in with your new password.');
      setPassword('');
      setResetCodeHint(null);
      setTimeout(() => {
        setMode('login');
      }, 1200);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (targetEmail: string, targetName?: string) => {
    setError(null);
    setSuccessMsg(null);
    setGoogleLoading(true);

    try {
      const res = await fetch('/api/user/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail.trim().toLowerCase(),
          name: targetName?.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Google authentication failed.');
        return;
      }

      if (data.isAdmin || data.redirect === 'admin-dashboard' || data.user?.role === 'admin') {
        setSuccessMsg('Welcome, Administrator! Opening Admin Dashboard...');
        setTimeout(() => {
          onAuthSuccess(data.user);
          onNavigate('admin-dashboard');
        }, 300);
        return;
      }

      if (data.user) {
        setSuccessMsg(`Welcome, ${data.user.name}! Redirecting...`);
        setTimeout(() => {
          onAuthSuccess(data.user);
          onNavigate('home');
        }, 400);
      }
    } catch {
      setError('Unable to complete Google sign-in. Please try again.');
    } finally {
      setGoogleLoading(false);
      setGoogleModalOpen(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="w-full max-w-md space-y-8">
        
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:text-[#043d2e] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Academy</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Secure Student Portal</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-[#E5E2D9] relative overflow-hidden">
          
          {/* Subtle Top Decorative Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#D9B44A]" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="flex justify-center mx-auto mb-1">
              <Logo size="lg" variant="icon" />
            </div>
            <h1 className="text-2xl font-bold text-[#064E3B] font-serif-title tracking-tight">
              {mode === 'login' && 'Welcome to Tuhfat Al-Ilm'}
              {mode === 'register' && 'Join Tuhfat Al-Ilm Academy'}
              {mode === 'forgot' && 'Reset Your Password'}
              {mode === 'reset' && 'Create New Password'}
            </h1>
            <p className="text-xs text-[#6B7280]">
              {mode === 'login' && 'Sign in to access your Quranic and Islamic learning portal'}
              {mode === 'register' && 'Create your student account in less than a minute'}
              {mode === 'forgot' && 'Enter your registered email to receive a password reset verification code'}
              {mode === 'reset' && 'Enter your verification code and choose a new password'}
            </p>
          </div>

          {/* Mode Tabs (Sign In / Create Account) - shown for login and register */}
          {(mode === 'login' || mode === 'register') && (
            <div className="flex p-1 bg-[#F4F1EA] rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#064E3B] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1E2320]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#064E3B] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1E2320]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Notification Alerts */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium leading-relaxed">{error}</p>
                {error.includes('already exists') && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="mt-1.5 text-xs font-bold text-[#064E3B] underline hover:text-[#043d2e] cursor-pointer"
                  >
                    Click here to Sign In with this email &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="font-medium">{successMsg}</p>
            </div>
          )}

          {resetCodeHint && (
            <div className="mb-5 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Verification Code: <strong className="font-mono text-sm tracking-wider">{resetCodeHint}</strong></span>
              </div>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded">Auto-filled</span>
            </div>
          )}

          {/* Continue with Google Button (for login and register modes) */}
          {(mode === 'login' || mode === 'register') && (
            <>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(true)}
                disabled={loading || googleLoading}
                className="w-full mb-5 py-2.5 px-4 border border-[#D1D5DB] rounded-xl text-xs font-semibold text-[#374151] bg-white hover:bg-[#F9FAFB] transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E2D9]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-[#9CA3AF] uppercase tracking-wider text-[10px] font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#374151]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-semibold text-[#064E3B] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Academy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. CREATE ACCOUNT / SIGN UP FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abdullah Khan"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D9B44A]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM (Step 1) */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Enter Your Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying email...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-semibold text-[#6B7280] hover:text-[#064E3B] cursor-pointer"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 4. RESET PASSWORD FORM (Step 2) */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] font-mono focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Reset Password</span>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-semibold text-[#6B7280] hover:text-[#064E3B] cursor-pointer"
                >
                  &larr; Cancel &amp; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Footer note inside card */}
          {(mode === 'login' || mode === 'register') && (
            <div className="mt-6 pt-5 border-t border-[#E5E2D9] text-center">
              {mode === 'login' ? (
                <p className="text-xs text-[#6B7280]">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                    }}
                    className="font-bold text-[#064E3B] hover:underline cursor-pointer"
                  >
                    Create one now
                  </button>
                </p>
              ) : (
                <p className="text-xs text-[#6B7280]">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="font-bold text-[#064E3B] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Benefits reminder */}
        <div className="text-center space-y-1 text-xs text-[#6B7280]">
          <p className="flex items-center justify-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Accessible online Quran &amp; Islamic learning worldwide</span>
          </p>
        </div>
      </div>

      {/* Google Sign-In Prompt Modal */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E5E2D9] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
              <div className="flex items-center gap-2">
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
                <span className="text-sm font-bold text-[#1E2320]">Google Sign-In</span>
              </div>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="text-xs text-[#9CA3AF] hover:text-[#1E2320] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#6B7280]">
              Sign in or create your student account quickly with your Google account.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  placeholder="e.g. Maryam Ali"
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D1D5DB] rounded-xl text-xs text-[#1E2320] focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-[#6B7280] bg-[#F4F1EA] rounded-xl hover:bg-[#E5E2D9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!googleEmailInput.trim() || googleLoading}
                  onClick={() => handleGoogleAuth(googleEmailInput, googleNameInput)}
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#064E3B] rounded-xl hover:bg-[#043d2e] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {googleLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <span>Continue &rarr;</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

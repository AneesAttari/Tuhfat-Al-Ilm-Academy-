import React, { useState, useEffect, useRef } from 'react';
import { PageId, AdminUser } from '../types';
import { Lock, Mail, ShieldAlert, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';

declare global {
  interface Window {
    google?: any;
    __googleGsiLoaded?: boolean;
  }
}

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
  const [googleClientId, setGoogleClientId] = useState<string>('');
  const [googleConfigured, setGoogleConfigured] = useState<boolean>(false);
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>([]);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

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

  // Fetch Google OAuth client configuration & load Google Identity Services
  useEffect(() => {
    fetch('/api/auth/google-client-id')
      .then((res) => res.json())
      .then((data) => {
        if (data.clientId) {
          setGoogleClientId(data.clientId);
          setGoogleConfigured(Boolean(data.configured));
        }
        if (data.authorizedEmails && Array.isArray(data.authorizedEmails)) {
          setAuthorizedEmails(data.authorizedEmails);
        }
      })
      .catch(() => {});

    // Dynamically load Google Identity Services script if not already present
    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.__googleGsiLoaded = true;
      };
      document.body.appendChild(script);
    }
  }, []);

  // Initialize Google Identity Services when Client ID and SDK are ready
  useEffect(() => {
    if (!googleClientId || typeof window === 'undefined') return;

    const initGIS = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            itp_support: true,
            context: 'signin'
          });

          // Render Google button inside container if available
          if (googleBtnContainerRef.current) {
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 320
            });
          }
        } catch (e) {
          console.error('[Google GIS Init Error]:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGIS();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGIS();
          clearInterval(timer);
        }
      }, 250);
      return () => clearInterval(timer);
    }
  }, [googleClientId]);

  // Handle Google Token Credential Verification via Backend
  const handleGoogleCredentialResponse = async (response: { credential?: string }) => {
    if (!response.credential) {
      setError('Google Sign-In was cancelled or failed to return an authentication credential.');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setGoogleSubmitting(true);

    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Access Denied: Your Google account is not an authorized administrator.');
        return;
      }

      setSuccessMsg('Google identity verified. Opening Administrator Dashboard...');
      setTimeout(() => {
        if (data.admin) {
          onLoginSuccess(data.admin);
        }
      }, 400);
    } catch {
      setError('Unable to verify Google credential with academy server. Please check your network.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleGoogleButtonClick = () => {
    setError(null);
    setSuccessMsg(null);

    // If client ID is not configured in .env, display clear explanation
    if (!googleClientId || !googleConfigured) {
      setError(
        'Google OAuth Client ID is not yet configured in .env (GOOGLE_CLIENT_ID). ' +
        'Please configure your Google OAuth credentials in Hostinger environment settings, ' +
        'or sign in using your administrator email and password below.'
      );
      return;
    }

    if (!window.google?.accounts) {
      setError('Google Sign-In service is still loading. Please wait a moment and try again.');
      return;
    }

    setGoogleSubmitting(true);

    try {
      // 1. Try Google Identity Services prompt (supports native account chooser on mobile/Android and desktop)
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt was skipped or blocked by popup blocker, try token client
          if (window.google.accounts.oauth2) {
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: googleClientId,
              scope: 'email profile openid',
              callback: async (tokenResponse: any) => {
                if (tokenResponse.error) {
                  setError(`Google login error: ${tokenResponse.error}`);
                  setGoogleSubmitting(false);
                  return;
                }
                if (tokenResponse.access_token) {
                  // Fetch userinfo using access token and verify on backend
                  try {
                    const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                      headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                    });
                    const info = await infoRes.json();
                    if (info.email) {
                      const res = await fetch('/api/auth/google-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: info.email })
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setError(data.error || 'Access Denied: Account not authorized.');
                      } else {
                        setSuccessMsg('Authorization verified. Redirecting...');
                        setTimeout(() => onLoginSuccess(data.admin), 300);
                      }
                    }
                  } catch {
                    setError('Failed to retrieve Google profile.');
                  } finally {
                    setGoogleSubmitting(false);
                  }
                }
              }
            });
            tokenClient.requestAccessToken({ prompt: 'select_account' });
          } else {
            setGoogleSubmitting(false);
          }
        } else {
          setGoogleSubmitting(false);
        }
      });
    } catch (e: any) {
      setError(e.message || 'Unable to open Google sign-in dialog.');
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please verify your administrator credentials.');
        return;
      }

      setSuccessMsg('Administrator authentication verified. Loading Dashboard...');
      setTimeout(() => {
        onLoginSuccess(data.admin || { id: cleanEmail, email: cleanEmail });
      }, 350);
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
              <div className="space-y-1">
                <span className="font-semibold block">Access Notice:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Real Google OAuth Authentication Section */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              disabled={googleSubmitting}
              onClick={handleGoogleButtonClick}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#CBD5E1] rounded-2xl bg-white hover:bg-neutral-50 text-sm font-semibold text-[#1F2937] shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B] disabled:opacity-60"
              aria-label="Continue with Google Authentication"
            >
              {googleSubmitting ? (
                <span className="w-4 h-4 border-2 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
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

            {/* Hidden container for rendered Google GIS button */}
            <div ref={googleBtnContainerRef} className="hidden" aria-hidden="true" />

            {/* Authorized Accounts Clarification */}
            <div className="text-[11px] text-[#64748B] text-center px-2">
              Only authorized official administrator emails are permitted.
            </div>

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
                  placeholder="tuhfatalilmacademy@gmail.com"
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

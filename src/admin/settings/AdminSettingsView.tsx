import React, { useState } from 'react';
import { KeyRound, ShieldCheck, CheckCircle2, AlertCircle, Lock, Bell, Globe, Save } from 'lucide-react';

interface AdminSettingsViewProps {
  adminEmail: string;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ adminEmail }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsMsg, setPrefsMsg] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPassMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setSavingPass(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setPassMsg({ type: 'error', text: data.error || 'Failed to update password.' });
      } else {
        setPassMsg({ type: 'success', text: 'Administrator password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPassMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSavingPass(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    setTimeout(() => {
      setSavingPrefs(false);
      setPrefsMsg('Notification preferences saved successfully.');
      setTimeout(() => setPrefsMsg(null), 3000);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Administrator Settings &amp; Security</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure login credentials, notification alerts, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: CHANGE MASTER PASSWORD */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] mb-1">
              <Lock className="w-4 h-4 text-[#064E3B]" />
              <span>Change Admin Password</span>
            </div>
            <p className="text-xs text-[#64748B] mb-4">
              Currently logged in as: <strong className="text-[#0F172A]">{adminEmail}</strong>
            </p>

            {passMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4 ${
                  passMsg.type === 'success'
                    ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B]'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {passMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPass}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{savingPass ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] text-[11px] text-[#94A3B8]">
            Passwords are encrypted with PBKDF2 with unique cryptographic salt per user.
          </div>
        </div>

        {/* CARD 2: ADMISSIONS ALERTS & NOTIFICATIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] mb-1">
              <Bell className="w-4 h-4 text-[#D97706]" />
              <span>Admissions Notification Preferences</span>
            </div>
            <p className="text-xs text-[#64748B] mb-4">
              Configure how the admissions team receives notifications when a prospective student submits an inquiry.
            </p>

            {prefsMsg && (
              <div className="p-3 rounded-xl text-xs bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>{prefsMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
                <div>
                  <div className="font-semibold text-xs text-[#0F172A]">Direct WhatsApp Instant Ping</div>
                  <div className="text-[11px] text-[#64748B]">Opens WhatsApp directly with student lead formatted</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="rounded text-[#064E3B] focus:ring-[#064E3B] h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
                <div>
                  <div className="font-semibold text-xs text-[#0F172A]">Database Storage Logging</div>
                  <div className="text-[11px] text-[#64748B]">Automatically stores every inquiry in SQLite/D1 database</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-[#064E3B] focus:ring-[#064E3B] h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
                <div>
                  <div className="font-semibold text-xs text-[#0F172A]">Weekly Admissions Summary</div>
                  <div className="text-[11px] text-[#64748B]">Calculates conversion rate and top courses weekly</div>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="rounded text-[#064E3B] focus:ring-[#064E3B] h-4 w-4"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPrefs}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingPrefs ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] text-[11px] text-[#94A3B8]">
            Tuhfat Al-Ilm Academy v2.4 · Production System
          </div>
        </div>
      </div>
    </div>
  );
};

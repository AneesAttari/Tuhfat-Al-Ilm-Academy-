import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminContentViewProps {
  settings: Record<string, string>;
  onSaveSettings: (updated: Record<string, string>) => Promise<boolean>;
}

export const AdminContentView: React.FC<AdminContentViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    const success = await onSaveSettings(formData);
    setSaving(false);
    if (success) {
      setStatusMsg({ type: 'success', text: 'Website content updated successfully!' });
    } else {
      setStatusMsg({ type: 'error', text: 'Failed to update content. Please try again.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Website Content &amp; Contact Info</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage academy contact numbers, headline texts, and core messaging.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B]'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Academy Official Name
            </label>
            <input
              type="text"
              value={formData.academy_name || 'Tuhfat Al-Ilm Academy'}
              onChange={(e) => handleChange('academy_name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Official WhatsApp Number
            </label>
            <input
              type="text"
              value={formData.whatsapp_number || '+92 317 1503094'}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Official Phone / Call Number
            </label>
            <input
              type="text"
              value={formData.phone_number || '+92 309 6794698'}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              value={formData.email_address || 'tuhfatalilmacademy@gmail.com'}
              onChange={(e) => handleChange('email_address', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Hero Section Main Headline
          </label>
          <input
            type="text"
            value={formData.hero_headline || 'Learn the Quran. Understand Islam. Grow with Knowledge.'}
            onChange={(e) => handleChange('hero_headline', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Hero Section Subtitle
          </label>
          <textarea
            rows={2}
            value={formData.hero_subtitle || 'Tuhfat Al-Ilm Academy provides accessible online Quran and Islamic education for students around the world, with flexible learning designed for children and adults.'}
            onChange={(e) => handleChange('hero_subtitle', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

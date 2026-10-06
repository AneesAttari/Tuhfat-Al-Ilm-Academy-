import React, { useState } from 'react';
import { Announcement } from '../../types';
import { Bell, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, CheckCircle2 } from 'lucide-react';

interface AdminAnnouncementsViewProps {
  announcements: Announcement[];
  onRefreshAnnouncements: () => void;
}

export const AdminAnnouncementsView: React.FC<AdminAnnouncementsViewProps> = ({
  announcements,
  onRefreshAnnouncements
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleOpenAdd = () => {
    setEditingAnnouncement({
      id: '',
      title: '',
      short_text: '',
      full_text: '',
      published: 1
    });
    setFeedbackMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement({ ...ann });
    setFeedbackMsg(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (ann: Announcement) => {
    const newPublished = ann.published ? 0 : 1;
    try {
      const res = await fetch(`/api/announcements/${ann.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ann.title,
          short_text: ann.short_text,
          full_text: ann.full_text,
          published: newPublished
        })
      });
      if (res.ok) {
        onRefreshAnnouncements();
      }
    } catch {}
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshAnnouncements();
      }
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editingAnnouncement.title) return;

    setSubmitting(true);
    setFeedbackMsg(null);

    const isEdit = Boolean(editingAnnouncement.id && editingAnnouncement.id.length > 0);
    const url = isEdit ? `/api/announcements/${editingAnnouncement.id}` : '/api/announcements';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingAnnouncement.title,
          short_text: editingAnnouncement.short_text || '',
          full_text: editingAnnouncement.full_text || '',
          published: editingAnnouncement.published ? 1 : 0
        })
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: 'Announcement saved successfully!' });
        onRefreshAnnouncements();
        setTimeout(() => {
          setIsModalOpen(false);
          setEditingAnnouncement(null);
        }, 600);
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to save announcement.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Academy Announcements</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Post important admissions notices, holiday dates, and class schedule updates to the website banner.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl text-xs bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.length === 0 ? (
          <div className="col-span-2 bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center text-xs text-[#94A3B8]">
            No announcements created yet. Click "New Announcement" to create your first notice.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ann.published
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {ann.published ? 'Live on Website' : 'Draft / Hidden'}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#0F172A]">{ann.title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">{ann.short_text}</p>
                {ann.full_text && (
                  <p className="text-[11px] text-[#64748B] leading-relaxed line-clamp-2 italic bg-[#FAF9F5] p-2 rounded-lg">
                    {ann.full_text}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(ann)}
                  className="inline-flex items-center gap-1 text-xs text-[#064E3B] font-semibold hover:underline cursor-pointer"
                >
                  {ann.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{ann.published ? 'Unpublish' : 'Publish'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ann)}
                    className="p-1.5 text-[#064E3B] hover:bg-[#ECFDF5] rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ann.id, ann.title)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#0F172A]">
                {editingAnnouncement.id ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Announcement Headline *
                </label>
                <input
                  type="text"
                  required
                  value={editingAnnouncement.title || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  placeholder="e.g. Ramadan Special Enrollment Open"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Short Summary (Banner text)
                </label>
                <input
                  type="text"
                  value={editingAnnouncement.short_text || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, short_text: e.target.value })}
                  placeholder="e.g. Limited slots available for evening one-to-one classes."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Full Details (Optional expanded view)
                </label>
                <textarea
                  rows={3}
                  value={editingAnnouncement.full_text || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, full_text: e.target.value })}
                  placeholder="Complete announcement text..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="annPublishedCheck"
                  checked={Boolean(editingAnnouncement.published)}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, published: e.target.checked ? 1 : 0 })}
                  className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#064E3B]"
                />
                <label htmlFor="annPublishedCheck" className="text-xs font-semibold text-[#374151]">
                  Published (Visible on top homepage notice)
                </label>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : 'Save Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

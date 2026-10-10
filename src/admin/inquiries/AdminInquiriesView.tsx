import React, { useState } from 'react';
import { Inquiry } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit2,
  X,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  UserCheck,
  Save,
  ArrowUpDown,
  Calendar
} from 'lucide-react';

interface AdminInquiriesViewProps {
  inquiries: Inquiry[];
  courses: { id: string; name: string }[];
  onRefreshInquiries: () => void;
}

export const AdminInquiriesView: React.FC<AdminInquiriesViewProps> = ({
  inquiries,
  courses,
  onRefreshInquiries
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [updating, setUpdating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const getAdminHeader = () => {
    let email = 'aneesattari67@gmail.com';
    try {
      const saved = localStorage.getItem('tuhfat_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email) email = parsed.email;
      }
    } catch {}
    return { 'x-admin-email': email };
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.notes && inq.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || inq.course === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleOpenDetail = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setEditingNotes(inq.notes || '');
    setFeedbackMsg(null);
    setIsDetailModalOpen(true);
  };

  const updateLocalInquiry = (id: string, updates: Partial<Inquiry>) => {
    try {
      const stored = localStorage.getItem('tuhfat_local_inquiries');
      if (stored) {
        const list: Inquiry[] = JSON.parse(stored);
        const updated = list.map((i) => (i.id === id ? { ...i, ...updates } : i));
        localStorage.setItem('tuhfat_local_inquiries', JSON.stringify(updated));
      }
    } catch {}
  };

  const deleteLocalInquiry = (id: string) => {
    try {
      const stored = localStorage.getItem('tuhfat_local_inquiries');
      if (stored) {
        const list: Inquiry[] = JSON.parse(stored);
        const updated = list.filter((i) => i.id !== id);
        localStorage.setItem('tuhfat_local_inquiries', JSON.stringify(updated));
      }
    } catch {}
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    updateLocalInquiry(id, { status: newStatus as any });
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
    }
    onRefreshInquiries();

    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeader()
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {}
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);
    setFeedbackMsg(null);

    updateLocalInquiry(selectedInquiry.id, { notes: editingNotes });
    setSelectedInquiry({ ...selectedInquiry, notes: editingNotes });
    onRefreshInquiries();
    setFeedbackMsg({ type: 'success', text: 'Notes updated successfully!' });

    try {
      await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeader()
        },
        body: JSON.stringify({ notes: editingNotes })
      });
    } catch {}
    setUpdating(false);
  };

  const handleMarkAsEnrolled = async (inq: Inquiry) => {
    updateLocalInquiry(inq.id, { status: 'Enrolled' });
    if (selectedInquiry && selectedInquiry.id === inq.id) {
      setSelectedInquiry({ ...selectedInquiry, status: 'Enrolled' });
    }
    setFeedbackMsg({ type: 'success', text: `${inq.name} marked as Enrolled Student!` });
    onRefreshInquiries();

    try {
      await fetch(`/api/inquiries/${inq.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeader()
        },
        body: JSON.stringify({ status: 'Enrolled' })
      });
    } catch {}
  };

  const handleDeleteInquiry = async (id: string, name: string) => {
    deleteLocalInquiry(id);
    onRefreshInquiries();
    setIsDetailModalOpen(false);
    setConfirmDeleteId(null);
    setFeedbackMsg({ type: 'success', text: `Inquiry from ${name} deleted successfully.` });

    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { ...getAdminHeader() }
      });
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Enrollment Inquiries Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Track prospective students, follow up on questions, update status, and confirm enrollments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-[#ECFDF5] text-[#064E3B] text-xs font-semibold border border-[#A7F3D0]">
            Total Inquiries: {inquiries.length}
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B]'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, email, phone, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Enrolled">Enrolled</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
          <option value="Archived">Archived</option>
        </select>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
          <option value="General Inquiry">General Inquiry</option>
        </select>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#FAF9F5] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student / Parent</th>
                <th className="py-3 px-4">Interested Course</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#94A3B8]">
                    No inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-[#0F172A] text-sm">{inq.name}</div>
                      {inq.email && <div className="text-[11px] text-[#64748B] truncate">{inq.email}</div>}
                      {inq.notes && (
                        <div className="text-[10px] text-[#059669] bg-emerald-50 px-2 py-0.5 rounded mt-1 line-clamp-1 inline-block">
                          Note: {inq.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#064E3B]">{inq.course}</span>
                      {inq.message && (
                        <p className="text-[11px] text-[#64748B] line-clamp-1 italic mt-0.5">
                          "{inq.message}"
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0F172A]">
                      {inq.phone}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#64748B]">
                      {inq.source || 'Website Form'}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#64748B] whitespace-nowrap">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                          inq.status === 'New'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : inq.status === 'Enrolled'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : inq.status === 'Contacted'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(inq)}
                        className="p-1.5 text-[#064E3B] hover:bg-[#ECFDF5] rounded-lg transition-colors cursor-pointer"
                        title="View details & notes"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {inq.status !== 'Enrolled' && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsEnrolled(inq)}
                          className="p-1.5 text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Confirm Enrollment"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}

                      {confirmDeleteId === inq.id ? (
                        <div className="inline-flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                            className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold hover:bg-slate-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(inq.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & NOTES MODAL */}
      {isDetailModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Inquiry Details</h3>
                <span className="text-xs text-[#64748B]">Submitted {new Date(selectedInquiry.created_at).toLocaleString()}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D9]">
                <div>
                  <span className="text-[#64748B] block font-medium">Student / Parent:</span>
                  <span className="font-bold text-[#0F172A] text-sm">{selectedInquiry.name}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Phone / WhatsApp:</span>
                  <span className="font-mono font-bold text-[#0F172A]">{selectedInquiry.phone}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Email:</span>
                  <span className="text-[#0F172A]">{selectedInquiry.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Course:</span>
                  <span className="font-semibold text-[#064E3B]">{selectedInquiry.course}</span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] font-semibold block mb-1">Inquiry Message:</span>
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#334155] leading-relaxed">
                  {selectedInquiry.message || 'No additional message provided.'}
                </div>
              </div>

              <div>
                <label className="text-[#64748B] font-semibold block mb-1">
                  Administrator Notes &amp; Follow-up Comments:
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record class timings agreed, teacher assigned, payment notes..."
                  className="w-full p-3 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleMarkAsEnrolled(selectedInquiry)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1E40AF] hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mark Enrolled</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updating ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

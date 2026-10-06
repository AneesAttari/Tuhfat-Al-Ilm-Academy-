import React, { useState, useEffect } from 'react';
import { Student, User } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Save,
  X,
  UserPlus,
  Shield,
  ShieldAlert,
  UserCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AdminStudentsViewProps {
  courses: { id: string; name: string }[];
}

export const AdminStudentsView: React.FC<AdminStudentsViewProps> = ({ courses }) => {
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'enrollments'>('accounts');
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddEnrollmentModalOpen, setIsAddEnrollmentModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  
  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    status: 'active'
  });

  const [newStudent, setNewStudent] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Quran Reading / Nazra',
    notes: '',
    source: 'Direct Admin Registration'
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const json = await res.json();
        if (json.users) setUsers(json.users);
      }
    } catch {}
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const json = await res.json();
        if (json.students) setStudents(json.students);
      }
    } catch {}
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchStudents()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCourse = courseFilter === 'all' || s.enrolled_course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  // User CRUD Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setFeedbackMsg({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to create user account.' });
      } else {
        setFeedbackMsg({ type: 'success', text: `Account for "${newUser.name}" created successfully!` });
        fetchUsers();
        setIsAddUserModalOpen(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'student',
          status: 'active'
        });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network error creating user.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.id) return;

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to update user account.' });
      } else {
        setFeedbackMsg({ type: 'success', text: 'User account updated successfully!' });
        fetchUsers();
        setEditingUser(null);
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network error updating user.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete the user account for "${userName}"? This will also remove their sessions.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `User "${userName}" deleted successfully.` });
        fetchUsers();
      } else {
        setFeedbackMsg({ type: 'error', text: 'Failed to delete user.' });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network error deleting user.' });
    }
  };

  // Direct Student Enrollment Handler
  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.phone) {
      setFeedbackMsg({ type: 'error', text: 'Name and Phone are required.' });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to register student.' });
      } else {
        setFeedbackMsg({ type: 'success', text: `Student "${newStudent.name}" enrolled successfully!` });
        fetchStudents();
        setIsAddEnrollmentModalOpen(false);
        setNewStudent({
          name: '',
          phone: '',
          email: '',
          course: 'Quran Reading / Nazra',
          notes: '',
          source: 'Direct Admin Registration'
        });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network error enrolling student.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Students &amp; User Accounts</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage registered student accounts, authentication profiles, and confirmed course enrollments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'accounts' ? (
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddEnrollmentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Direct Student Enrollment</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2 animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B]'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-xs hover:opacity-70 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sub-tab switcher */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('accounts');
            setSearchQuery('');
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'accounts'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-[#FAF9F5] hover:text-[#064E3B] border border-[#E2E8F0]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Accounts ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('enrollments');
            setSearchQuery('');
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'enrollments'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-[#FAF9F5] hover:text-[#064E3B] border border-[#E2E8F0]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Active Enrollments ({students.length})</span>
        </button>
      </div>

      {/* 1. REGISTERED ACCOUNTS VIEW */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, email address, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
            >
              <option value="all">All Account Roles</option>
              <option value="student">Students</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#334155]">
                <thead className="bg-[#FAF9F5] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User / Student</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Auth Provider</th>
                    <th className="py-3 px-4">Account Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#94A3B8]">
                        Loading registered user accounts...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#94A3B8]">
                        No user accounts found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#0F172A] text-sm">{u.name}</div>
                          {u.phone && (
                            <div className="text-[11px] text-[#64748B] font-mono">{u.phone}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#0F172A]">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4">
                          {u.auth_provider === 'google' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span>Google Auth</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <span>Email / Password</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-50 text-[#064E3B] border border-emerald-200'
                            }`}
                          >
                            {u.role === 'admin' ? 'Administrator' : 'Student'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                            <span className="capitalize">{u.status || 'Active'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#64748B]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 text-[#064E3B] hover:bg-[#ECFDF5] rounded-lg transition-colors cursor-pointer"
                            title="Edit Account"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ENROLLMENTS VIEW */}
      {activeSubTab === 'enrollments' && (
        <div className="space-y-4">
          {/* Filter & Search */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search enrolled students, phone, email, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
            >
              <option value="all">All Enrolled Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#334155]">
                <thead className="bg-[#FAF9F5] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Enrolled Course</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Enrollment Date</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                        Loading enrolled students...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                        No enrolled students found. You can mark prospective inquiries as 'Enrolled' or register students directly.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#0F172A] text-sm">{s.name}</div>
                          {s.notes && (
                            <div className="text-[10px] text-[#059669] bg-emerald-50 px-2 py-0.5 rounded mt-0.5 inline-block">
                              {s.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#064E3B]">
                          {s.enrolled_course}
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="font-mono text-[#0F172A]">{s.phone}</div>
                          {s.email && <div className="text-[11px] text-[#64748B]">{s.email}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#64748B]">
                          {new Date(s.enrolled_date).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#64748B]">
                          {s.source || 'Website'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                            <span>{s.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#0F172A]">Create New User Account</h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Farhan Ali"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Leave empty for default (Student@2026!)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Status
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#0F172A]">Edit Account Profile</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Role
                  </label>
                  <select
                    value={editingUser.role || 'student'}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Status
                  </label>
                  <select
                    value={editingUser.status || 'active'}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT ENROLLMENT MODAL */}
      {isAddEnrollmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#0F172A]">Direct Student Enrollment</h3>
              <button
                type="button"
                onClick={() => setIsAddEnrollmentModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Student / Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Sister Fatima"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="+44 7700 900123"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Enrolled Course *
                </label>
                <select
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Teacher / Class Notes / Schedule
                </label>
                <textarea
                  rows={2}
                  value={newStudent.notes}
                  onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
                  placeholder="e.g. Ustadh Zubair - Tuesdays & Thursdays 6pm GMT"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddEnrollmentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Enrolling...' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

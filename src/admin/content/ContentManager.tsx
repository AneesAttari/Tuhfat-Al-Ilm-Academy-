import React, { useState, useEffect } from 'react';
import { Course } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  FileText,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

interface ContentManagerProps {
  courses: Course[];
  siteSettings: Record<string, string>;
  onRefreshCourses: () => void;
  onRefreshSettings: () => void;
  initialSection?: 'courses' | 'website';
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  courses,
  siteSettings,
  onRefreshCourses,
  onRefreshSettings,
  initialSection = 'courses'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'website'>(initialSection);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialSection) {
      setActiveSubTab(initialSection);
    }
  }, [initialSection]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'category'>('order');

  // Course Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Website settings form state
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>(siteSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  // Filter and sort courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && Boolean(c.published)) ||
      (statusFilter === 'draft' && !c.published);
    return matchesSearch && matchesCat && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'order') return (a.display_order ?? 0) - (b.display_order ?? 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  // Handlers for Course CRUD
  const handleOpenAddCourse = () => {
    setEditingCourse({
      id: '',
      slug: '',
      name: '',
      category: 'Foundational Recitation',
      shortDesc: '',
      detailedDesc: '',
      suitableLearners: 'All learners and beginners',
      iconName: 'BookOpen',
      duration: '3 to 6 months',
      instructor: 'Qualified Teacher',
      level: 'All Levels',
      image_url: '',
      display_order: courses.length + 1,
      published: 1
    });
    setFeedbackMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setFeedbackMsg(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (course: Course) => {
    const newPublished = course.published ? 0 : 1;
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: course.name,
          category: course.category,
          short_description: course.shortDesc,
          description: course.detailedDesc,
          suitable_for: course.suitableLearners,
          icon: course.iconName,
          display_order: course.display_order ?? 0,
          published: newPublished,
          duration: course.duration,
          instructor: course.instructor,
          level: course.level,
          image_url: course.image_url
        })
      });
      if (res.ok) {
        onRefreshCourses();
      }
    } catch {}
  };

  const handleDeleteCourse = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the course "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Course "${name}" was deleted successfully.` });
        onRefreshCourses();
      } else {
        setFeedbackMsg({ type: 'error', text: 'Failed to delete course.' });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network error deleting course.' });
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.name?.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Course title is required.' });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    const isEdit = Boolean(editingCourse.id && editingCourse.id.length > 0);
    const url = isEdit ? `/api/courses/${editingCourse.id}` : '/api/courses';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      title: editingCourse.name.trim(),
      category: editingCourse.category?.trim() || 'General',
      short_description: editingCourse.shortDesc?.trim() || '',
      description: editingCourse.detailedDesc?.trim() || '',
      suitable_for: editingCourse.suitableLearners?.trim() || 'All learners',
      icon: editingCourse.iconName || 'BookOpen',
      display_order: Number(editingCourse.display_order ?? 0),
      published: editingCourse.published ? 1 : 0,
      duration: editingCourse.duration || 'Flexible',
      instructor: editingCourse.instructor || 'Certified Instructor',
      level: editingCourse.level || 'All Levels',
      image_url: editingCourse.image_url || ''
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to save course.' });
      } else {
        setFeedbackMsg({ type: 'success', text: `Course "${editingCourse.name}" saved successfully!` });
        onRefreshCourses();
        setTimeout(() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }, 800);
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for Website Content save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsForm })
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: 'Website content updated successfully!' });
        onRefreshSettings();
      } else {
        setFeedbackMsg({ type: 'error', text: 'Failed to update content.' });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network error saving settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs: Courses Catalog vs Website Content */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Course &amp; Content Manager</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Modify live courses, adjust descriptions, update instructors, and edit website text.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-[#FAF9F5] border border-[#E2E8F0] rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('courses')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'courses'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#064E3B]'
            }`}
          >
            Course Catalog ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('website')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'website'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#064E3B]'
            }`}
          >
            Website Content &amp; Info
          </button>
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

      {/* VIEW 1: COURSES CATALOG */}
      {activeSubTab === 'courses' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters, Add Button */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft / Unpublished</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
              >
                <option value="order">Sort: Display Order</option>
                <option value="name">Sort: Course Name</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCourse}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#334155]">
                <thead className="bg-[#FAF9F5] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Course Title &amp; Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Instructor / Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                        No courses found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[#64748B] text-[11px]">
                          {c.display_order ?? 0}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-semibold text-[#0F172A] text-sm">{c.name}</div>
                          <div className="text-[11px] text-[#64748B] line-clamp-1">{c.shortDesc}</div>
                          <div className="text-[10px] text-[#059669] mt-0.5">
                            Duration: {c.duration || 'Flexible'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#064E3B] font-semibold border border-[#A7F3D0]/60">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="font-medium text-[#0F172A]">{c.instructor || 'Certified Teacher'}</div>
                          <div className="text-[11px] text-[#64748B]">{c.level || 'All Levels'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(c)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                              c.published
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-neutral-100 text-neutral-600 border border-neutral-300 hover:bg-neutral-200'
                            }`}
                            title="Click to toggle published status"
                          >
                            {c.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{c.published ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCourse(c)}
                            className="p-1.5 text-[#064E3B] hover:bg-[#ECFDF5] rounded-lg transition-colors cursor-pointer"
                            title="Edit course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c.id, c.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* VIEW 2: WEBSITE CONTENT MANAGEMENT */}
      {activeSubTab === 'website' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Academy Profile &amp; Contact Details</h2>
            <p className="text-xs text-[#64748B]">These values appear across the public header, hero, footer, and contact pages.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Official Academy Name
              </label>
              <input
                type="text"
                value={settingsForm.academy_name || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, academy_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Official WhatsApp (+country code)
              </label>
              <input
                type="text"
                value={settingsForm.whatsapp_number || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Official Phone / Call
              </label>
              <input
                type="text"
                value={settingsForm.phone_number || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={settingsForm.email_address || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, email_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Homepage Hero Headline
            </label>
            <input
              type="text"
              value={settingsForm.hero_headline || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, hero_headline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Homepage Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={settingsForm.hero_subtitle || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              About Academy Summary Text
            </label>
            <textarea
              rows={3}
              value={settingsForm.about_text || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, about_text: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving Changes...' : 'Save Website Content'}</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL: ADD / EDIT COURSE */}
      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
              <h3 className="text-lg font-bold text-[#0F172A]">
                {editingCourse.id ? `Edit Course: ${editingCourse.name}` : 'Add New Course'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                    placeholder="e.g. Quran Reading / Nazra"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourse.category || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    placeholder="e.g. Foundational Recitation"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Short Description (Card preview)
                </label>
                <textarea
                  rows={2}
                  value={editingCourse.shortDesc || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, shortDesc: e.target.value })}
                  placeholder="Concise overview of what this course offers..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Detailed Description (Full Course Page)
                </label>
                <textarea
                  rows={3}
                  value={editingCourse.detailedDesc || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, detailedDesc: e.target.value })}
                  placeholder="Detailed curriculum background..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingCourse.duration || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    placeholder="e.g. 3 to 6 months"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={editingCourse.instructor || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                    placeholder="e.g. Certified Qari"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Course Level
                  </label>
                  <input
                    type="text"
                    value={editingCourse.level || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    placeholder="e.g. Beginner"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Suitable Learners
                  </label>
                  <input
                    type="text"
                    value={editingCourse.suitableLearners || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, suitableLearners: e.target.value })}
                    placeholder="e.g. Beginners of all ages"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCourse.display_order ?? 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, display_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={Boolean(editingCourse.published)}
                  onChange={(e) => setEditingCourse({ ...editingCourse, published: e.target.checked ? 1 : 0 })}
                  className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#064E3B]"
                />
                <label htmlFor="publishedCheck" className="text-xs font-semibold text-[#374151]">
                  Published (Visible on public academy website)
                </label>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Saving Course...' : 'Save Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

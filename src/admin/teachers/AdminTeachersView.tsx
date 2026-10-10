import React, { useState, useRef } from 'react';
import { Teacher } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  GraduationCap,
  Award,
  User,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Upload,
  ArrowUpDown,
  Search,
  Sparkles
} from 'lucide-react';

interface AdminTeachersViewProps {
  teachers: Teacher[];
  onRefreshTeachers: () => void;
  onSaveTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

export const AdminTeachersView: React.FC<AdminTeachersViewProps> = ({
  teachers,
  onSaveTeacher,
  onDeleteTeacher
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenAdd = () => {
    setEditingTeacher({
      id: 'teacher-' + Date.now(),
      name: '',
      role: '',
      qualification: '',
      experience: '',
      specialty: '',
      desc: '',
      photoUrl: '',
      display_order: teachers.length + 1,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher({ ...t });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: `teacher_${file.name.replace(/\s+/g, '_')}`,
            base64Data
          })
        });
        const data = await res.json();
        if (res.ok && data.file?.url) {
          setEditingTeacher((prev) => (prev ? { ...prev, photoUrl: data.file.url } : prev));
        } else {
          // Fallback to inline data url
          setEditingTeacher((prev) => (prev ? { ...prev, photoUrl: base64Data } : prev));
        }
      } catch {
        // Fallback to inline data url
        setEditingTeacher((prev) => (prev ? { ...prev, photoUrl: base64Data } : prev));
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher?.name?.trim()) return;

    const teacherToSave: Teacher = {
      id: editingTeacher.id || 'teacher-' + Date.now(),
      name: editingTeacher.name.trim(),
      role: editingTeacher.role?.trim() || 'Quran & Islamic Studies Instructor',
      qualification: editingTeacher.qualification?.trim() || 'Certified Teacher',
      experience: editingTeacher.experience?.trim() || 'Experienced Instructor',
      specialty: editingTeacher.specialty?.trim() || 'Tajweed & Islamic Education',
      desc: editingTeacher.desc?.trim() || 'Dedicated educator at Tuhfat Al-Ilm Academy.',
      photoUrl: editingTeacher.photoUrl?.trim() || '',
      display_order: Number(editingTeacher.display_order ?? 1),
      active: editingTeacher.active !== false
    };

    onSaveTeacher(teacherToSave);
    setIsModalOpen(false);
    setEditingTeacher(null);
    setFeedback(`Teacher "${teacherToSave.name}" updated successfully!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the faculty list? This will remove their profile from the public Teachers page.`)) {
      return;
    }
    onDeleteTeacher(id);
    setFeedback(`Removed "${name}" from faculty list.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleActive = (t: Teacher) => {
    onSaveTeacher({ ...t, active: !t.active });
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Teachers &amp; Faculty Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Add, update, or reorganize instructor profiles displayed on the public Teachers page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0]">
            {teachers.filter((t) => t.active !== false).length} Active Faculty
          </span>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Teacher</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name, role, or specialty..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
          />
        </div>
        <div className="text-xs text-[#64748B] font-semibold">
          {filteredTeachers.length} profiles
        </div>
      </div>

      {/* Teachers Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className={`bg-white rounded-3xl border ${
              teacher.active !== false ? 'border-[#E2E8F0]' : 'border-dashed border-slate-300 opacity-70'
            } p-6 shadow-xs flex flex-col justify-between hover:border-[#064E3B]/40 transition-all`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-xl shadow-xs overflow-hidden shrink-0 border border-emerald-100">
                  {teacher.photoUrl ? (
                    <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{teacher.name.split(' ')[1]?.[0] || teacher.name[0] || 'T'}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(teacher)}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      teacher.active !== false
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={teacher.active !== false ? 'Active (Click to hide)' : 'Hidden (Click to publish)'}
                  >
                    {teacher.active !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(teacher)}
                    className="p-1.5 text-[#064E3B] hover:bg-[#ECFDF5] rounded-lg transition-colors cursor-pointer"
                    title="Edit Teacher"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(teacher.id, teacher.name)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Teacher"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#0F172A] text-base">{teacher.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 text-[#64748B]">
                    #{teacher.display_order ?? 1}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#059669] mt-0.5">{teacher.role}</p>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs text-[#475569]">
                <p className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#064E3B] shrink-0" />
                  <span className="truncate">{teacher.qualification}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                  <span className="truncate">{teacher.experience}</span>
                </p>
              </div>

              <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                {teacher.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>Specialty: <strong className="text-[#334155]">{teacher.specialty.split(',')[0]}</strong></span>
              <span>{teacher.active !== false ? '🟢 Active' : '⚪ Hidden'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && editingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-up border border-[#E2E8F0]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {editingTeacher.id && teachers.some((t) => t.id === editingTeacher.id)
                    ? `Edit Teacher: ${editingTeacher.name || 'Profile'}`
                    : 'Add New Teacher Profile'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Information appears directly on the public faculty page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTeacher(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Photo Upload / URL & Live Avatar Preview */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E2E8F0] space-y-3">
                <label className="block font-semibold text-[#334155]">Teacher Photo / Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                    {editingTeacher.photoUrl ? (
                      <img src={editingTeacher.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>{editingTeacher.name?.split(' ')[1]?.[0] || editingTeacher.name?.[0] || 'T'}</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-[#334155] hover:bg-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#064E3B]" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload Teacher Photo'}</span>
                    </button>
                    <input
                      type="text"
                      value={editingTeacher.photoUrl || ''}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, photoUrl: e.target.value })}
                      placeholder="Or paste image URL (/uploads/...)"
                      className="w-full px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  placeholder="e.g. Qari Muhammad Anees"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">Role / Academic Title *</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.role || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, role: e.target.value })}
                  placeholder="e.g. Head Qari & Tajweed Specialist"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#334155] mb-1">Qualification</label>
                  <input
                    type="text"
                    value={editingTeacher.qualification || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                    placeholder="e.g. Certified Qari & Hafiz with Sanad"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#334155] mb-1">Teaching Experience</label>
                  <input
                    type="text"
                    value={editingTeacher.experience || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, experience: e.target.value })}
                    placeholder="e.g. 10+ Years Teaching Experience"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#334155] mb-1">Specialties &amp; Subjects</label>
                  <input
                    type="text"
                    value={editingTeacher.specialty || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, specialty: e.target.value })}
                    placeholder="e.g. Tajweed-o-Qirat, Nazra & Hifz Memorization"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#334155] mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingTeacher.display_order ?? 1}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, display_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">Biography / Teaching Philosophy</label>
                <textarea
                  rows={3}
                  value={editingTeacher.desc || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, desc: e.target.value })}
                  placeholder="Describe teaching method, specialties, background..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="teacher-active-checkbox"
                  checked={editingTeacher.active !== false}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, active: e.target.checked })}
                  className="w-4 h-4 text-[#064E3B] rounded border-slate-300 focus:ring-[#064E3B]"
                />
                <label htmlFor="teacher-active-checkbox" className="font-semibold text-[#334155]">
                  Publish profile actively on website (visible to students)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer"
                >
                  Save Teacher Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

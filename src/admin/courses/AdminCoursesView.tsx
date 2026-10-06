import React from 'react';
import { Course } from '../../types';
import { Plus, Edit2, Trash2, Eye, BookOpen, CheckCircle2 } from 'lucide-react';

interface AdminCoursesViewProps {
  courses: Course[];
  onOpenCreateModal: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export const AdminCoursesView: React.FC<AdminCoursesViewProps> = ({
  courses,
  onOpenCreateModal,
  onEditCourse,
  onDeleteCourse
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Course Management</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Add, update, reorder, or publish courses offered by Tuhfat Al-Ilm Academy.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#FAF9F5] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#64748B]">
                    {course.display_order ?? 0}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#0F172A]">{course.name}</div>
                    <div className="text-[11px] text-[#64748B] line-clamp-1">{course.shortDesc}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#064E3B] font-semibold border border-[#A7F3D0]/60">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {course.published ? (
                      <span className="inline-flex items-center gap-1 text-[#059669] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="text-[#94A3B8] font-medium">Draft</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => onEditCourse(course)}
                      className="p-1.5 text-[#064E3B] hover:bg-[#ECFDF5] rounded-lg transition-colors cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCourse(course.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

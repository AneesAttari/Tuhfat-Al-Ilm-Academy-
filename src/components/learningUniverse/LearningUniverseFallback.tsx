import React, { useState } from 'react';
import { Compass, BookOpen, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import { COURSES } from '../../data/courses';
import { LEARNING_GOALS, LearningGoal } from './types';
import { PageId, Course } from '../../types';

interface LearningUniverseFallbackProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
  errorMessage?: string;
}

export const LearningUniverseFallback: React.FC<LearningUniverseFallbackProps> = ({
  onNavigate,
  errorMessage
}) => {
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(LEARNING_GOALS[0]);

  const targetCourse: Course | undefined = selectedGoal
    ? COURSES.find((c) => c.slug === selectedGoal.targetCourseSlug || c.id === selectedGoal.targetCourseSlug)
    : COURSES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#064E3B]">
          <Compass className="w-4 h-4 text-[#D9B44A]" />
          <span>Explore Your Learning Journey</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Find the Right Quran &amp; Islamic Program for You
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {errorMessage || 'Explore our structured curriculum tailored for children, beginner adults, and advanced learners.'}
        </p>
      </div>

      {/* Goal Selection Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Step 1: What is your primary learning goal?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LEARNING_GOALS.map((goal) => {
            const isSelected = selectedGoal?.id === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#ECFDF5] border-[#064E3B] ring-2 ring-[#064E3B]/20 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>{goal.recommendedCategory}</span>
                    {isSelected && <span className="font-bold text-[#064E3B]">&bull; Selected</span>}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{goal.label}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{goal.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Course Spotlight */}
      {targetCourse && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D9B44A]/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-[#064E3B] uppercase tracking-wide">
                Recommended Academy Course
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {targetCourse.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('course-detail', targetCourse.slug)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors cursor-pointer"
              >
                Full Syllabus
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact', targetCourse.name)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Book Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {targetCourse.detailedDesc || targetCourse.shortDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-700">
            {targetCourse.duration && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Duration</span>
                <strong className="text-slate-800">{targetCourse.duration}</strong>
              </div>
            )}
            {targetCourse.instructor && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Instructor</span>
                <strong className="text-slate-800">{targetCourse.instructor}</strong>
              </div>
            )}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Format</span>
              <strong className="text-slate-800">1-on-1 Online Live</strong>
            </div>
          </div>
        </div>
      )}

      {/* Direct links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold pt-4">
        <button
          type="button"
          onClick={() => onNavigate('courses')}
          className="text-[#064E3B] hover:underline cursor-pointer"
        >
          View All 9 Academy Courses &rarr;
        </button>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="text-[#064E3B] hover:underline cursor-pointer"
        >
          Contact Admissions &rarr;
        </button>
      </div>
    </div>
  );
};

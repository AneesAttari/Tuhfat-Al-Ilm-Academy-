import React, { useState } from 'react';
import { Course, PageId } from '../types';
import { getCourseImage } from '../data/courses';
import { trackEvent } from '../utils/analytics';
import {
  Clock,
  Users,
  ArrowRight,
  BookOpen,
  BookMarked,
  Sparkles,
  Languages,
  GraduationCap,
  Compass,
  HeartHandshake,
  Sun,
  Baby
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
  priority?: boolean;
  index?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  BookMarked,
  Sparkles,
  Languages,
  GraduationCap,
  Compass,
  HeartHandshake,
  Sun,
  Baby
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onNavigate,
  priority = false,
  index = 0
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const IconComp = iconMap[course.iconName] || BookOpen;
  const imageSrc = getCourseImage(course);

  // Normalize class format for compact display
  const formatText = course.classFormat?.toLowerCase().includes('1-on-1')
    ? '1-on-1 Online'
    : 'Personalized Class';

  const durationText = course.duration || 'Flexible Pace';

  const handleCardClick = () => {
    trackEvent('course_click', { course_id: course.slug });
    onNavigate('course-detail', course.slug);
  };

  return (
    <article className="group h-full flex flex-col bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#A7F3D0] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* 1. Large, Full-Width Banner Image at the Top (Standardized 3:2 aspect ratio matching 1200x800 native images) */}
      <div
        onClick={handleCardClick}
        className="relative w-full aspect-[3/2] bg-[#F1F5F9] overflow-hidden cursor-pointer shrink-0"
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`View details for ${course.name}`}
      >
        {!imageFailed ? (
          <img
            src={imageSrc}
            alt={`${course.name} - Tuhfat Al-Ilm Academy`}
            width={1200}
            height={800}
            loading={priority || index < 3 ? 'eager' : 'lazy'}
            decoding={priority || index < 3 ? 'sync' : 'async'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Graceful Branded Fallback (Keeps exact 3:2 layout space with no layout shifts or broken UI) */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#064E3B] to-[#022C22] text-white p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2.5">
              <IconComp className="w-6 h-6 text-[#D9B44A]" />
            </div>
            <h4 className="font-bold text-base text-white line-clamp-1">{course.name}</h4>
            <span className="text-xs text-emerald-200 mt-1">{course.category}</span>
          </div>
        )}
      </div>

      {/* 2. White Content Section Underneath */}
      <div className="p-6 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Clean Unboxed Metadata Kicker (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] mb-1.5">
            <span>{course.category}</span>
            <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
            <span className="text-[#64748B] font-normal">{course.level || 'All Levels'}</span>
          </div>

          {/* Course Title */}
          <h3
            onClick={handleCardClick}
            className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#064E3B] transition-colors leading-snug cursor-pointer line-clamp-1"
            title={course.name}
          >
            {course.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-[#475569] mt-2 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {course.shortDesc}
          </p>

          {/* Course Duration & Class Details */}
          <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] grid grid-cols-2 gap-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-2" title={`Duration: ${durationText}`}>
              <span className="p-1.5 rounded-lg bg-[#ECFDF5] text-[#064E3B] shrink-0" aria-hidden="true">
                <Clock className="w-3.5 h-3.5" />
              </span>
              <div className="truncate">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">Duration</span>
                <span className="font-semibold text-[#334155] truncate">{durationText}</span>
              </div>
            </div>

            <div className="flex items-center gap-2" title={`Format: ${formatText}`}>
              <span className="p-1.5 rounded-lg bg-[#FEF3C7] text-[#B45309] shrink-0" aria-hidden="true">
                <Users className="w-3.5 h-3.5" />
              </span>
              <div className="truncate">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">Format</span>
                <span className="font-semibold text-[#334155] truncate">{formatText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons Section (Outcome-Oriented, WCAG 2.2 AA compliant >=44px) */}
        <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center gap-2.5">
          {/* Outcome-oriented "Course Details" button */}
          <button
            type="button"
            onClick={handleCardClick}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#064E3B] hover:text-white border border-[#A7F3D0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] transition-all duration-200 cursor-pointer shadow-xs group/btn"
            aria-label={`View full syllabus and details for ${course.name}`}
          >
            <span>Course Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          {/* Direct Enroll / Inquire button */}
          <button
            type="button"
            onClick={() => {
              trackEvent('enroll_click', { course: course.slug });
              onNavigate('contact', course.name);
            }}
            className="min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] transition-colors cursor-pointer shadow-xs shrink-0"
            title={`Enroll in ${course.name}`}
            aria-label={`Enroll in ${course.name}`}
          >
            Enroll
          </button>
        </div>
      </div>
    </article>
  );
};

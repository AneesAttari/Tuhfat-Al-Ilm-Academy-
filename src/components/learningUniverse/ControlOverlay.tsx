import React, { useState } from 'react';
import {
  Sun,
  Moon,
  RotateCcw,
  Maximize2,
  Minimize2,
  Compass,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  GraduationCap,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { LearningDestination, LearningGoal, LEARNING_GOALS, TimeOfDay } from './types';
import { Course, PageId } from '../../types';

interface ControlOverlayProps {
  timeOfDay: TimeOfDay;
  onToggleTimeOfDay: () => void;
  selectedDestination: LearningDestination | null;
  onSelectDestination: (dest: LearningDestination | null) => void;
  destinations: LearningDestination[];
  onResetView: () => void;
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  qualityLevel: 'high' | 'balanced' | 'low';
  onToggleQuality: () => void;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  timeOfDay,
  onToggleTimeOfDay,
  selectedDestination,
  onSelectDestination,
  destinations,
  onResetView,
  onNavigate,
  isFullscreen,
  onToggleFullscreen,
  qualityLevel,
  onToggleQuality
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'destinations'>('journey');
  const [showJourneyGuide, setShowJourneyGuide] = useState(false);

  const course = selectedDestination?.courseData;

  const handleGoalSelect = (goal: LearningGoal) => {
    const target = destinations.find(
      (d) => d.courseSlug === goal.targetCourseSlug || d.id === goal.targetCourseSlug
    );
    if (target) {
      onSelectDestination(target);
      setShowJourneyGuide(false);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-20 overflow-hidden font-sans">
      {/* ------------------------------------------------------------- */}
      {/* TOP BAR: Minimal Header Badge & Essential Viewport Controls   */}
      {/* ------------------------------------------------------------- */}
      <header className="flex items-center justify-between gap-3 w-full max-w-7xl mx-auto">
        {/* Left: Brand Badge & Return Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 hover:text-[#064E3B] border border-slate-200 shadow-sm text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Return to Main Website"
          >
            <span>&larr; Exit 3D</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E2BA49]" />
            <span className="text-xs font-semibold tracking-tight">Explore Your Learning Journey</span>
            <span className="text-slate-400 text-[11px]" aria-hidden="true">·</span>
            <span className="text-slate-300 text-[11px]">Tuhfat Al-Ilm Academy</span>
          </div>
        </div>

        {/* Right: Lighting Mode, Reset, Quality, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Day / Evening Toggle */}
          <button
            type="button"
            onClick={onToggleTimeOfDay}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title={timeOfDay === 'day' ? 'Switch to Peaceful Evening' : 'Switch to Warm Daylight'}
            aria-label="Toggle Day and Evening Lighting"
          >
            {timeOfDay === 'day' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline text-[11px] font-semibold">Daylight</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline text-[11px] font-semibold">Evening</span>
              </>
            )}
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={onResetView}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to Panoramic Garden View"
            aria-label="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline text-[11px] font-semibold">Reset View</span>
          </button>

          {/* Performance Quality Toggle */}
          <button
            type="button"
            onClick={onToggleQuality}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-sm text-[11px] font-semibold items-center gap-1 transition-all cursor-pointer"
            title={`Quality: ${qualityLevel.toUpperCase()}`}
          >
            <span className="text-slate-400">Quality:</span>
            <span className="text-[#064E3B] capitalize">{qualityLevel}</span>
          </button>

          {/* Fullscreen Button */}
          {typeof document !== 'undefined' && document.fullscreenEnabled && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1.5 sm:px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-medium flex items-center transition-all cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-slate-700" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* CENTER VIEWPORT: 100% UNOBSTRUCTED (For Orbit & Exploration)  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex items-center justify-center pointer-events-none" />

      {/* ------------------------------------------------------------- */}
      {/* UNIFIED BOTTOM DOCK (Zero Viewport Occlusion Discipline)      */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto flex flex-col items-center">
        {/* Dock Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-1.5 px-3 py-1 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
          aria-label={isDockCollapsed ? 'Show Controls Dock' : 'Hide Controls Dock'}
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Show Exploration Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        {/* Collapsible Container */}
        <div
          className={`w-full transition-all duration-300 ease-out transform ${
            isDockCollapsed
              ? 'translate-y-full opacity-0 pointer-events-none h-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          {/* A. If a destination is SELECTED: Render Elevated Course Details Plaque */}
          {selectedDestination ? (
            <div className="w-full rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-[#D9B44A]/40 shadow-2xl text-slate-900 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="text-[#064E3B] font-semibold">{selectedDestination.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-700 font-arabic font-bold text-sm">
                      {selectedDestination.arabicTitle}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#064E3B] tracking-tight">
                    {selectedDestination.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDestination(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close and return to overview"
                  aria-label="Close Course Details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Course Description */}
              <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {course?.detailedDesc || selectedDestination.tagline}
              </p>

              {/* Course Authentic Specs (from real course data, Zero hallucination) */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                {course?.duration && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Duration:</span>
                    <strong className="text-slate-800">{course.duration}</strong>
                  </div>
                )}
                {course?.instructor && (
                  <>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Faculty:</span>
                      <strong className="text-slate-800">{course.instructor}</strong>
                    </div>
                  </>
                )}
                {course?.level && (
                  <>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Level:</span>
                      <strong className="text-slate-800">{course.level}</strong>
                    </div>
                  </>
                )}
                <span className="text-slate-300" aria-hidden="true">·</span>
                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Personalized 1-on-1</span>
                </div>
              </div>

              {/* Actions: View Course Page & Book Free Trial */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectDestination(null)}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
                >
                  &larr; View Garden Courtyard
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onNavigate('course-detail', selectedDestination.courseSlug)}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Course Syllabus</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('contact', selectedDestination.title)}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Book Free Trial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* B. When NO destination is selected: Tabs for Learning Journey Guide & Carousel */
            <div className="w-full rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-4 border border-slate-200 shadow-xl text-slate-900">
              {/* Tabs Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2.5">
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('journey')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'journey'
                        ? 'bg-white text-[#064E3B] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-[#D9B44A]" />
                    <span>Learning Journey</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('destinations')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'destinations'
                        ? 'bg-white text-[#064E3B] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>All 9 Destinations</span>
                  </button>
                </div>

                <span className="hidden sm:inline text-[11px] text-slate-400">
                  Drag to rotate 3D view · Click pavilion to enter
                </span>
              </div>

              {/* Tab Content: Learning Journey ("What would you like to learn?") */}
              {activeTab === 'journey' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700">
                      What would you like to learn today?
                    </p>
                    <span className="text-[11px] text-[#064E3B] font-medium">
                      Select a goal to fly directly to its pavilion
                    </span>
                  </div>

                  {/* Horizontal Scroll of Goals */}
                  <div className="flex items-stretch gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {LEARNING_GOALS.map((goal) => (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => handleGoalSelect(goal)}
                        className="min-w-[200px] sm:min-w-[230px] p-2.5 text-left rounded-xl bg-slate-50 hover:bg-[#ECFDF5] border border-slate-200 hover:border-[#A7F3D0] transition-all cursor-pointer group flex flex-col justify-between shrink-0"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-[#064E3B] transition-colors leading-tight">
                            {goal.label}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                            {goal.description}
                          </p>
                        </div>
                        <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-[#064E3B]">
                          <span>{goal.recommendedCategory}</span>
                          <span className="font-semibold">&rarr;</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Destinations Carousel */}
              {activeTab === 'destinations' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Active Academy Programs</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('courses')}
                      className="text-xs font-semibold text-[#064E3B] hover:underline cursor-pointer"
                    >
                      View All Courses Grid &rarr;
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {destinations.map((dest) => (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => onSelectDestination(dest)}
                        className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#FAF9F5] border border-slate-200 hover:border-[#064E3B] text-left transition-all cursor-pointer shrink-0 min-w-[150px] group"
                      >
                        <p className="text-[10px] text-slate-400 group-hover:text-[#064E3B] truncate">
                          {dest.category}
                        </p>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#064E3B] truncate">
                          {dest.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

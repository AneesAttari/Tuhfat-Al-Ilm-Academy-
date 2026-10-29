import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageId } from '../types';
import { COURSES } from '../data/courses';
import { LearningDestination, TimeOfDay } from '../components/learningUniverse/types';
import { LearningUniverseStage } from '../components/learningUniverse/LearningUniverseStage';
import { ControlOverlay } from '../components/learningUniverse/ControlOverlay';
import { LearningUniverseFallback } from '../components/learningUniverse/LearningUniverseFallback';
import { trackEvent } from '../utils/analytics';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';

interface ExploreJourneyPageProps {
  onNavigate: (page: PageId, courseSlugOrName?: string) => void;
  initialCourseSlug?: string;
}

const DESTINATION_CONFIGS = [
  { slug: 'quran-reading', arabic: 'القراءة والناظرة', color: '#064E3B', tagline: 'Alphabet recognition, Qaida & fluid Quran reading' },
  { slug: 'hifz-ul-quran', arabic: 'حفظ القرآن الكريم', color: '#047857', tagline: 'Structured memorization with daily revision & Sabaq' },
  { slug: 'tajweed', arabic: 'تجويد وقراءة', color: '#0D9488', tagline: 'Makharij, Sifaat & classical melodious recitation' },
  { slug: 'quran-translation', arabic: 'ترجمة القرآن وتفسيره', color: '#0284C7', tagline: 'Word-for-word vocabulary & contextual understanding' },
  { slug: 'islamic-studies', arabic: 'الدراسات الإسلامية', color: '#0F766E', tagline: 'Aqeedah, Fiqh, Seerah & prophetic wisdom' },
  { slug: 'basic-islamic-knowledge', arabic: 'أساسيات المعرفة الإسلامية', color: '#059669', tagline: 'Step-by-step Salah (Namaz), Wudu & obligations' },
  { slug: 'islah-character-development', arabic: 'إصلاح النفس والأخلاق', color: '#D97706', tagline: 'Islamic Adab, patience, humility & family values' },
  { slug: 'dua-and-sunnah', arabic: 'الأدعية والسنن اليومية', color: '#B45309', tagline: 'Daily protection Adhkar & prophetic habits' },
  { slug: 'childrens-islamic-education', arabic: 'تعليم الأطفال الإسلامي', color: '#10B981', tagline: 'Joyful, patient 1-on-1 learning for young hearts' }
];

export const ExploreJourneyPage: React.FC<ExploreJourneyPageProps> = ({
  onNavigate,
  initialCourseSlug
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [selectedDestination, setSelectedDestination] = useState<LearningDestination | null>(null);
  const [destinations, setDestinations] = useState<LearningDestination[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSceneLoading, setIsSceneLoading] = useState(true);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Auto-detect initial quality based on hardware / mobile screen width
  const [qualityLevel, setQualityLevel] = useState<'high' | 'balanced' | 'low'>(() => {
    if (typeof window === 'undefined') return 'high';
    if (window.innerWidth < 640) return 'balanced';
    return 'high';
  });

  // Prepare destinations list from real course data
  useEffect(() => {
    const list: LearningDestination[] = [];
    const total = DESTINATION_CONFIGS.length;
    const radius = 22;

    DESTINATION_CONFIGS.forEach((cfg, idx) => {
      const course = COURSES.find((c) => c.slug === cfg.slug || c.id === cfg.slug);
      const angle = (idx * Math.PI * 2) / total - Math.PI / 2;

      list.push({
        id: cfg.slug,
        courseId: course ? course.id : cfg.slug,
        courseSlug: cfg.slug,
        title: course ? course.name : cfg.slug,
        arabicTitle: cfg.arabic,
        category: course ? course.category : 'Academy Program',
        tagline: course ? course.shortDesc : cfg.tagline,
        iconName: course ? course.iconName : 'BookOpen',
        angle,
        distance: radius,
        accentColor: cfg.color,
        courseData: course
      });
    });

    setDestinations(list);

    if (initialCourseSlug) {
      const target = list.find((d) => d.courseSlug === initialCourseSlug || d.id === initialCourseSlug);
      if (target) {
        setSelectedDestination(target);
      }
    }

    trackEvent('explore_3d_universe_view', { initialCourse: initialCourseSlug || 'none' });
  }, [initialCourseSlug]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleToggleTimeOfDay = useCallback(() => {
    setTimeOfDay((prev) => {
      const next = prev === 'day' ? 'evening' : 'day';
      trackEvent('toggle_time_of_day', { mode: next });
      return next;
    });
  }, []);

  const handleToggleQuality = useCallback(() => {
    setQualityLevel((prev) => {
      if (prev === 'high') return 'balanced';
      if (prev === 'balanced') return 'low';
      return 'high';
    });
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedDestination(null);
    setResetKey((k) => k + 1);
  }, []);

  const handleSelectDestination = useCallback((dest: LearningDestination | null) => {
    setSelectedDestination(dest);
    if (dest) {
      trackEvent('select_3d_destination', {
        course: dest.courseSlug,
        title: dest.title
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        isFullscreen ? 'h-screen fixed inset-0 z-50 bg-black' : 'h-[82vh] min-h-[580px] max-h-[920px]'
      } overflow-hidden bg-[#FAF9F5] select-none`}
    >
      {/* Fallback View if WebGL fails */}
      {webglError ? (
        <LearningUniverseFallback onNavigate={onNavigate} errorMessage={webglError} />
      ) : (
        <>
          {/* Main 3D Canvas Stage */}
          <LearningUniverseStage
            key={resetKey}
            timeOfDay={timeOfDay}
            selectedDestinationId={selectedDestination?.id || null}
            onSelectDestination={handleSelectDestination}
            onSceneReady={() => setIsSceneLoading(false)}
            onError={(err) => setWebglError(err)}
            qualityLevel={qualityLevel}
          />

          {/* Interactive UI Overlay & Collapsible Dock */}
          <ControlOverlay
            timeOfDay={timeOfDay}
            onToggleTimeOfDay={handleToggleTimeOfDay}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            destinations={destinations}
            onResetView={handleResetView}
            onNavigate={onNavigate}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            qualityLevel={qualityLevel}
            onToggleQuality={handleToggleQuality}
          />

          {/* Loading Screen Overlay while shaders prewarm */}
          {isSceneLoading && (
            <div className="absolute inset-0 z-30 bg-[#FAF9F5] flex flex-col items-center justify-center space-y-3 pointer-events-none transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full border-3 border-[#064E3B] border-t-transparent animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-[#064E3B] tracking-tight">
                  Tuhfat Al-Ilm Academy
                </p>
                <p className="text-xs text-slate-500">
                  Preparing the 3D Architectural Learning Garden...
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

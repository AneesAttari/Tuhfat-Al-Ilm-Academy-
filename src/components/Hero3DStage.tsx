import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ShieldCheck, Clock, BookOpen, Sparkles, GraduationCap } from 'lucide-react';
const heroImg = '/images/closed_quran_rehal.webp';

interface Hero3DStageProps {
  onExploreCourses?: () => void;
}

export const Hero3DStage: React.FC<Hero3DStageProps> = ({ onExploreCourses }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
      const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      motionQuery.addEventListener('change', motionListener);

      const touchQuery = window.matchMedia('(hover: none)');
      setIsTouchDevice(touchQuery.matches);
      const touchListener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
      touchQuery.addEventListener('change', touchListener);

      return () => {
        motionQuery.removeEventListener('change', motionListener);
        touchQuery.removeEventListener('change', touchListener);
      };
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || isTouchDevice || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      // Normalized coordinates from -1 to 1
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setCoords({
          x: parseFloat(x.toFixed(3)),
          y: parseFloat(y.toFixed(3))
        });
        setIsHovered(true);
      });
    },
    [prefersReducedMotion, isTouchDevice]
  );

  const handlePointerLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setCoords({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  // Compute 3D rotation angles (clamped for tasteful, elegant institutional feel)
  const rotX = isHovered && !prefersReducedMotion ? -coords.y * 7 : 0;
  const rotY = isHovered && !prefersReducedMotion ? coords.x * 9 : 0;

  // Specular light coordinates
  const lightX = 50 + coords.x * 35;
  const lightY = 50 + coords.y * 35;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => !isTouchDevice && setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-lg lg:max-w-none mx-auto [perspective:1400px] select-none cursor-default group"
    >
      {/* 3D Master Transform Container */}
      <div
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`,
          transition: isHovered
            ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="relative w-full rounded-3xl [transform-style:preserve-3d] will-change-transform"
      >
        {/* Layer 0: Ambient Islamic Geometric Star Backdrop & Soft Radial Aura */}
        <div
          style={{
            transform: `translate3d(${coords.x * -12}px, ${coords.y * -12}px, -20px)`
          }}
          className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-gradient-to-tr from-[#064E3B]/10 via-[#D9B44A]/15 to-transparent blur-2xl pointer-events-none transition-transform duration-300"
          aria-hidden="true"
        />

        {/* Decorative Floating 8-Point Islamic Star Rosette (Background Layer) */}
        <div
          style={{
            transform: `translate3d(${coords.x * -16}px, ${coords.y * -16}px, -10px) rotate(${coords.x * 12}deg)`
          }}
          className="absolute -top-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 text-[#D9B44A]/20 pointer-events-none transition-transform duration-300 hidden sm:block"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <polygon points="50,0 63,35 100,50 63,65 50,100 37,65 0,50 37,35" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Layer 1: Main 3D Card Shell */}
        <div className="relative rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md p-3 sm:p-4 border border-[#D9B44A]/35 shadow-[0_25px_60px_-15px_rgba(6,78,59,0.2),0_12px_30px_-10px_rgba(217,180,74,0.18)] transition-shadow duration-300">
          {/* Dynamic Gold Specular Glare (Reacts smoothly to cursor) */}
          <div
            style={{
              background: `radial-gradient(circle 350px at ${lightX}% ${lightY}%, rgba(217, 180, 74, 0.22) 0%, rgba(5, 150, 105, 0.08) 45%, transparent 75%)`,
              opacity: isHovered ? 1 : 0.35,
              transition: 'opacity 300ms ease-out'
            }}
            className="absolute inset-0 pointer-events-none z-20 rounded-3xl"
            aria-hidden="true"
          />

          {/* Layer 2: Elevated Visual Frame (Respectfully presented Quran on Rehal) */}
          <div
            style={{
              transform: 'translateZ(18px)'
            }}
            className="relative aspect-[16/11] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAF9F5] border border-[#E5E2D9] shadow-inner transition-transform duration-300"
          >
            <img
              src={heroImg}
              alt="A respectfully placed closed Quran-e-Pak on a wooden rehal at Tuhfat Al-Ilm Academy."
              width={640}
              height={440}
              className="w-full h-full object-cover object-center scale-[1.02] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Gradient Scrim ensuring 100% legibility */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Overlay Emblem & Text */}
            <div
              style={{
                transform: 'translateZ(26px)'
              }}
              className="absolute bottom-3.5 left-3.5 right-3.5 text-white transition-transform duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B44A]" aria-hidden="true" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#FDE68A] drop-shadow-sm">
                  Online Quran &amp; Islamic Studies
                </span>
              </div>
              <p className="font-bold text-base sm:text-lg drop-shadow-md text-white tracking-tight">
                Tuhfat Al-Ilm Academy
              </p>
              <p className="text-white/90 drop-shadow-sm text-xs sm:text-[13px] line-clamp-1 mt-0.5">
                Authentic 1-on-1 education tailored for international students
              </p>
            </div>
          </div>

          {/* Layer 3: Floating Institutional Trust Plaque (Elevated to translateZ 32px) */}
          <div
            style={{
              transform: 'translateZ(32px)'
            }}
            className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-3 bg-gradient-to-r from-white via-[#FAF9F5] to-white rounded-2xl border border-[#D9B44A]/30 text-xs text-[#334155] shadow-sm transition-transform duration-300"
          >
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
              </span>
              <div>
                <strong className="block text-[#0F172A] font-bold text-xs">Certified Huffaz &amp; Scholars</strong>
                <span className="text-[#64748B] text-[11px]">Authentic Tajweed Sanad</span>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-[#E2E8F0]" aria-hidden="true" />

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#2563EB]" />
              </span>
              <div>
                <strong className="block text-[#0F172A] font-bold text-xs">Worldwide Schedules</strong>
                <span className="text-[#64748B] text-[11px]">USA · UK · Gulf · Australia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

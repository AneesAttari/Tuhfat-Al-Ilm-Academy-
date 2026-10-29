import { useState, useRef, useEffect, useCallback } from 'react';

export interface Use3DTiltOptions {
  maxTilt?: number; // max tilt in degrees (e.g. 7)
  scale?: number; // slight scale on hover/interaction (e.g. 1.015)
  perspective?: number; // CSS perspective in px (e.g. 1000)
  speed?: number; // transition speed in ms
  glare?: boolean; // whether to calculate glare coordinates
  disabled?: boolean;
}

export interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  glareX: number;
  glareY: number;
  glareOpacity: number;
  isHovered: boolean;
}

export function use3DTilt<T extends HTMLElement = HTMLDivElement>(options: Use3DTiltOptions = {}) {
  const {
    maxTilt = 7,
    scale = 1.016,
    perspective = 1100,
    speed = 320,
    glare = true,
    disabled = false
  } = options;

  const elementRef = useRef<T | null>(null);
  const rafId = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false
  });

  // Detect accessibility preference for reduced motion and touch devices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', motionListener);

        const touchQuery = window.matchMedia('(hover: none)');
        setIsTouchDevice(touchQuery.matches);
        const touchListener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
        touchQuery.addEventListener('change', touchListener);

        return () => {
          mediaQuery.removeEventListener('change', motionListener);
          touchQuery.removeEventListener('change', touchListener);
        };
      }
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // On touch devices or reduced motion, skip tilt calculation during drag/scroll to keep 60fps scrolling
      if (disabled || prefersReducedMotion || e.pointerType === 'touch' || !elementRef.current) {
        return;
      }

      const rect = elementRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

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

      const x = (clientX - rect.left) / width;
      const y = (clientY - rect.top) / height;

      const rotX = (0.5 - y) * maxTilt * 2;
      const rotY = (x - 0.5) * maxTilt * 2;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        setTilt({
          rotateX: parseFloat(rotX.toFixed(2)),
          rotateY: parseFloat(rotY.toFixed(2)),
          scale,
          glareX: parseFloat((x * 100).toFixed(1)),
          glareY: parseFloat((y * 100).toFixed(1)),
          glareOpacity: glare ? 0.35 : 0,
          isHovered: true
        });
      });
    },
    [disabled, prefersReducedMotion, maxTilt, scale, glare]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || prefersReducedMotion || e.pointerType === 'touch') return;
      setTilt((prev) => ({ ...prev, isHovered: true }));
    },
    [disabled, prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: false
    });
  }, []);

  // Mobile touch feedback handlers (clean subtle press without disrupting scroll)
  const handleTouchStart = useCallback(() => {
    if (disabled || prefersReducedMotion) return;
    setTilt((prev) => ({ ...prev, scale: 1.012, isHovered: true }));
  }, [disabled, prefersReducedMotion]);

  const handleTouchEnd = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: false
    });
  }, []);

  // Compute CSS transform and styles
  const transform =
    !disabled && !prefersReducedMotion && tilt.isHovered
      ? `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`
      : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

  const transition = tilt.isHovered
    ? `transform ${speed * 0.35}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${speed}ms ease-out`
    : `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${speed}ms ease-out`;

  const glareStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    zIndex: 10,
    background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(217, 180, 74, 0.2) 0%, rgba(5, 150, 105, 0.08) 40%, transparent 80%)`,
    opacity: tilt.glareOpacity,
    transition: `opacity ${speed}ms ease-out`
  };

  return {
    elementRef,
    tilt,
    transform,
    transition,
    glareStyle,
    isHovered: tilt.isHovered,
    bind: {
      ref: elementRef,
      onPointerMove: handlePointerMove,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd
    }
  };
}

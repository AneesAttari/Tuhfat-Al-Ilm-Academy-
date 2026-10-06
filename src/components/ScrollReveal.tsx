import React, { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade-in' | 'zoom-in';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  distance?: number; // in pixels (offset distance)
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'fade-up',
  delay = 0,
  duration = 650,
  distance = 24,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  className = '',
  as: Component = 'div',
  once = true,
  style,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Respect accessibility reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  // Compute initial transform based on direction
  const getInitialTransform = (): string => {
    switch (direction) {
      case 'fade-up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'fade-down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'fade-left':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'fade-right':
        return `translate3d(${distance}px, 0, 0)`;
      case 'zoom-in':
        return 'scale3d(0.95, 0.95, 1)';
      case 'fade-in':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const dynamicStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale3d(1, 1, 1)' : getInitialTransform(),
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    ...style,
  };

  return (
    <Component ref={elementRef} className={className} style={dynamicStyle} {...rest}>
      {children}
    </Component>
  );
};

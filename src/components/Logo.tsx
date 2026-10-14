import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon' | 'monochrome';
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LOGO_HEADER_SRC = '/tuhfat-al-ilm-header.webp';
export const LOGO_HEADER_FALLBACK = '/tuhfat-al-ilm-header.png';
export const LOGO_STACKED_SRC = '/tuhfat-al-ilm-logo.webp';
export const LOGO_STACKED_FALLBACK = '/tuhfat-al-ilm-logo.png';
export const LOGO_FAVICON_SRC = '/tuhfat-al-ilm-favicon.webp';
export const OFFICIAL_LOGO_SRC = '/tuhfat-al-ilm-header.webp';

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'horizontal',
  iconOnly = false,
  size = 'md'
}) => {
  // Dimensions for various sizes
  const dimensions = {
    sm: { headerHeight: 36, iconSize: 36 },
    md: { headerHeight: 46, iconSize: 48 },
    lg: { headerHeight: 58, iconSize: 68 },
    xl: { headerHeight: 72, iconSize: 96 }
  }[size];

  if (iconOnly || variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
      >
        <img
          src={LOGO_FAVICON_SRC}
          alt="Tuhfat Al-Ilm Academy Icon"
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          className="w-full h-full object-contain shrink-0 select-none pointer-events-none"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'full') {
    const fullSize = Math.round(dimensions.iconSize * 1.8);
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <picture>
          <source srcSet={LOGO_STACKED_SRC} type="image/webp" />
          <img
            src={LOGO_STACKED_FALLBACK}
            alt="Tuhfat Al-Ilm Academy Logo"
            width={fullSize}
            height={fullSize}
            style={{ width: fullSize, height: fullSize }}
            className="object-contain select-none pointer-events-none"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>
    );
  }

  // Horizontal variant (Header, Mobile Navigation Drawer & Footer)
  const headerWidth = Math.round(dimensions.headerHeight * (1600 / 440));
  return (
    <div className={`inline-flex items-center ${className}`}>
      <picture className="inline-flex items-center">
        <source srcSet={LOGO_HEADER_SRC} type="image/webp" />
        <img
          src={LOGO_HEADER_FALLBACK}
          alt="Tuhfat Al-Ilm Academy"
          width={headerWidth}
          height={dimensions.headerHeight}
          style={{ height: dimensions.headerHeight, width: 'auto' }}
          className="w-auto max-w-full object-contain shrink-0 select-none pointer-events-none transition-transform group-hover:scale-[1.02]"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
};

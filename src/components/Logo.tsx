import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon' | 'monochrome';
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LOGO_HEADER_SRC = '/tuhfat-al-ilm-header.png';
export const LOGO_STACKED_SRC = '/tuhfat-al-ilm-logo.png';
export const LOGO_FAVICON_SRC = '/tuhfat-al-ilm-favicon.png';
export const OFFICIAL_LOGO_SRC = '/tuhfat-al-ilm-header.png';

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
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src={LOGO_STACKED_SRC}
          alt="Tuhfat Al-Ilm Academy Logo"
          style={{ width: dimensions.iconSize * 1.8, height: dimensions.iconSize * 1.8 }}
          className="object-contain select-none pointer-events-none"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Horizontal variant (Header, Mobile Navigation Drawer & Footer)
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={LOGO_HEADER_SRC}
        alt="Tuhfat Al-Ilm Academy"
        style={{ height: dimensions.headerHeight }}
        className="w-auto max-w-full object-contain shrink-0 select-none pointer-events-none transition-transform group-hover:scale-[1.02]"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

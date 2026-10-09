import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon' | 'monochrome';
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const OFFICIAL_LOGO_SRC = '/Tuhfat_Al_Ilm_Academy_Logo.png';

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'horizontal',
  iconOnly = false,
  size = 'md'
}) => {
  // Dimensions for various sizes (preserving 1536:1128 aspect ratio)
  const dimensions = {
    sm: { iconWidth: 52, iconHeight: 38, textSize: 'text-sm' },
    md: { iconWidth: 65, iconHeight: 48, textSize: 'text-lg' },
    lg: { iconWidth: 92, iconHeight: 68, textSize: 'text-2xl' },
    xl: { iconWidth: 130, iconHeight: 96, textSize: 'text-3xl' }
  }[size];

  // Official uploaded logo image element rendered directly with object-contain
  const LogoIcon = () => (
    <img
      src={OFFICIAL_LOGO_SRC}
      alt="Tuhfat Al-Ilm Academy Logo"
      width={dimensions.iconWidth}
      height={dimensions.iconHeight}
      className="w-full h-full object-contain shrink-0 select-none pointer-events-none"
      loading="eager"
      decoding="async"
    />
  );

  if (iconOnly || variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: dimensions.iconWidth, height: dimensions.iconHeight }}
      >
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div style={{ width: dimensions.iconWidth * 1.8, height: dimensions.iconHeight * 1.8 }}>
          <LogoIcon />
        </div>
        <div className="mt-3 flex flex-col items-center">
          <span className="font-serif font-extrabold tracking-tight text-[#00583E] text-xl sm:text-2xl uppercase">
            Tuhfat Al-Ilm
          </span>
          <div className="flex items-center gap-3 w-full justify-center my-1">
            <div className="h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C89B3C] tracking-[0.25em] uppercase">
              Academy
            </span>
            <div className="h-[1px] w-8 bg-[#C89B3C]" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-[#A87E2B] tracking-[0.18em] uppercase">
            Qur'an • Islamic Studies • Global Learning
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (Header, Mobile Navigation & Footer)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        style={{ width: dimensions.iconWidth, height: dimensions.iconHeight }}
        className="shrink-0 transition-transform group-hover:scale-105"
      >
        <LogoIcon />
      </div>
      <div className="flex flex-col text-left">
        <span className={`font-bold text-[#00583E] tracking-tight leading-tight ${dimensions.textSize}`}>
          Tuhfat Al-Ilm Academy
        </span>
        <span className="text-[11px] sm:text-xs text-[#C89B3C] font-medium tracking-wide">
          Qur'an &amp; Islamic Studies
        </span>
      </div>
    </div>
  );
};

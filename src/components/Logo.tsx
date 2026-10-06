import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon' | 'monochrome';
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'horizontal',
  iconOnly = false,
  size = 'md'
}) => {
  // Dimensions for various sizes
  const dimensions = {
    sm: { iconWidth: 34, iconHeight: 34, textSize: 'text-sm' },
    md: { iconWidth: 44, iconHeight: 44, textSize: 'text-lg' },
    lg: { iconWidth: 64, iconHeight: 64, textSize: 'text-2xl' },
    xl: { iconWidth: 90, iconHeight: 90, textSize: 'text-3xl' }
  }[size];

  // Exact color palette sampled directly from the official logo photo
  const emeraldMain = '#00583E';
  const emeraldDark = '#003E2B';
  const goldMain = '#C89B3C';
  const goldLight = '#E0B554';

  // Exact 1:1 SVG vector icon matching the user's uploaded logo image
  const LogoIcon = () => (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full shrink-0"
      aria-hidden="true"
    >
      {/* Top Gold 4-Pointed Star */}
      <path
        d="M 200 28 Q 202 62 222 72 Q 202 82 200 116 Q 198 82 178 72 Q 198 62 200 28 Z"
        fill="url(#goldGradMain)"
      />

      {/* Central Vertical Gold Ray & Lower Diamond Star */}
      <path
        d="M 198 124 L 202 124 L 202 278 L 198 278 Z"
        fill="url(#goldGradMain)"
      />
      <path
        d="M 200 274 Q 201 283 210 286 Q 201 289 200 298 Q 199 289 190 286 Q 199 283 200 274 Z"
        fill="url(#goldGradMain)"
      />

      {/* Left Emerald Wing */}
      <g>
        {/* Main Upper 'T' & Column Structure */}
        <path
          d="M 72 112 H 184 V 270 L 197 298 V 134 H 144 V 222 L 108 184 L 72 204 V 112 Z"
          fill="url(#emeraldGradLeft)"
        />
        {/* Lower Book Page Curve / Shadow */}
        <path
          d="M 72 204 L 108 184 L 144 222 V 270 L 197 298 C 152 276 104 270 56 274 L 72 204 Z"
          fill={emeraldDark}
        />
      </g>

      {/* Right Emerald Wing (Mirrored) */}
      <g>
        {/* Main Upper 'T' & Column Structure */}
        <path
          d="M 328 112 H 216 V 270 L 203 298 V 134 H 256 V 222 L 292 184 L 328 204 V 112 Z"
          fill="url(#emeraldGradRight)"
        />
        {/* Lower Book Page Curve / Shadow */}
        <path
          d="M 328 204 L 292 184 L 256 222 V 270 L 203 298 C 248 276 296 270 344 274 L 328 204 Z"
          fill={emeraldDark}
        />
      </g>

      {/* Bottom Gold Curved Base (Quran Rehal Stand) */}
      <path
        d="M 56 282 C 106 274, 162 296, 200 338 C 238 296, 294 274, 344 282 C 292 296, 242 316, 200 326 C 158 316, 108 296, 56 282 Z"
        fill="url(#goldGradMain)"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="goldGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="100%" stopColor={goldMain} />
        </linearGradient>

        <linearGradient id="emeraldGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006C4B" />
          <stop offset="100%" stopColor={emeraldMain} />
        </linearGradient>

        <linearGradient id="emeraldGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#006C4B" />
          <stop offset="100%" stopColor={emeraldMain} />
        </linearGradient>
      </defs>
    </svg>
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

  // Horizontal variant (Header & Footer)
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

import React from 'react';
import { use3DTilt, Use3DTiltOptions } from '../hooks/use3DTilt';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tiltOptions?: Use3DTiltOptions;
  className?: string;
  glare?: boolean;
  elevationShadow?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  tiltOptions = {},
  className = '',
  glare = true,
  elevationShadow = true,
  style,
  ...rest
}) => {
  const { bind, transform, transition, glareStyle, isHovered } = use3DTilt<HTMLDivElement>({
    maxTilt: 7,
    scale: 1.016,
    perspective: 1100,
    speed: 350,
    glare,
    ...tiltOptions
  });

  const shadowClass = elevationShadow && isHovered
    ? 'shadow-[0_20px_40px_-15px_rgba(6,78,59,0.14),0_10px_25px_-10px_rgba(217,180,74,0.12)]'
    : '';

  return (
    <div
      {...bind}
      {...rest}
      className={`relative transition-all will-change-transform [transform-style:preserve-3d] ${shadowClass} ${className}`}
      style={{
        transform,
        transition,
        ...style
      }}
    >
      {children}
      {glare && <div style={glareStyle} aria-hidden="true" />}
    </div>
  );
};

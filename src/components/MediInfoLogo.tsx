import React from 'react';

interface MediInfoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  tagline?: string;
  className?: string;
}

export const MediInfoLogo: React.FC<MediInfoLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  tagline = 'Web Medicine Intelligence & Pill Identification',
  className = '',
}) => {
  // Natural, confident emblem height matching typography baseline
  const emblemHeights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  }[size];

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 
        Clean, Unboxed Medical Emblem Graphic 
        - No awkward background box, no borders, no padding
        - Authentic medical emblem from provided brand in rich #0F172A slate
        - Exactly matches the 'Medi' wordmark color
      */}
      <img
        src="/mediinfo-emblem-brand.png"
        alt="MediInfo Emblem"
        className={`${emblemHeights} w-auto object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
        referrerPolicy="no-referrer"
        loading="eager"
      />

      {/* Harmonized Web Name 'MediInfo' */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline tracking-tight">
            <span
              className={`font-['Manrope'] font-black text-[#0F172A] ${textSizes}`}
            >
              Medi
            </span>
            <span
              className={`font-['Manrope'] font-black text-[#2563EB] ${textSizes}`}
            >
              Info
            </span>
          </div>
          {showTagline && (
            <span className="text-[11px] font-semibold text-slate-500 mt-1 font-['Inter'] tracking-tight hidden sm:inline">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const MinaLogo = MediInfoLogo;
export default MediInfoLogo;

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subtextSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-[13px]',
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`} id="vierbach-logo">
      <div className={`relative flex items-center justify-center bg-slate-950 text-amber-400 rounded-lg shadow-sm border border-slate-800 ${iconSizes[size]}`}>
        {/* Custom Crane / Hook SVG */}
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4/5 h-4/5">
          {/* Crane Tower */}
          <path d="M10 30L10 8" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 12L16 16M10 20L16 24M10 28L16 30" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          {/* Crane Jib/Boom */}
          <path d="M10 8L30 8" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 8L20 4M24 8L28 4" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          {/* Crane Cable & Hook */}
          <path d="M26 8L26 20" stroke="#F8FAFC" strokeWidth="1.5" strokeDasharray="2 1.5" />
          <path d="M24 20H28L26 23L26 26C26 27.5 24.5 28 23.5 27" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Base */}
          <path d="M6 30H14" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded leading-none">
          AT6
        </span>
      </div>

      <div className="flex flex-col">
        <span className={`font-extrabold uppercase tracking-wider text-amber-500 ${textSizes[size]} leading-none`}>
          VIERBACH
        </span>
        <span className={`font-semibold tracking-wider text-slate-600 uppercase ${subtextSizes[size]} leading-tight`}>
          Hijskraanverhuur
        </span>
      </div>
    </div>
  );
};

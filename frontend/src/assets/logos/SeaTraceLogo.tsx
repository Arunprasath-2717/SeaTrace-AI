import React from 'react';

interface SeaTraceLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const SeaTraceLogo: React.FC<SeaTraceLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 24, font: 'text-sm' },
    md: { icon: 32, font: 'text-base' },
    lg: { icon: 44, font: 'text-xl' },
  };

  const { icon: iconSize, font: fontClass } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="32" cy="32" r="28" stroke="#1D566E" strokeWidth="2.5" strokeDasharray="4 3" />
        <circle cx="32" cy="32" r="19" stroke="#21ABA5" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="10" fill="#163A5F" stroke="#45EBA5" strokeWidth="2.5" />
        <path d="M32 4V60M4 32H60" stroke="#1D566E" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M32 32L51 13" stroke="#45EBA5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="51" cy="13" r="4" fill="#45EBA5" />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-wider text-seatrace-text-primary ${fontClass}`}>
              SEATRACE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-seatrace-mint animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-seatrace-teal">
            Maritime Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default SeaTraceLogo;

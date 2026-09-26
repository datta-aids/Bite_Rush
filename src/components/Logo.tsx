import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false, size = 'md' }) => {
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

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      {/* Original BiteRush Icon: Stylized Gourmet Burger & Fast Lightning Rush */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-2 shadow-lg shadow-orange-500/25 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Top sesame bun */}
          <path
            d="M3 10C3 5.58 6.58 3 12 3C17.42 3 21 5.58 21 10C21 10.55 20.55 11 20 11H4C3.45 11 3 10.55 3 10Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          {/* Sesame seeds dots */}
          <circle cx="8" cy="6.5" r="0.75" fill="#fef08a" />
          <circle cx="12" cy="5.5" r="0.75" fill="#fef08a" />
          <circle cx="16" cy="7" r="0.75" fill="#fef08a" />
          {/* Savory patty layer */}
          <rect x="3.5" y="12" width="17" height="2.5" rx="1.25" fill="#78350f" />
          {/* Melted Cheese drip */}
          <path
            d="M5 14.5L7 17L10 14.5L14 16.5L17 14.5L19 16L20 14.5"
            stroke="#facc15"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom toasted bun */}
          <path
            d="M4 18.5C4 18 4.45 17.5 5 17.5H19C19.55 17.5 20 18 20 18.5C20 20.43 16.42 21 12 21C7.58 21 4 20.43 4 18.5Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          {/* Dynamic lightning rush slash across center */}
          <path
            d="M13.5 2L8.5 11.5H13L10.5 20.5L18.5 9.5H13.5L16 2H13.5Z"
            fill="#fef08a"
            stroke="#b45309"
            strokeWidth="0.8"
            className="drop-shadow-md"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={`font-black uppercase tracking-tight text-white font-display ${textSizes[size]}`}>
            Bite<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">Rush</span>
          </span>
          <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 uppercase tracking-widest hidden sm:inline-block">
            FAST
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 tracking-wider font-medium -mt-0.5">
            Your Cravings. Our Rush.
          </span>
        )}
      </div>
    </div>
  );
};

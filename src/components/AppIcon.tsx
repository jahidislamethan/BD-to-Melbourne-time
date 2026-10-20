import React from 'react';

interface AppIconProps {
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-label="Bangladesh and Melbourne Time Converter App Icon"
    >
      <defs>
        <linearGradient id="appBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Android Adaptive Squircle Base */}
      <rect width="512" height="512" rx="128" fill="url(#appBg)" />

      {/* Outer subtle rim */}
      <rect
        x="6"
        y="6"
        width="500"
        height="500"
        rx="122"
        fill="none"
        stroke="#334155"
        strokeWidth="6"
        opacity="0.4"
      />

      {/* Clock Outer Track */}
      <circle cx="256" cy="256" r="175" fill="none" stroke="#1e293b" strokeWidth="18" />
      <circle
        cx="256"
        cy="256"
        r="175"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="18"
        strokeDasharray="260 550"
        strokeLinecap="round"
      />

      {/* Clock Tick Marks */}
      <line x1="256" y1="95" x2="256" y2="115" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
      <line x1="417" y1="256" x2="397" y2="256" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
      <line x1="256" y1="417" x2="256" y2="397" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
      <line x1="95" y1="256" x2="115" y2="256" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

      {/* Central Dial Surface */}
      <circle cx="256" cy="256" r="125" fill="#131b2e" />
      <circle cx="256" cy="256" r="125" fill="none" stroke="#334155" strokeWidth="4" />

      {/* Bangladesh Flag Indicator (Top-Left quadrant inside dial) */}
      <g transform="translate(160, 190)">
        <circle cx="0" cy="0" r="28" fill="#065f46" />
        <circle cx="-3" cy="0" r="14" fill="#dc2626" />
      </g>

      {/* Australia Flag Indicator (Top-Right quadrant inside dial) */}
      <g transform="translate(352, 190)">
        <circle cx="0" cy="0" r="28" fill="#1e3a8a" />
        {/* Southern Cross constellation hint */}
        <polygon points="0,-16 4,-6 14,-6 6,0 10,10 0,4 -10,10 -6,0 -14,-6 -4,-6" fill="#ffffff" transform="scale(0.85)" />
      </g>

      {/* Prominent Synchronized Time Swap Arrows */}
      <g filter="url(#glow)">
        {/* Forward Arrow (Dhaka to Melbourne) */}
        <path
          d="M 185 240 L 325 240 M 285 200 L 325 240 L 285 280"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Reverse Arrow (Melbourne to Dhaka) */}
        <path
          d="M 327 305 L 187 305 M 227 265 L 187 305 L 227 345"
          fill="none"
          stroke="url(#emeraldGradient)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Timezone offset pill at bottom of icon */}
      <g transform="translate(256, 420)">
        <rect x="-85" y="-18" width="170" height="36" rx="18" fill="#0f172a" stroke="#4338ca" strokeWidth="3" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fill="#38bdf8"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="16"
          fontWeight="bold"
          letterSpacing="1"
        >
          BD ⇄ MEL
        </text>
      </g>
    </svg>
  );
};

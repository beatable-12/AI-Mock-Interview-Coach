import React from 'react';

export const EmptyStateSvg = ({ className }) => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="200" cy="150" r="100" fill="url(#paint0_linear)" fillOpacity="0.1"/>
    <rect x="150" y="100" width="100" height="120" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="4"/>
    <path d="M170 130H230" stroke="#6366f1" strokeWidth="6" strokeLinecap="round"/>
    <path d="M170 150H210" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round"/>
    <path d="M170 170H230" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round"/>
    <path d="M170 190H200" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="230" cy="190" r="16" fill="#818cf8"/>
    <path d="M225 190L228 193L235 186" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear" x1="100" y1="50" x2="300" y2="250" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1"/>
        <stop offset="1" stopColor="#c084fc"/>
      </linearGradient>
    </defs>
  </svg>
);

export const AnalyticsSvg = ({ className }) => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="80" y="60" width="240" height="180" rx="20" fill="white" stroke="#E5E7EB" strokeWidth="4"/>
    <path d="M120 200V140" stroke="#818cf8" strokeWidth="16" strokeLinecap="round"/>
    <path d="M160 200V100" stroke="#c084fc" strokeWidth="16" strokeLinecap="round"/>
    <path d="M200 200V160" stroke="#818cf8" strokeWidth="16" strokeLinecap="round"/>
    <path d="M240 200V110" stroke="#6366f1" strokeWidth="16" strokeLinecap="round"/>
    <path d="M280 200V130" stroke="#c084fc" strokeWidth="16" strokeLinecap="round"/>
    <circle cx="320" cy="60" r="30" fill="url(#paint_chart)" fillOpacity="0.2"/>
    <defs>
      <linearGradient id="paint_chart" x1="290" y1="30" x2="350" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1"/>
        <stop offset="1" stopColor="#c084fc"/>
      </linearGradient>
    </defs>
  </svg>
);

export const HeroVisualSvg = ({ className }) => (
  <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g className="animate-float">
      <rect x="100" y="80" width="280" height="200" rx="24" fill="white" stroke="#E5E7EB" strokeWidth="3" shadow="xl"/>
      <circle cx="140" cy="120" r="20" fill="#e0e7ff"/>
      <rect x="180" y="110" width="120" height="8" rx="4" fill="#E5E7EB"/>
      <rect x="180" y="130" width="80" height="8" rx="4" fill="#E5E7EB"/>
      <path d="M140 220C160 220 180 180 200 160C220 140 240 180 260 180C280 180 300 130 340 130" stroke="url(#paint0_linear_hero)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="340" cy="130" r="8" fill="#6366f1"/>
    </g>
    <circle cx="380" cy="250" r="60" fill="url(#paint0_linear_hero)" fillOpacity="0.15" className="animate-pulse"/>
    <defs>
      <linearGradient id="paint0_linear_hero" x1="100" y1="80" x2="380" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1"/>
        <stop offset="1" stopColor="#c084fc"/>
      </linearGradient>
    </defs>
  </svg>
);

export const CareerSvg = ({ className }) => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="200" cy="150" r="120" fill="url(#grad)" fillOpacity="0.1"/>
    <path d="M120 220L180 160L220 190L280 110" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="animate-float"/>
    <circle cx="280" cy="110" r="12" fill="#c084fc"/>
    <defs>
      <linearGradient id="grad" x1="80" y1="30" x2="320" y2="270" gradientUnits="userSpaceOnUse">
         <stop stopColor="#6366f1"/>
         <stop offset="1" stopColor="#c084fc"/>
      </linearGradient>
    </defs>
  </svg>
);

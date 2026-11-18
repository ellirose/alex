import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const line = (p: P, width = 1.8): P => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: width,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...p,
});

/* ---------------- Large duotone discipline icons (48 grid) ---------------- */

export const IconDesign = (p: P) => (
  <svg viewBox="0 0 48 48" {...line(p, 2.2)}>
    <path d="M24 5 36.5 21 29.5 37h-11L11.5 21Z" fill="currentColor" fillOpacity=".22" stroke="none" />
    <path d="M24 5 36.5 21 29.5 37h-11L11.5 21Z" />
    <path d="M24 5v17.3" />
    <circle cx="24" cy="25.5" r="3.2" />
    <path d="M16.5 43h15" />
  </svg>
);

export const IconMotion = (p: P) => (
  <svg viewBox="0 0 48 48" {...line(p, 2.2)}>
    <rect x="4" y="9" width="32" height="30" rx="8" fill="currentColor" fillOpacity=".22" stroke="none" />
    <rect x="4" y="9" width="32" height="30" rx="8" />
    <path d="M16.5 18.2v11.6l9.5-5.8Z" fill="currentColor" />
    <path d="M41 16.5v15M45.5 20.5v7" />
  </svg>
);

export const IconGrowth = (p: P) => (
  <svg viewBox="0 0 48 48" {...line(p, 2.2)}>
    <circle cx="21" cy="27" r="16" fill="currentColor" fillOpacity=".22" stroke="none" />
    <circle cx="21" cy="27" r="16" />
    <circle cx="21" cy="27" r="8.5" />
    <circle cx="21" cy="27" r="2.4" fill="currentColor" />
    <path d="m21 27 18-18M31 8h9v9" />
  </svg>
);

export const IconCode = (p: P) => (
  <svg viewBox="0 0 48 48" {...line(p, 2.2)}>
    <rect x="4" y="7" width="40" height="34" rx="9" fill="currentColor" fillOpacity=".22" stroke="none" />
    <rect x="4" y="7" width="40" height="34" rx="9" />
    <path d="M4 16h40" />
    <circle cx="10.5" cy="11.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="11.5" r="1" fill="currentColor" />
    <path d="m18 24-6 5 6 5M30 24l6 5-6 5M26.5 22l-5 14" />
  </svg>
);

export const IconLayers = (p: P) => (
  <svg viewBox="0 0 48 48" {...line(p, 2.2)}>
    <path d="m24 6 18 9-18 9-18-9Z" fill="currentColor" fillOpacity=".22" stroke="none" />
    <path d="m24 6 18 9-18 9-18-9Z" />
    <path d="m6 24 18 9 18-9M6 33l18 9 18-9" />
  </svg>
);

/* ---------------- Interface icons (24 grid) ---------------- */

export const IconArrow = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p, 2)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowUp = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p, 2)}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const IconPlay = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path d="M8 5.6v12.8c0 .8.9 1.3 1.6.9l10-6.4a1 1 0 0 0 0-1.8l-10-6.4c-.7-.4-1.6.1-1.6.9Z" fill="currentColor" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" fill="currentColor" fillOpacity=".18" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p, 2.2)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p, 2.4)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconSparkle = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path
      d="M12 3c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8Z"
      fill="currentColor"
      fillOpacity=".2"
    />
  </svg>
);

export const IconHand = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12m0-1.5v-6a1.5 1.5 0 0 1 3 0V12m0-5a1.5 1.5 0 0 1 3 0V13m0-3a1.5 1.5 0 0 1 3 0v4.5a7 7 0 0 1-7 7h-1.2a6 6 0 0 1-4.6-2.2L4.5 15a1.6 1.6 0 0 1 2.4-2.1L8 14" />
  </svg>
);

export const IconCap = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path d="M2.5 9.5 12 5l9.5 4.5L12 14Z" fill="currentColor" fillOpacity=".2" />
    <path d="M6.5 11.5V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.5M21.5 9.5V15" />
  </svg>
);

export const IconChart = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path d="M4 20h16" />
    <rect x="5.5" y="11" width="3" height="6" rx="1" fill="currentColor" fillOpacity=".2" />
    <rect x="10.5" y="7" width="3" height="10" rx="1" fill="currentColor" fillOpacity=".2" />
    <rect x="15.5" y="4" width="3" height="13" rx="1" fill="currentColor" fillOpacity=".2" />
  </svg>
);

export const IconMagnet = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path d="M6 4h4v8a2 2 0 0 0 4 0V4h4v8a6 6 0 0 1-12 0Z" fill="currentColor" fillOpacity=".15" />
    <path d="M6 8h4M14 8h4" />
  </svg>
);

export const IconAperture = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".15" />
    <path d="m14.3 3.3-5.9 10.2M20.7 9.6H8.9M18.1 18.6 12.2 8.4M9.7 20.7l5.9-10.2M3.3 14.4h11.8M5.9 5.4l5.9 10.2" />
  </svg>
);

export const IconStoryboard = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <rect x="3" y="4" width="8" height="7" rx="1.8" fill="currentColor" fillOpacity=".2" />
    <rect x="13" y="4" width="8" height="7" rx="1.8" />
    <rect x="3" y="13" width="8" height="7" rx="1.8" />
    <rect x="13" y="13" width="8" height="7" rx="1.8" />
  </svg>
);

export const IconScissors = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <circle cx="6" cy="7" r="2.6" />
    <circle cx="6" cy="17" r="2.6" />
    <path d="M8.2 8.4 20 18M8.2 15.6 20 6" />
  </svg>
);

export const IconPalette = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path
      d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.5-1.9-.4-1.2.5-2.1 1.7-2.1H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10Z"
      fill="currentColor"
      fillOpacity=".15"
    />
    <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
    <circle cx="10.5" cy="7" r="1.2" fill="currentColor" />
    <circle cx="15" cy="7.5" r="1.2" fill="currentColor" />
  </svg>
);

export const IconFlask = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" />
    <path d="M7.4 15.5h9.2" />
  </svg>
);

export const IconCompass = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5Z" fill="currentColor" fillOpacity=".3" />
  </svg>
);

export const IconRoute = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
  </svg>
);

export const IconGrid = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fillOpacity=".2" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fillOpacity=".2" />
  </svg>
);

export const IconFilm = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" fillOpacity=".15" />
    <path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
  </svg>
);

export const IconToolkit = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <rect x="3" y="8" width="18" height="12" rx="3" fill="currentColor" fillOpacity=".15" />
    <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18M10 13v2h4v-2" />
  </svg>
);

export const IconAward = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <circle cx="12" cy="9" r="5.5" fill="currentColor" fillOpacity=".15" />
    <path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" />
  </svg>
);

export const IconGlobe = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </svg>
);

export const IconInfo = (p: P) => (
  <svg viewBox="0 0 24 24" {...line(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.6v.2" />
  </svg>
);

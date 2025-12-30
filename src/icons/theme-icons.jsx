// src/icons/ThemeIcons.jsx
// ===============================================================
// ChorEscape Modern Realistic Thin-Line Icon Pack
// Unified 1.7px stroke, rounded caps, fully scalable
// ===============================================================

const base = (size, color, strokeWidth) => ({
  width: size,
  height: size,
  fill: "none",
  stroke: color,
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

// ===============================================================
// USER & AUTH ICONS
// ===============================================================
export const UserIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    {/* Head */}
    <circle cx="12" cy="7.5" r="3.2" />
    {/* Shoulders / torso */}
    <path d="M5 20c1.1-4.6 4-6.5 7-6.5s5.9 1.9 7 6.5" />
  </svg>
);

export const MailIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4 7l8 6 8-6" />
    <path d="M5 17h14" />
  </svg>
);

export const LockIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    <circle cx="12" cy="14.5" r="1.1" />
    <path d="M12 15.6v1.8" />
  </svg>
);

// ===============================================================
// NAVBAR ICONS
// ===============================================================
export const BagIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="5" y="7" width="14" height="12" rx="2" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    <path d="M9 11a1 1 0 0 0 2 0M13 11a1 1 0 0 0 2 0" />
  </svg>
);

export const MoonIcon = ({ size = 22, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14.5A7.5 7.5 0 0 1 11 4.2 7.5 7.5 0 1 0 19 14.5z" />
  </svg>
);

export const SunIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg
    width={size}
    height={size}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.1M12 19.4v2.1M4.5 12H2.4M21.6 12h-2.1" />
    <path d="M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M16.7 7.3l1.5-1.5M5.8 18.2l1.5-1.5" />
  </svg>
);

// ===============================================================
// DASHBOARD STATS ICONS
// ===============================================================
export const CalendarIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <line x1="3.5" y1="9" x2="20.5" y2="9" />
    <line x1="9" y1="3" x2="9" y2="6" />
    <line x1="15" y1="3" x2="15" y2="6" />
    {/* tiny date dots */}
    <circle cx="9" cy="12.5" r="0.7" />
    <circle cx="12" cy="12.5" r="0.7" />
    <circle cx="15" cy="12.5" r="0.7" />
  </svg>
);

export const CheckIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.2 12.4 11 15.3 16 9.3" />
  </svg>
);

export const ClockIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3 2" />
    <path d="M12 12l-2.2 1.4" />
  </svg>
);

export const TimerIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <circle cx="12" cy="13" r="7" />
    <path d="M9.2 3h5.6" />
    <path d="M12 9v4" />
    <path d="M9.5 8l2.5 1" />
  </svg>
);

// ===============================================================
// SETTINGS / PAGES / NAVIGATION
// ===============================================================
export const HomeIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M3.2 11.2 12 4l8.8 7.2" />
    <path d="M6 11v9h12v-9" />
    <path d="M10 20v-4h4v4" />
  </svg>
);

export const EditIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M4 17l9.6-9.6 3 3L7 20H4v-3z" />
    <path d="M14 7l2.2-2.2 3 3L17 10" />
  </svg>
);

export const ArrowRightIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 6 19 12 12 18" />
  </svg>
);

// ===============================================================
// EXTRA ICONS (Billing, Orders, Inbox, Address, Help)
// ===============================================================
export const InboxIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M3.5 7h17l-2 10H5.5l-2-10z" />
    <path d="M3.5 7 12 13.5 20.5 7" />
    <path d="M8 15h8" />
  </svg>
);

export const OrdersIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="3.5" y="4" width="17" height="14" rx="2" />
    <path d="M8 2.5v3.5M16 2.5v3.5" />
    <line x1="3.5" y1="10" x2="20.5" y2="10" />
    <path d="M8 14h4M8 16.5h7" />
  </svg>
);

export const BillingIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="3.5" y="6" width="17" height="12" rx="2" />
    <line x1="3.5" y1="10" x2="20.5" y2="10" />
    <path d="M8 13h4.2a1.6 1.6 0 1 1 0 3.2H9" />
  </svg>
);

export const AddressIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <circle cx="12" cy="9.8" r="3.2" />
    <path d="M12 13c0 3-3 5-3 7h6c0-2-3-4-3-7" />
  </svg>
);

export const LogoutIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ===============================================================
// SERVICE ICONS — Residential + Corporate
// ===============================================================

/* ---------- RESIDENTIAL SERVICES ---------- */

export const HomeCleanIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    {/* House */}
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 11v9h12v-9" />
    {/* Sparkles */}
    <path d="M9 8.5l.6-1.6.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6z" />
  </svg>
);

export const DeepCleanIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    {/* Magnifying glass over sparkle */}
    <circle cx="9" cy="9" r="3" />
    <path d="M11 11l2.5 2.5" />
    <circle cx="16" cy="16" r="2.7" />
    <path d="M5 16h2.4L10 13.1 13.5 9.6 17 6.5" />
  </svg>
);

export const HandymanIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    {/* Hybrid wrench/hammer feel */}
    <path d="M15.5 4.5a3 3 0 0 1-3 3L11 9l5 5 1.5-1.5a3 3 0 0 0-2-8z" />
    <path d="M6 18l3-3" />
    <circle cx="6" cy="18" r="1.7" />
  </svg>
);

export const AutoServiceIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M5 14.5 7.2 9h9.6L19 14.5H5Z" />
    <circle cx="8" cy="16.5" r="1.2" fill="currentColor" />
    <circle cx="16" cy="16.5" r="1.2" fill="currentColor" />
    <path d="M8.5 9l1-2h5l1 2" />
  </svg>
);




export const MoveOutIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="3" y="8" width="18" height="11" rx="2" />
    <path d="M7 8V5h10v3" />
    <path d="M8.5 12h4.5" />
    <path d="M11.5 10l2.5 2-2.5 2" />
  </svg>
);


/* ---------- CORPORATE SERVICES ---------- */

export const CorporateCleanIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="5" y="3" width="10" height="18" rx="1.5" />
    <path d="M15 10h4v8" />
    <path d="M8 7h2M8 11h2M8 15h2" />
  </svg>
);

export const JanitorialIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    {/* Mop + bucket style */}
    <path d="M6 19h5l1-8h-3" />
    <path d="M14 5v14" />
    <path d="M9 5.5a2 2 0 1 1 4 0" />
    <path d="M15 17h3v2H14" />
  </svg>
);

export const LandscapingIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M4 18h16" />
    <path d="M6 18 8 13l3 3 3-6 4 8" />
    <circle cx="8" cy="7" r="2" />
    <circle cx="16" cy="5" r="2" />
  </svg>
);

export const PropertyMgmtIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M3 11 12 4l9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11z" />
    <path d="M9 21V9h6v12" />
    <path d="M10.5 13h3" />
  </svg>
);

export const RenovationIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    {/* Hammer-like lines */}
    <path d="M3 21 10 14" />
    <path d="M14 10 21 3" />
    <path d="M14 4h7v7" />
    <path d="M10 14l1.5 1.5" />
  </svg>
);

export const MoveInOutIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M12 7V4M9 4h6" />
    <path d="M9 13h6" />
    <path d="M13 11l2 2-2 2" />
  </svg>
);

export const BuildingMgmtIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="4" y="3" width="8" height="18" rx="1.5" />
    <rect x="14" y="7" width="6" height="14" rx="1.5" />
    <path d="M14 12h6" />
  </svg>
);

// ===============================================================
// SERVICE CATEGORY ICONS (Residential + Corporate)
// ===============================================================

export const SparkleIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M12 3 13.4 7.4 18 9 13.4 10.6 12 15 10.6 10.6 6 9l4.6-1.6L12 3z" />
  </svg>
);

// 🧹 Cleaning (category)
export const CleaningIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg  {...base(size,color,strokeWidth)} viewBox="0 0 24 24">
    <path d="M10 3l4 10" />
    <path d="M6 18h10l1 3H5z" />
    <path d="M9 18l1-2M12 18l.5-2M14.5 18l-1-2" />
  </svg>
);
// ❄️ Snow (category)
export const SnowIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M12 3v18" />
    <path d="M5 7 19 17" />
    <path d="M19 7 5 17" />
    <path d="M8 4l2 2M16 4l-2 2" />
    <path d="M10 18l-2 2M14 18l2 2" />
  </svg>
);

// 🧺 Laundry (category)
export const LaundryIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="12" cy="13" r="4" />
    <path d="M8.4 7h1.2M11.4 7h1.2M14.4 7h1.2" />
    <path d="M10 12c.6.4 1.2.6 2 .6 1 0 1.5-.2 2-.6" />
  </svg>
);

// 🔧 Handyman / Maintenance (category)
export const WrenchIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M15.5 3.5a3 3 0 0 1-3 3L11 8l5 5 1.5-1.5a3 3 0 0 0-2-8z" />
    <circle cx="6" cy="18" r="2" />
    <path d="M8 16l2-2" />
  </svg>
);

// 🌿 Lawn / Landscaping (category)
export const LeafIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M5 19c4-8 8-12 14-14-2 6-6 10-14 14z" />
    <path d="M6.5 12.2c1 1 2 2 3 2.8" />
  </svg>
);

// 🐜 Pest Control (category)
export const BugIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <circle cx="12" cy="10" r="2.8" />
    <path d="M10 12v4a2 2 0 0 0 4 0v-4" />
    <path d="M4.5 10h3M16.5 10h3" />
    <path d="M6 6l2 1.5M18 6l-2 1.5" />
    <path d="M6 17.5l2-1.5M18 17.5l-2-1.5" />
  </svg>
);

// 🏠 Home / Renovation (category)
export const HouseToolsIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M3 11 12 4l9 7" />
    <path d="M5 11v9h14v-9" />
    <path d="M10.5 15.5 13 13l2 2-2.5 2.5" />
  </svg>
);

// 🏢 Corporate / Building (category)
export const BuildingIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <rect x="4" y="3" width="8" height="18" rx="1" />
    <rect x="14" y="7" width="6" height="14" rx="1" />
    <path d="M7 7h2M7 11h2M7 15h2M16 11h2M16 15h2" />
  </svg>
);

// 🚗 Automotive (category)
export const CarIcon = ({ size = 22, color = "currentColor", strokeWidth = 1.7 }) => (
  <svg {...base(size, color, strokeWidth)} viewBox="0 0 24 24">
    <path d="M4 13 6 7h12l2 6" />
    <rect x="3" y="13" width="18" height="5" rx="2" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
    <path d="M8.5 10.5h7" />
  </svg>
);

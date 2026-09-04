import React from 'react';

// Common icon props
export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const getStyle = (color?: string, style?: React.CSSProperties): React.CSSProperties | undefined =>
  color ? { color, ...style } : style;

/** 👑 Crown of the Realm / Monarch */
export const CrownIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M3 8l3.5 10h11L21 8l-5 4-4-7-4 7-5-4z" />
    <circle cx="3.5" cy="7.5" r="1.2" fill="currentColor" />
    <circle cx="12" cy="4.5" r="1.2" fill="currentColor" />
    <circle cx="20.5" cy="7.5" r="1.2" fill="currentColor" />
    <path d="M6 18h12" />
    <path d="M8 21h8" />
  </svg>
);

/** ⚔️ Crossed Broadswords / Skirmish / Battle */
export const CrossedSwordsIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="4" y2="20" />
    <polyline points="2,8 4,4 8,2" />
    <polyline points="16,2 20,4 22,8" />
    <polyline points="2,16 4,20 8,22" />
    <polyline points="16,22 20,20 22,16" />
    <line x1="7" y1="13" x2="11" y2="17" />
    <line x1="17" y1="13" x2="13" y2="17" />
  </svg>
);

/** 🗡️ Upright Arming Sword */
export const SwordIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M12 2v14M8 12h8M12 16v5M10 21h4" />
    <path d="M10 2l2-1 2 1v11h-4z" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

/** 🛡️ Heraldic Heater Shield */
export const ShieldIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 2v20M4 9h16" />
  </svg>
);

/** 🏰 Medieval Fortress / Castle Tower */
export const FortressIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M4 21V9l2-2v4h2V7l2-2h4l2 2v4h2V7l2 2v12H4z" />
    <path d="M9 21v-5a3 3 0 0 1 6 0v5" />
    <line x1="12" y1="9" x2="12" y2="12" />
  </svg>
);

/** 🗼 Scouting Watchtower / Lookout Spire */
export const WatchtowerIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M7 21l3-14h4l3 14" />
    <path d="M9 7h6M8 12h8M7 17h10" />
    <path d="M10 3h4v4h-4z" fill="currentColor" fillOpacity="0.2" />
    <line x1="12" y1="1" x2="12" y2="3" />
  </svg>
);

/** 📜 Wax-Sealed Treaty Scroll / Pact */
export const PactScrollIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M19 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z" />
    <path d="M19 17a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2" />
    <line x1="7" y1="7" x2="15" y2="7" />
    <line x1="7" y1="11" x2="13" y2="11" />
    <circle cx="15" cy="14" r="2.5" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

/** 🤝 Handshake / Ambassador Envoy / Tribute */
export const TributeIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M2 13l5-3 5 4 4-4 6 4" />
    <path d="M7 10l3 5 4-4" />
    <circle cx="12" cy="6" r="2.5" />
    <path d="M10 22h4" />
  </svg>
);

/** 💰 Drawstring Coin Purse / Treasury */
export const CoinBagIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M8 5h8l1 3H7l1-3z" />
    <path d="M6 8c-3 4-2 13 6 13s9-9 6-13H6z" />
    <circle cx="12" cy="14" r="2.5" />
    <line x1="12" y1="12.5" x2="12" y2="15.5" />
  </svg>
);

/** 🪙 Hammered Florin Gold Coin */
export const SingleCoinIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
    <path d="M10.5 9.5h3a1.5 1.5 0 0 1 0 3h-3v-3zm0 3h3.5a1.5 1.5 0 0 1 0 3h-3.5v-3z" />
  </svg>
);

/** Legacy alias for CoinIcon */
export const CoinIcon = SingleCoinIcon;

/** 💀 Memento Mori / Fallen Dynasty Skull */
export const SkullIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M12 2a8 8 0 0 0-8 8c0 3.2 1.8 6 4.5 7.3V20a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-2.7c2.7-1.3 4.5-4.1 4.5-7.3a8 8 0 0 0-8-8z" />
    <circle cx="9" cy="10" r="1.5" fill="currentColor" />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    <path d="M10 18v2M12 18v2M14 18v2" />
  </svg>
);

/** 🪶 Feather Quill / Calligraphic Dispatch */
export const FeatherQuillIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M21 3s-9 2-13 8a13 13 0 0 0-3 9l4-1c2-3 4-5 7-6l-2-2 7-8z" />
    <path d="M13 11l4 4" />
  </svg>
);

/** ⚖️ Brass Treasury Merchant Balance Scale */
export const TreasuryScaleIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <line x1="12" y1="3" x2="12" y2="21" />
    <path d="M5 6h14" />
    <path d="M3 14l2-8 2 8a3 3 0 0 1-4 0z" />
    <path d="M17 14l2-8 2 8a3 3 0 0 1-4 0z" />
    <path d="M8 21h8" />
  </svg>
);

/** 🧭 Nautical Compass Rose / Ocean Exploration */
export const CompassIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="12,4 14,10 20,12 14,14 12,20 10,14 4,12 10,10" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

/** 🏆 Victory Chalice / Grand Triumph */
export const TrophyIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M6 3h12v6a6 6 0 0 1-12 0V3z" />
    <path d="M6 5H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h1" />
    <path d="M18 5h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-1" />
    <line x1="12" y1="15" x2="12" y2="19" />
    <path d="M8 21h8" />
  </svg>
);

/** ⚠️ Wax Peril / Urgent Danger */
export const WarningSealIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/** 🚩 Heraldic Dynasty Pennant Banner */
export const BannerFlagIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M4 2v20" />
    <path d="M4 4h14l-4 5 4 5H4V4z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

/** 🎲 Bone Carved Map Seed Die */
export const DiceIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="16" cy="8" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="8" cy="16" r="1.5" fill="currentColor" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

/** 👥 Council of Nobles / Multiplayer */
export const UsersIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/** ✨ Royal Starburst / Sparkles */
export const SparklesIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

/** 🔄 Refresh / Re-roll */
export const RefreshIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

/** ⚙️ Settings / Iron Buckle */
export const SettingsIcon: React.FC<IconProps> = ({ size = 20, color, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/** 🔊 Sound / Herald Trumpet */
export const SoundIcon: React.FC<IconProps & { muted?: boolean }> = ({ size = 20, color, className = '', style, muted = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {!muted ? (
      <>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    ) : (
      <line x1="23" y1="9" x2="17" y2="15" />
    )}
  </svg>
);

/** 📳 Haptic Pulse / Strike Ripple */
export const HapticsIcon: React.FC<IconProps & { disabled?: boolean }> = ({ size = 20, color, className = '', style, disabled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={getStyle(color, style)}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
    {!disabled ? (
      <>
        <path d="M1 9l2 3-2 3" />
        <path d="M23 9l-2 3 2 3" />
      </>
    ) : (
      <line x1="2" y1="2" x2="22" y2="22" stroke="var(--wax)" strokeWidth="2" />
    )}
  </svg>
);

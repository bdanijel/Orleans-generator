import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function FleurDeLisIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
      <path d="M50 5 C45 20 40 30 40 45 C45 42 48 42 50 42 C52 42 55 42 60 45 C60 30 55 20 50 5 Z" />
      <path d="M50 50 C42 46 32 38 20 40 C10 42 8 54 18 60 C26 64 36 58 40 54 C39 58 37 66 33 72 C28 80 20 84 20 86 C25 86 35 84 42 75 C45 71 47 66 48 62 C46 62 44 62 40 62 L40 67 L60 67 L60 62 C56 62 54 62 52 62 C53 66 55 71 58 75 C65 84 75 86 80 86 C80 84 72 80 67 72 C63 66 61 58 60 54 C64 58 74 64 82 60 C92 54 90 42 80 40 C68 38 58 46 50 50 Z" />
      <path d="M48 69 L48 88 C48 92 45 95 40 96 L40 98 L60 98 L60 96 C55 95 52 92 52 88 L52 69 Z" />
      <rect x="36" y="62" width="28" height="5" rx="2" fill="currentColor" />
    </svg>
  );
}

export function CoinIcon({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7.5" stroke="#b45309" strokeWidth="1" strokeDasharray="2 1.5" fill="#fbbf24" />
      <text x="12" y="15.5" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#78350f" fontFamily="serif">⚜</text>
    </svg>
  );
}

export function BrocadeIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#b91c1c" stroke="#fca5a5" strokeWidth="1.2" />
      <path d="M3 10 C8 8 16 12 21 10" stroke="#fef08a" strokeWidth="1.2" />
      <path d="M3 14 C8 12 16 16 21 14" stroke="#fef08a" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3" fill="#fef08a" stroke="#b91c1c" strokeWidth="1" />
      <text x="12" y="14" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#991b1b">5</text>
    </svg>
  );
}

export function WoolIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#0369a1" stroke="#bae6fd" strokeWidth="1.2" />
      <circle cx="9" cy="10" r="3.5" fill="#f0f9ff" />
      <circle cx="15" cy="10" r="3.5" fill="#f0f9ff" />
      <circle cx="12" cy="14" r="4" fill="#f0f9ff" />
      <path d="M9 13 C11 15 13 15 15 13" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
      <text x="12" y="13.5" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#0369a1">4</text>
    </svg>
  );
}

export function WineIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#6d28d9" stroke="#ddd6fe" strokeWidth="1.2" />
      <path d="M9 7 C9 12 15 12 15 7 Z" fill="#f43f5e" stroke="#fbcfe8" strokeWidth="0.8" />
      <path d="M12 12 L12 16 M9 16 L15 16" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
      <text x="12" y="9.5" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#ffffff">3</text>
    </svg>
  );
}

export function CheeseIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#d97706" stroke="#fef3c7" strokeWidth="1.2" />
      <path d="M6 16 L18 16 L18 10 L6 13 Z" fill="#fde047" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="10" cy="14" r="1" fill="#ca8a04" />
      <circle cx="14" cy="13" r="1.2" fill="#ca8a04" />
      <text x="12" y="11.5" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#78350f">2</text>
    </svg>
  );
}

export function GrainIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#78716c" stroke="#e7e5e4" strokeWidth="1.2" />
      <path d="M12 18 L12 6" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 8 C14 7 15 9 12 11" fill="#fde047" stroke="#ca8a04" strokeWidth="0.6" />
      <path d="M12 10 C10 9 9 11 12 13" fill="#fde047" stroke="#ca8a04" strokeWidth="0.6" />
      <path d="M12 12 C14 11 15 13 12 15" fill="#fde047" stroke="#ca8a04" strokeWidth="0.6" />
      <text x="12" y="14" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#44403c">1</text>
    </svg>
  );
}

export function FollowerBadge({ type, size = 32, showLabel = false, language = 'sr' }: { type: string; size?: number; showLabel?: boolean; language?: 'sr' | 'en' }) {
  const configs: Record<string, { bg: string; border: string; text: string; icon: string; nameSr: string; nameEn: string }> = {
    farmer: { bg: 'bg-emerald-800', border: 'border-emerald-500', text: 'text-emerald-100', icon: '🌾', nameSr: 'Seljak', nameEn: 'Farmer' },
    boatman: { bg: 'bg-cyan-800', border: 'border-cyan-500', text: 'text-cyan-100', icon: '🛶', nameSr: 'Lađar', nameEn: 'Boatman' },
    craftsman: { bg: 'bg-stone-700', border: 'border-stone-400', text: 'text-stone-100', icon: '🔨', nameSr: 'Zanatlija', nameEn: 'Craftsman' },
    trader: { bg: 'bg-amber-800', border: 'border-amber-500', text: 'text-amber-100', icon: '⚖️', nameSr: 'Trgovac', nameEn: 'Trader' },
    knight: { bg: 'bg-rose-900', border: 'border-rose-500', text: 'text-rose-100', icon: '⚔️', nameSr: 'Vitez', nameEn: 'Knight' },
    scholar: { bg: 'bg-purple-900', border: 'border-purple-500', text: 'text-purple-100', icon: '📜', nameSr: 'Učenjak', nameEn: 'Scholar' },
    monk: { bg: 'bg-yellow-700', border: 'border-yellow-400', text: 'text-yellow-100', icon: '✨', nameSr: 'Monah', nameEn: 'Monk' }
  };

  const c = configs[type] || configs.farmer;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={`rounded-full flex items-center justify-center font-bold shadow-md border-2 ${c.bg} ${c.border} ${c.text} shrink-0`}
        style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.45}px` }}
        title={language === 'sr' ? c.nameSr : c.nameEn}
      >
        <span>{c.icon}</span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-stone-200">
          {language === 'sr' ? c.nameSr : c.nameEn}
        </span>
      )}
    </div>
  );
}

export function TradingStationIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M3 10 L12 3 L21 10 L21 20 L3 20 Z" fill="#b45309" stroke="#fef3c7" strokeWidth="1.2" />
      <path d="M8 20 L8 13 L16 13 L16 20 Z" fill="#78350f" stroke="#fde68a" strokeWidth="0.8" />
      <path d="M12 3 L12 7" stroke="#fde68a" strokeWidth="1" />
    </svg>
  );
}

export function CitizenIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <circle cx="12" cy="12" r="10" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="3.5" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" />
      <path d="M6 18 C6 14.5 9 13.5 12 13.5 C15 13.5 18 14.5 18 18" fill="#3b82f6" stroke="#fbbf24" strokeWidth="1" />
    </svg>
  );
}

export function DevStarIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
    </svg>
  );
}

export function TechCogIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <circle cx="12" cy="12" r="9" fill="#78716c" stroke="#e7e5e4" strokeWidth="1.5" strokeDasharray="3 1.5" />
      <circle cx="12" cy="12" r="3.5" fill="#292524" stroke="#e7e5e4" strokeWidth="1" />
    </svg>
  );
}

export function HourglassIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M6 3 L18 3 M6 21 L18 21" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 4 C7 10 12 12 12 12 C12 12 17 10 17 4 Z" fill="#451a03" stroke="#f59e0b" strokeWidth="1.2" />
      <path d="M7 20 C7 14 12 12 12 12 C12 12 17 14 17 20 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="1.2" />
      <circle cx="12" cy="17" r="1.5" fill="#fde68a" />
    </svg>
  );
}

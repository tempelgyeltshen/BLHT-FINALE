import React from 'react';

export type FilterPillVariant = 'default' | 'pill' | 'square' | 'squareLg' | 'gradient';

export interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  variant?: FilterPillVariant;
}

const variantClasses: Record<FilterPillVariant, { base: string; size: string; active: string; inactive: string }> = {
  // Admin CRUD filter bars (default)
  default: {
    base: 'rounded-lg text-xs font-bold font-serif cursor-pointer transition-colors whitespace-nowrap',
    size: 'px-3 py-1.5',
    active: 'bg-amber-950 text-amber-100 shadow-xs',
    inactive: 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200',
  },
  // Public festivals month pills
  pill: {
    base: 'rounded-full text-xs font-serif font-semibold cursor-pointer transition-all',
    size: 'px-3 py-1',
    active: 'bg-amber-700 text-white font-bold shadow-xs',
    inactive: 'bg-[#fcf8f2] border border-amber-300 text-stone-700 hover:bg-amber-100',
  },
  // Public gallery / videos category pills
  square: {
    base: 'rounded-xl text-xs font-bold font-serif cursor-pointer transition-colors',
    size: 'px-3.5 py-1.5',
    active: 'bg-amber-950 text-amber-100 shadow-xs',
    inactive: 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200',
  },
  // Public hotels region pills
  squareLg: {
    base: 'rounded-xl text-xs font-semibold cursor-pointer transition-all',
    size: 'px-4 py-2',
    active: 'bg-amber-950 text-amber-100 shadow-sm',
    inactive: 'bg-stone-100 text-stone-700 hover:bg-amber-100',
  },
  // Public luxury duration pills
  gradient: {
    base: 'rounded-xl font-bold cursor-pointer transition-all',
    size: 'px-3.5 py-1.5',
    active: 'bg-gradient-to-r from-red-900 to-amber-900 text-amber-100 shadow-xs',
    inactive: 'bg-white text-stone-700 hover:bg-amber-200',
  },
};

/** Reusable filter pill (active/inactive) covering every filter-bar dialect in the app. */
export const FilterPill: React.FC<FilterPillProps> = ({
  active,
  onClick,
  children,
  className = '',
  compact = false,
  variant = 'default',
}) => {
  const v = variantClasses[variant];
  const size = variant === 'default' && compact ? 'px-3 py-1' : v.size;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${size} ${v.base} ${active ? v.active : v.inactive} ${className}`}
    >
      {children}
    </button>
  );
};

import React from 'react';

/**
 * Reusable Input with label, optional leading icon and error message.
 *
 * `variant` matches the three form dialects already used across the app:
 *  - 'default'  → plain border (package/hotel forms)
 *  - 'amber'    → stone border + amber focus ring (brochure/homepage forms)
 *  - 'cream'    → cream background + amber border (festival/gallery/video forms)
 *  - 'creamFill'→ same as cream but flex-1 (inline URL + upload rows)
 *  - 'public'   → stone border + amber ring (public contact form)
 */

export type InputVariant = 'default' | 'amber' | 'cream' | 'creamFill' | 'public' | 'login';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
  containerClassName?: string;
  variant?: InputVariant;
}

const variantClasses: Record<InputVariant, string> = {
  default: 'w-full p-2.5 border rounded-lg',
  amber: 'w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none',
  cream:
    'w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600',
  creamFill:
    'flex-1 bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600',
  public:
    'w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-hidden',
  login:
    'w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-stone-50/50 hover:bg-stone-50',
};

export const Input: React.FC<InputProps> = ({
  label,
  labelClassName = 'block font-semibold mb-1',
  error,
  hint,
  icon,
  rightAction,
  containerClassName = '',
  variant = 'default',
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || (label ? `input-${String(label).toLowerCase().replace(/\W+/g, '-')}` : undefined);
  const hasIcon = Boolean(icon);
  const inputClasses = [
    variantClasses[variant],
    hasIcon ? 'pl-11' : '',
    rightAction ? 'pr-11' : '',
    error ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className={labelClassName}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input id={inputId} className={inputClasses} {...rest} />
        {rightAction && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 flex items-center">
            {rightAction}
          </span>
        )}
      </div>
      {hint && <p className="text-[10px] text-stone-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-rose-700 mt-1">{error}</p>}
    </div>
  );
};

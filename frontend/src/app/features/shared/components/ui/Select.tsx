import React from 'react';

/** Reusable Select with label support matching existing form dialects. */

export type SelectVariant = 'default' | 'amber' | 'cream';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  variant?: SelectVariant;
}

const variantClasses: Record<SelectVariant, string> = {
  default: 'w-full p-2.5 border rounded-lg bg-white',
  amber: 'w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white',
  cream:
    'w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600 font-serif',
};

export const Select: React.FC<SelectProps> = ({
  label,
  labelClassName = 'block font-semibold mb-1',
  containerClassName = '',
  variant = 'default',
  className = '',
  id,
  children,
  ...rest
}) => {
  const selectId = id || (label ? `select-${String(label).toLowerCase().replace(/\W+/g, '-')}` : undefined);
  const classes = [variantClasses[variant], className].filter(Boolean).join(' ');

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={selectId} className={labelClassName}>
          {label}
        </label>
      )}
      <select id={selectId} className={classes} {...rest}>
        {children}
      </select>
    </div>
  );
};

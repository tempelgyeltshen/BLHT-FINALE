import React from 'react';

/** Reusable TextArea with label support matching existing form dialects. */

export type TextAreaVariant = 'default' | 'amber' | 'cream' | 'public' | 'contact';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  variant?: TextAreaVariant;
}

const variantClasses: Record<TextAreaVariant, string> = {
  default: 'w-full p-2.5 border rounded-lg',
  amber: 'w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none',
  cream:
    'w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600',
  public:
    'w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-hidden',
  contact: 'w-full p-3 border rounded-xl text-xs',
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  labelClassName = 'block font-semibold mb-1',
  containerClassName = '',
  variant = 'default',
  className = '',
  id,
  ...rest
}) => {
  const areaId = id || (label ? `textarea-${String(label).toLowerCase().replace(/\W+/g, '-')}` : undefined);
  const classes = [variantClasses[variant], className].filter(Boolean).join(' ');

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={areaId} className={labelClassName}>
          {label}
        </label>
      )}
      <textarea id={areaId} className={classes} {...rest} />
    </div>
  );
};

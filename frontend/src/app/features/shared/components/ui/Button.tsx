import React from 'react';

/**
 * Reusable Button component.
 *
 * `variant` controls color/shadows/hover, `size` controls padding & radius.
 * Use `className` for one-off extras (e.g. `active:scale-95`, `shrink-0`,
 * `flex-1`, `w-full`) — it is appended to the base classes.
 */

export type ButtonVariant =
  | 'primary' // amber-900 solid CTA (create/save)
  | 'primaryFlat' // amber-900 solid, no shadow/hover (compact submit)
  | 'primaryWhite' // amber-900 solid, white text + shadow (brochure submit)
  | 'primaryWhiteFlat' // amber-900 solid, white text, no shadow (hotel submit)
  | 'accent' // amber-700 solid (festival/gallery/video adds)
  | 'submitAccent' // amber-700 solid, tighter gap (festival submit)
  | 'outline' // bordered neutral (cancel)
  | 'outlineSoft' // bordered neutral, softer (confirm dialog cancel)
  | 'danger' // rose-600 solid (confirm delete)
  | 'ghost' // text-only neutral (form cancel)
  | 'iconAmber' // amber-100 icon action (edit)
  | 'iconAmberSoft' // amber-100, amber-900 text (festival edit)
  | 'iconAmberText' // amber-100 with text label (gallery/video edit)
  | 'iconRose' // rose-100 icon action (delete)
  | 'iconRoseText' // rose-100, rose-900 with text label (gallery/video delete)
  | 'close' // subtle close X
  | 'closeCircle' // circular close (dialog modals)
  | 'dark' // amber-950 solid (launch reader)
  | 'light' // amber-600 solid (dashboard quick action)
  | 'darkOutline' // amber-900 with border (dashboard quick action)
  | 'gradient' // amber gradient (contact submit)
  | 'loginGradient' // amber gradient (admin login submit)
  | 'save'; // amber-900 with shadow-md (homepage save)

export type ButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'mdXl'
  | 'lg'
  | 'launch'
  | 'submit'
  | 'submitXl'
  | 'submitWide'
  | 'wide'
  | 'full'
  | 'login'
  | 'icon'
  | 'iconSm'
  | 'iconXs'
  | 'pill';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseClasses =
  'inline-flex items-center justify-center cursor-pointer transition disabled:opacity-70 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-amber-900 hover:bg-amber-850 text-amber-50 font-bold shadow-sm gap-2',
  primaryFlat: 'bg-amber-900 text-amber-50 font-bold gap-2',
  primaryWhite: 'bg-amber-900 hover:bg-amber-850 text-white font-bold shadow-sm gap-2',
  primaryWhiteFlat: 'bg-amber-900 text-white font-bold gap-2',
  accent: 'bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold shadow-md gap-2',
  submitAccent: 'bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold shadow-md gap-1.5',
  outline: 'border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 gap-2',
  outlineSoft: 'border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 gap-2',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-2',
  ghost: 'text-stone-600 font-semibold hover:bg-stone-100 gap-2',
  iconAmber: 'bg-amber-100 hover:bg-amber-200 text-amber-950 gap-1.5',
  iconAmberSoft: 'bg-amber-100 hover:bg-amber-200 text-amber-900 gap-1 font-bold',
  iconAmberText: 'bg-amber-100 hover:bg-amber-200 text-amber-950 gap-1 font-bold',
  iconRose: 'bg-rose-100 hover:bg-rose-200 text-rose-800 gap-1.5',
  iconRoseText: 'bg-rose-100 hover:bg-rose-200 text-rose-900 gap-1 font-bold',
  close: 'text-stone-400 hover:text-stone-800 hover:bg-stone-100',
  closeCircle: 'bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full',
  dark: 'bg-amber-950 text-amber-100 font-bold gap-1',
  light: 'bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold shadow-sm gap-1.5',
  darkOutline: 'bg-amber-900 hover:bg-amber-850 border border-amber-700 text-amber-100 font-bold gap-1.5',
  gradient:
    'bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-900 hover:to-amber-950 text-amber-50 font-bold shadow-md gap-2',
  loginGradient:
    'bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold gap-2',
  save: 'bg-amber-900 hover:bg-amber-850 text-amber-50 font-bold shadow-md gap-2',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 rounded-lg text-xs',
  sm: 'px-3 py-1.5 rounded-lg text-xs',
  md: 'px-4 py-2 rounded-lg text-xs',
  mdXl: 'px-4 py-2 rounded-xl text-xs',
  lg: 'px-4 py-2.5 rounded-xl text-xs',
  launch: 'px-3 py-2 rounded text-xs',
  submit: 'px-5 py-2 rounded-lg text-xs',
  submitXl: 'px-5 py-2.5 rounded-xl text-xs',
  submitWide: 'px-5 py-2 rounded-xl text-xs',
  wide: 'px-6 py-3 rounded-xl text-sm',
  full: 'w-full py-3.5 rounded-xl text-xs',
  login: 'w-full py-3.5 rounded-xl text-sm shadow-lg shadow-amber-900/20',
  icon: 'p-2 rounded-lg',
  iconSm: 'p-1.5 rounded-lg',
  iconXs: 'p-1 rounded-lg',
  pill: 'px-2.5 py-1 rounded text-[10px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}) => {
  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');

  return <button type={type} className={classes} {...rest} />;
};

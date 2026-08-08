import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './Button';

/**
 * Reusable Modal supporting the two dialog dialects used across the app:
 *  - 'form'   → rounded-2xl amber-bordered panel with sticky header (package/hotel/brochure forms)
 *  - 'dialog' → rounded-3xl border-2 panel with absolute close + icon header (festival/gallery/video forms)
 *
 * Pass `animate` to wrap the panel in a motion scale/fade transition
 * (used together with the "dialog" variant).
 */

export type ModalVariant = 'form' | 'dialog';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ModalVariant;
  size?: ModalSize;
  animate?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-xl',
  xl: 'max-w-2xl',
  '2xl': 'max-w-3xl',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  icon,
  variant = 'form',
  size = 'lg',
  animate = false,
  children,
  className = '',
}) => {
  const maxW = sizeClasses[size];

  const renderContent = () => {
    if (variant === 'dialog') {
      return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-3xl border-2 border-amber-400 ${maxW} w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${className}`}
          >
            <Button
              variant="closeCircle"
              size="icon"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-10"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="space-y-4">
              {title && (
                <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
                  {icon}
                  <h3 className="font-serif font-extrabold text-lg text-amber-950">{title}</h3>
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div
          className={`bg-white rounded-2xl ${maxW} w-full p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto border border-amber-300 ${className}`}
        >
          {title && (
            <div className="flex items-center justify-between border-b pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif font-bold text-lg text-amber-950">{title}</h3>
              <Button variant="close" size="iconSm" onClick={onClose} aria-label="Close modal">
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    );
  };

  if (!animate) {
    return open ? <>{renderContent()}</> : null;
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-white rounded-3xl border-2 border-amber-400 ${maxW} w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${className}`}
          >
            <Button
              variant="closeCircle"
              size="icon"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-10"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="space-y-4">
              {title && (
                <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
                  {icon}
                  <h3 className="font-serif font-extrabold text-lg text-amber-950">{title}</h3>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

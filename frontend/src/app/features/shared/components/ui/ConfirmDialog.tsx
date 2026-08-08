import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Reusable delete-confirmation dialog.
 *
 * The pattern is duplicated across every admin CRUD view. `dense` toggles the
 * festival/gallery/video dialect (smaller text, font-serif panel, bold buttons);
 * leave it off for the package/hotel/brochure dialect.
 */

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
  dense?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  description = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  className = '',
  dense = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className={`${dense ? '' : 'font-serif '}font-bold text-lg text-stone-900`}>
              {title}
            </h3>
            <p className={`${dense ? 'text-xs' : 'text-sm'} text-stone-600`}>{description}</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className={`${dense ? 'text-xs' : 'text-sm'} text-stone-700`}>{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer ${
              dense
                ? 'px-4 py-2 font-bold'
                : 'px-4 py-2.5 font-semibold'
            }`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl bg-rose-600 text-white hover:bg-rose-700 cursor-pointer ${
              dense ? 'px-4 py-2 font-bold' : 'px-4 py-2.5 font-semibold'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

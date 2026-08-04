import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <div className="bg-amber-950 text-amber-100 px-5 py-3.5 rounded-xl shadow-2xl border border-amber-600/50 flex items-center gap-3">
        <span className="text-xs font-medium tracking-wide">{toast}</span>
      </div>
    </div>
  );
};

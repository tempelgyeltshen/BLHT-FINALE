import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../../core/providers/AppProvider';
import { Sparkles } from 'lucide-react';

export const PageLoader: React.FC = () => {
  const { isNavigating, navLoadingText } = useApp();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;

    if (isNavigating) {
      setProgress(15);
      timer1 = setTimeout(() => setProgress(55), 100);
      timer2 = setTimeout(() => setProgress(85), 250);
      timer3 = setTimeout(() => setProgress(100), 400);
    } else {
      setProgress(100);
      const resetTimer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(resetTimer);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isNavigating]);

  return (
    <AnimatePresence>
      {(isNavigating || progress > 0) && (
        <>
          {/* Top Fixed Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-amber-950/20 pointer-events-none"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-800 via-amber-500 to-yellow-400 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(217,107,39,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </motion.div>

          {/* Floating Subtle Luxury Spinner Badge */}
          {isNavigating && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100] bg-amber-950/90 text-amber-100 backdrop-blur-md border border-amber-600/40 px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold pointer-events-none"
            >
              <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="font-serif tracking-wide text-amber-200">
                {navLoadingText || 'Loading Sanctuary...'}
              </span>
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

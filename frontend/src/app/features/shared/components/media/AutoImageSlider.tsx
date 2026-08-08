import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AutoImageSliderProps {
  images: string[];
  alt?: string;
  intervalMs?: number; // default 1500ms (1.5s)
  className?: string;
  imageClassName?: string;
  showDots?: boolean;
  showArrows?: boolean;
  showCounter?: boolean;
  children?: React.ReactNode; // Overlay content like titles, badges, etc.
}

export const AutoImageSlider: React.FC<AutoImageSliderProps> = ({
  images,
  alt = 'Package Photo',
  intervalMs = 1500,
  className = '',
  imageClassName = 'object-cover',
  showDots = true,
  showArrows = true,
  showCounter = true,
  children
}) => {
  // Deduplicate and filter valid images
  const validImages = React.useMemo(() => {
    const list = Array.from(new Set(images.filter(Boolean)));
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80'];
  }, [images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide effect with 1.5s interval
  useEffect(() => {
    if (validImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [validImages.length, intervalMs, isPaused]);

  const goToPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + validImages.length) % validImages.length);
  };

  const goToNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % validImages.length);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={`relative overflow-hidden group select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding Images Container */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {validImages.map((url, idx) => (
          <div key={idx} className="w-full h-full shrink-0 relative">
            <img
              src={url}
              alt={`${alt} ${idx + 1}`}
              className={`w-full h-full ${imageClassName}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Children Overlay Content (Titles, Badges, etc) */}
      {children}

      {/* Navigation Controls overlay if multiple images exist */}
      {validImages.length > 1 && (
        <>
          {/* Slide Counter & Auto-Slide Indicator Badge */}
          {showCounter && (
            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-xs text-amber-200 border border-amber-500/30 text-[11px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentIndex + 1} / {validImages.length}</span>
            </div>
          )}

          {/* Left Arrow */}
          {showArrows && (
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-[#d96b27] text-white transition-all opacity-80 group-hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer border border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {showArrows && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-[#d96b27] text-white transition-all opacity-80 group-hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer border border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Bottom Indicator Dots */}
          {showDots && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#d96b27]'
                      : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

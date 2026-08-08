import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import { luxuryHoverProps } from '../../../../../utils/motion';
import type { TourPackage } from '../../../../../types';

export type PackageCardVariant = 'luxury' | 'adventure';

export interface PackageCardProps {
  pkg: TourPackage;
  onSelect: (pkg: TourPackage) => void;
  variant?: PackageCardVariant;
  /** Custom CTA label; defaults per variant. */
  ctaLabel?: React.ReactNode;
}

/**
 * Reusable tour-package card extracted from LuxuryView (variant="luxury")
 * and AdventuresView (variant="adventure"). Preserves each view's original design.
 */
export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onSelect,
  variant = 'luxury',
  ctaLabel,
}) => {
  const isLuxury = variant === 'luxury';

  return (
    <motion.div
      {...luxuryHoverProps}
      onClick={() => onSelect(pkg)}
      className={`${isLuxury
        ? 'bg-white rounded-3xl overflow-hidden border-2 border-amber-300/80 shadow-md'
        : 'bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-md p-6'
      } flex flex-col justify-between group cursor-pointer`}
    >
      <div>
        <div className={`relative overflow-hidden ${isLuxury ? 'h-56 sm:h-64' : 'h-56 rounded-xl'}`}>
          <img
            src={pkg.heroImage}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isLuxury ? (
            <div className="absolute top-3 left-3 bg-red-950/90 text-amber-200 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-amber-500/50 shadow-xs">
              {pkg.hotelCategory}
            </div>
          ) : (
            <div className="absolute top-3 left-3 bg-amber-950/80 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {pkg.hotelCategory}
            </div>
          )}
          {isLuxury && (
            <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 text-xs sm:text-sm font-extrabold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl shadow-md border border-amber-300">
              ${pkg.priceUSD.toLocaleString()} USD
            </div>
          )}
        </div>

        <div className={isLuxury ? 'p-4 sm:p-6 space-y-3 sm:space-y-4' : 'space-y-3'}>
          <div className={`flex items-center gap-2 text-xs ${
            isLuxury ? 'flex-wrap sm:gap-3 font-semibold text-stone-600' : 'font-medium text-stone-500'
          }`}>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className={`w-3.5 h-3.5 ${isLuxury ? 'text-rose-800' : 'text-amber-700'}`} />
              {isLuxury ? `${pkg.durationDays}D / ${pkg.durationDays - 1}N` : `${pkg.durationDays} Days`}
            </span>
            <span className="hidden xs:inline">•</span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className={`w-3.5 h-3.5 shrink-0 ${isLuxury ? 'text-teal-700' : 'text-amber-700'}`} />
              <span className="truncate">{pkg.destinations.join(', ')}</span>
            </span>
          </div>

          <h3 className={`font-serif font-bold text-xl text-amber-950 transition-colors ${
            isLuxury ? 'group-hover:text-rose-900' : 'group-hover:text-[#d96b27]'
          }`}>
            {pkg.title}
          </h3>

          <p className={`text-xs leading-relaxed font-serif line-clamp-3 ${
            isLuxury ? 'text-stone-700' : 'text-stone-600'
          }`}>
            {pkg.description}
          </p>

          {isLuxury && (
            <div className="bg-amber-100/60 p-3 rounded-2xl border border-amber-300 space-y-1">
              <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-wider block">Key Highlight</span>
              <p className="text-xs text-amber-950 font-bold">✓ {pkg.highlights[0]}</p>
            </div>
          )}
        </div>
      </div>

      <div className={isLuxury ? 'p-6 pt-0 flex gap-3' : 'pt-2 flex items-center justify-between border-t border-stone-100'}>
        {!isLuxury && (
          <span className="font-bold text-amber-900 text-sm">${pkg.priceUSD.toLocaleString()} USD / person</span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pkg);
          }}
          className={isLuxury
            ? 'flex-1 py-3.5 rounded-xl bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md'
            : 'px-4 py-2.5 rounded-xl bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs'
          }
        >
          <span>{ctaLabel ?? (isLuxury ? 'More Details & Itinerary' : 'More Details')}</span>
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

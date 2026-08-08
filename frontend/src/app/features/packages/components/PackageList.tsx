import React from 'react';
import { motion } from 'motion/react';
import { PackageCard } from '../../shared/components/cards';
import type { PackageCardVariant } from '../../shared/components/cards';
import type { TourPackage } from '../../../../types';

/**
 * Reusable responsive grid of `PackageCard`s with the same motion wrapper used
 * by the public package views (LuxuryView / AdventuresView).
 */
export interface PackageListProps {
  packages: TourPackage[];
  onSelect: (pkg: TourPackage) => void;
  variant?: PackageCardVariant;
  /** Tailwind grid classes controlling the responsive columns/gaps. */
  gridClassName?: string;
  /** Optional CTA label forwarded to each card. */
  ctaLabel?: React.ReactNode;
  /** Empty-state message. Defaults to a generic "no packages" message. */
  emptyMessage?: string;
}

export const PackageList: React.FC<PackageListProps> = ({
  packages,
  onSelect,
  variant = 'luxury',
  gridClassName,
  ctaLabel,
  emptyMessage = 'No packages found. Please check back soon.',
}) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-amber-200">
        <p className="font-serif text-sm text-stone-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
      className={gridClassName ?? 'grid grid-cols-1 md:grid-cols-2 gap-6'}
    >
      {packages.map(pkg => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          onSelect={onSelect}
          variant={variant}
          ctaLabel={ctaLabel}
        />
      ))}
    </motion.div>
  );
};

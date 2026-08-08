import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { Filter, FileText } from 'lucide-react';
import { FilterPill } from '../../shared/components/ui';
import { PackageList } from '../../packages/components/PackageList';

export const LuxuryView: React.FC = () => {
  const { packages, setActivePackage, brochures, setActiveBrochure, selectedParam } = useApp();
  const [filterDuration, setFilterDuration] = useState<string>('all');

  const isCulturalFocus = selectedParam === 'cultural';

  const luxuryPackages = packages.filter(p => p.category === 'luxury' || p.category === 'wellness' || p.category === 'cultural' || p.category === 'festival');

  const filtered = luxuryPackages.filter(pkg => {
    if (filterDuration === 'short') return pkg.durationDays <= 7;
    if (filterDuration === 'long') return pkg.durationDays > 7;
    return true;
  });

  const mainBrochure = brochures.find(b => b.category.includes('Luxury')) || brochures[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-red-950 via-amber-950 to-rose-950 text-amber-50 rounded-3xl p-8 sm:p-12 relative overflow-hidden border-2 border-amber-500/60 shadow-xl"
      >
        <div className="max-w-2xl space-y-4">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-xs">
            {isCulturalFocus ? 'Sacred Monasteries & Heritage Circuits' : '5-Star Six Senses & BLHT Circuits'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100">
            {isCulturalFocus ? 'Cultural & Heritage Tours' : 'Luxury Tour Collection'}
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm font-serif leading-relaxed font-medium">
            {isCulturalFocus 
              ? 'Immerse yourself in Bhutan’s living heritage, ancient dzongs, private monastic audiences, and sacred valley pilgrimages accompanied by senior scholars and private luxury hosts.'
              : 'Curated journeys combining private helicopter transfers, personal butler service, private monastic blessings, and world-renowned 5-star lodge suites across Bhutan’s pristine valleys.'}
          </p>

          {mainBrochure && (
            <button
              onClick={() => setActiveBrochure(mainBrochure)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Read Official Luxury PDF Brochure</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-3 bg-amber-100/70 p-4 rounded-2xl border-2 border-amber-300"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-950">
          <Filter className="w-4 h-4 text-rose-800" />
          <span>Filter Duration:</span>
          <FilterPill variant="gradient" active={filterDuration === 'all'} onClick={() => setFilterDuration('all')}>
            All Durations
          </FilterPill>
          <FilterPill variant="gradient" active={filterDuration === 'short'} onClick={() => setFilterDuration('short')}>
            1 - 7 Days
          </FilterPill>
          <FilterPill variant="gradient" active={filterDuration === 'long'} onClick={() => setFilterDuration('long')}>
            8+ Days
          </FilterPill>
        </div>

        <span className="text-xs text-rose-900 font-extrabold bg-white px-3 py-1 rounded-xl border border-amber-300">
          Showing {filtered.length} Ultra-Luxury Journeys
        </span>
      </motion.div>

      {/* Packages Grid */}
      <PackageList
        packages={filtered}
        onSelect={setActivePackage}
        variant="luxury"
        gridClassName="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        ctaLabel="More Details & Itinerary"
      />

    </div>
  );
};

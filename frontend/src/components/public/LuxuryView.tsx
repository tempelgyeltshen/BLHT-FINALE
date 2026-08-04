import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, Star, MapPin, ChevronRight, Filter, Sparkles, FileText } from 'lucide-react';
import { luxuryHoverProps } from '../../utils/motion';

export const LuxuryView: React.FC = () => {
  const { packages, setActivePackage, brochures, setActiveBrochure, selectedParam } = useApp();
  const { t, translateText } = useLanguage();
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
            {isCulturalFocus ? 'Sacred Monasteries & Heritage Circuits' : t('luxury.badge', '5-Star Six Senses & BLHT Circuits')}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100">
            {isCulturalFocus ? 'Cultural & Heritage Tours' : t('luxury.title', 'Luxury Tour Collection')}
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm font-serif leading-relaxed font-medium">
            {isCulturalFocus 
              ? 'Immerse yourself in Bhutan’s living heritage, ancient dzongs, private monastic audiences, and sacred valley pilgrimages accompanied by senior scholars and private luxury hosts.'
              : t('luxury.subtitle', 'Curated journeys combining private helicopter transfers, personal butler service, private monastic blessings, and world-renowned 5-star lodge suites across Bhutan’s pristine valleys.')}
          </p>

          {mainBrochure && (
            <button
              onClick={() => setActiveBrochure(mainBrochure)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>{t('luxury.readBrochure', 'Read Official Luxury PDF Brochure')}</span>
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
          <span>{t('luxury.filterDuration', 'Filter Duration:')}</span>
          <button
            onClick={() => setFilterDuration('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterDuration === 'all' ? 'bg-gradient-to-r from-red-900 to-amber-900 text-amber-100 shadow-xs' : 'bg-white text-stone-700 hover:bg-amber-200'
            }`}
          >
            {t('luxury.allDurations', 'All Durations')}
          </button>
          <button
            onClick={() => setFilterDuration('short')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterDuration === 'short' ? 'bg-gradient-to-r from-red-900 to-amber-900 text-amber-100 shadow-xs' : 'bg-white text-stone-700 hover:bg-amber-200'
            }`}
          >
            {t('luxury.shortDuration', '1 - 7 Days')}
          </button>
          <button
            onClick={() => setFilterDuration('long')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterDuration === 'long' ? 'bg-gradient-to-r from-red-900 to-amber-900 text-amber-100 shadow-xs' : 'bg-white text-stone-700 hover:bg-amber-200'
            }`}
          >
            {t('luxury.longDuration', '8+ Days')}
          </button>
        </div>

        <span className="text-xs text-rose-900 font-extrabold bg-white px-3 py-1 rounded-xl border border-amber-300">
          {t('luxury.showing', 'Showing')} {filtered.length} {t('luxury.journeys', 'Ultra-Luxury Journeys')}
        </span>
      </motion.div>

      {/* Packages Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
      >
        {filtered.map((pkg) => (
          <motion.div 
            key={pkg.id}
            {...luxuryHoverProps}
            onClick={() => setActivePackage(pkg)}
            className="bg-white rounded-3xl overflow-hidden border-2 border-amber-300/80 shadow-md flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={pkg.heroImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-red-950/90 text-amber-200 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-amber-500/50 shadow-xs">
                  {translateText(pkg.hotelCategory)}
                </div>
                <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 text-xs sm:text-sm font-extrabold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl shadow-md border border-amber-300">
                  ${pkg.priceUSD.toLocaleString()} USD
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-stone-600 text-xs font-semibold">
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-rose-800" />
                    {pkg.durationDays}D / {pkg.durationDays - 1}N
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="truncate">{pkg.destinations.map(d => translateText(d)).join(', ')}</span>
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-amber-950 group-hover:text-rose-900 transition-colors">
                  {pkg.title}
                </h3>

                <p className="text-stone-700 text-xs leading-relaxed font-serif line-clamp-3">
                  {pkg.description}
                </p>

                <div className="bg-amber-100/60 p-3 rounded-2xl border border-amber-300 space-y-1">
                  <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-wider block">{translateText('Key Highlight')}</span>
                  <p className="text-xs text-amber-950 font-bold">✓ {pkg.highlights[0]}</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePackage(pkg);
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <span>{t('button.viewDetails', 'More Details & Itinerary')}</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};

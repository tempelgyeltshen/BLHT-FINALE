import React, { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { Search, FileText, LayoutGrid, Table, X, Sparkles, ExternalLink } from 'lucide-react';
import { luxuryHoverProps } from '../../../../utils/motion';
import { FilterPill } from '../../shared/components/ui';
import { AutoImageSlider } from '../../shared/components/media/AutoImageSlider';
import { FALLBACK_HERO_IMAGES } from '../../shared/constants/media';
import { Festival } from '../../../../types';

export const FestivalsView: React.FC = () => {
  const { festivals, brochures, setActiveBrochure } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState<'2027' | '2026'>('2027');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeModalFestival, setActiveModalFestival] = useState<Festival | null>(null);
  const [heroHovered, setHeroHovered] = useState(false);

  // Scroll Parallax for Hero Section
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Hero slider images come from the festivals themselves; fall back to curated
  // scenery when fewer than 3 festival images are available.
  const heroSlideImages = useMemo(() => {
    const fromFestivals = festivals.map(f => f.heroImage).filter(Boolean);
    return fromFestivals.length >= 3 ? fromFestivals : FALLBACK_HERO_IMAGES;
  }, [festivals]);

  const festivalBrochure = brochures.find(b => b.category.includes('Festivals')) || brochures[0];

  // Festivals that have a date in the currently selected year
  const yearFestivals = festivals.filter(fest =>
    selectedYear === '2027' ? fest.dates2027 : fest.dates2026
  );

  const monthsList = [
    'all', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December', 'Jan 2028'
  ];

  const yearDate = (fest: Festival): string =>
    selectedYear === '2027'
      ? (fest.dates2027 || fest.dates2026 || '')
      : (fest.dates2026 || fest.dates2027 || '');

  const filteredFestivals = yearFestivals.filter(fest => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      fest.name.toLowerCase().includes(q) || 
      fest.location.toLowerCase().includes(q) || 
      fest.dzong.toLowerCase().includes(q) || 
      (yearDate(fest) && yearDate(fest).toLowerCase().includes(q));

    const matchesMonth = selectedMonth === 'all' || 
      (selectedMonth === 'Jan 2028' ? fest.month.toLowerCase().includes('jan') : fest.month.toLowerCase().includes(selectedMonth.toLowerCase()));

    return matchesSearch && matchesMonth;
  });

  return (
    <div className="bg-[#fcf8f2] text-[#2b1d14] overflow-hidden">

      {/* Hero Header Block with Auto-Sliding Image Background */}
      <div
        ref={heroRef}
        className="relative min-h-[68vh] sm:min-h-[80vh] flex items-center overflow-hidden bg-[#1f130b]"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
      >
        {/* Auto-sliding hero background — slides on its own, pauses on hover */}
        <div className="absolute inset-0">
          <AutoImageSlider
            images={heroSlideImages}
            alt="Bhutan Festival"
            intervalMs={5000}
            paused={heroHovered}
            showDots
            showArrows={false}
            showCounter={false}
            className="w-full h-full"
            imageClassName="object-cover"
          >
            {/* Readability overlays blending into the page background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1c0505]/85 via-[#2b1005]/45 to-[#fcf8f2]/95 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c0505]/70 via-[#2b1005]/20 to-transparent pointer-events-none z-10" />
          </AutoImageSlider>
        </div>

        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6 sm:space-y-8"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Official Festival Dates Document ({yearFestivals.length} Festivals)
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.04em] uppercase text-[#f7f1e7] drop-shadow-md leading-tight"
          >
            Bhutan Land Of Happiness Tours Festival Schedule {selectedYear}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-sm sm:text-lg text-amber-100/90 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm"
          >
            Tentative festival dates for all sacred Tshechus, Dromchoes, Thongdrol unfurlings, and mountain celebrations across Bhutan ({yearFestivals.length} events for {selectedYear}). Click any row to inspect details.
          </motion.p>

          {/* Section Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pt-6 sm:pt-10 pb-2 sm:pb-4 relative flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2d1be]" />
            </div>
            <div className="relative bg-[#fcf8f2] px-4 sm:px-6 text-[9px] sm:text-[10px] font-sans tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#d96b27] font-semibold">
              Sacred Mask Dances & Celebrations
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {festivalBrochure && (
              <button
                onClick={() => setActiveBrochure(festivalBrochure)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                <span>Read Official PDF Document</span>
              </button>
            )}
          </motion.div>
        </motion.section>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Filter & View Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-amber-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search all ${yearFestivals.length} festivals by name, dzong, or location (e.g., Paro, Thimphu, Punakha, Jambay)...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl py-2.5 pl-10 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner"
              />
            </div>

            {/* Year Toggle */}
            <div className="flex items-center gap-2 shrink-0 bg-[#f8f1e5] p-1 rounded-xl border border-amber-300">
              <button
                onClick={() => { setSelectedYear('2026'); setSelectedMonth('all'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif flex items-center gap-1.5 cursor-pointer transition-colors ${
                  selectedYear === '2026' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-200/50'
                }`}
              >
                <span>2026 Dates</span>
              </button>
              <button
                onClick={() => { setSelectedYear('2027'); setSelectedMonth('all'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif flex items-center gap-1.5 cursor-pointer transition-colors ${
                  selectedYear === '2027' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-200/50'
                }`}
              >
                <span>2027 Dates</span>
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 shrink-0 bg-[#f8f1e5] p-1 rounded-xl border border-amber-300">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif flex items-center gap-1.5 cursor-pointer transition-colors ${
                  viewMode === 'table' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-200/50'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Full Schedule Table (All 44)</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif flex items-center gap-1.5 cursor-pointer transition-colors ${
                  viewMode === 'grid' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-200/50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards Grid View</span>
              </button>
            </div>
          </div>

          {/* Month Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold text-amber-950 text-xs font-serif shrink-0 mr-1">Filter Month:</span>
            {monthsList.map(month => (
              <FilterPill
                key={month}
                variant="pill"
                active={selectedMonth === month}
                onClick={() => setSelectedMonth(month)}
              >
                {month === 'all' ? `All ${yearFestivals.length} Festivals` : month}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        {filteredFestivals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-amber-200 space-y-3">
            <p className="font-serif text-base text-amber-950 font-bold">No festivals found matching your search query.</p>
            <p className="text-stone-600 text-xs font-serif">Try searching for a different keyword or resetting your month filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedMonth('all'); }}
              className="px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl hover:bg-amber-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (

          /* Table Schedule View (PDF Format) */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-lg overflow-hidden space-y-0"
          >
            <div className="p-6 bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-amber-500">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-500 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                    Official Document Data
                  </span>
                  <span className="text-xs text-amber-300 font-serif font-semibold">Bhutan Land Of Happiness Tours</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-amber-50 mt-1">
                  TENTATIVE FESTIVAL DATES FOR THE YEAR {selectedYear}
                </h2>
                <p className="text-[11px] font-serif text-amber-200/80 mt-0.5">[Tentative dates — click any row to inspect details]</p>
              </div>
              <span className="bg-amber-500 text-amber-950 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shrink-0 w-max shadow-xs">
                Showing {filteredFestivals.length} / {yearFestivals.length} Festivals
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-serif text-xs">
                <thead>
                  <tr className="bg-amber-100/90 text-amber-950 font-extrabold border-b-2 border-amber-300 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-16 text-center border-r border-amber-300">SL NO.</th>
                    <th className="py-3.5 px-4 border-r border-amber-300">FESTIVAL</th>
                    <th className="py-3.5 px-4 border-r border-amber-300">PLACE</th>
                    <th className="py-3.5 px-4 border-r border-amber-300">DATE</th>
                    <th className="py-3.5 px-4 text-center">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200 text-stone-800">
                  {filteredFestivals.map((fest) => (
                    <tr 
                      key={fest.id} 
                      onClick={() => setActiveModalFestival(fest)}
                      className="hover:bg-amber-100/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-extrabold text-center border-r border-amber-200 text-amber-900 group-hover:text-amber-950">
                        {fest.slNo || fest.id}
                      </td>
                      <td className="py-3.5 px-4 border-r border-amber-200">
                        <div className="font-extrabold text-sm text-amber-950 group-hover:text-rose-900 transition-colors flex items-center gap-1.5">
                          <span>{fest.name}</span>
                          <ExternalLink className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-stone-600 font-serif line-clamp-1 mt-0.5">{fest.description}</div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-amber-200">
                        <div className="font-bold text-stone-900">{fest.dzong}</div>
                        <div className="text-[11px] text-teal-800 font-medium">{fest.location}</div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-amber-200 whitespace-nowrap font-extrabold text-rose-950">
                        <div className="bg-rose-50 border border-rose-200 text-rose-900 px-3 py-1 rounded-md text-xs inline-block">
                          {yearDate(fest)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setActiveModalFestival(fest)}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-amber-50 font-bold text-[11px] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        ) : (

          /* Individual Cards View with Embedded Tables */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b-2 border-amber-400 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-700"></span>
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-amber-950">
                  Individual Festival Cards ({filteredFestivals.length} Events)
                </h2>
              </div>
              <span className="text-xs font-serif font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                PDF Extracted Data
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFestivals.map((fest) => (
                <motion.div 
                  key={fest.id} 
                  {...luxuryHoverProps}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-amber-300/80 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img src={fest.heroImage} alt={fest.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-red-950/90 text-amber-200 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-500/50 shadow-xs">
                        {fest.month}
                      </div>
                      {fest.slNo && (
                        <div className="absolute top-3 right-3 bg-amber-500 text-amber-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs">
                          SL No. {fest.slNo}
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      <h3 className="font-serif font-extrabold text-lg text-amber-950 leading-snug">{fest.name}</h3>

                      {/* Dedicated Table for this Festival */}
                      <div className="bg-[#fcf8f2] rounded-2xl p-3 border-2 border-amber-300/80 overflow-hidden text-xs">
                        <div className="text-[10px] font-extrabold text-amber-950 uppercase tracking-wider mb-2 border-b border-amber-200 pb-1 flex items-center justify-between">
                          <span>FESTIVAL TABLE ENTRY</span>
                          <span className="text-rose-900 font-bold">SL #{fest.slNo}</span>
                        </div>
                        <table className="w-full text-left font-serif text-[11px] border-collapse">
                          <tbody>
                            <tr className="border-b border-amber-200">
                              <td className="py-1.5 px-2 font-bold text-amber-950 bg-amber-100/70 w-24 border-r border-amber-200">FESTIVAL</td>
                              <td className="py-1.5 px-2 font-bold text-amber-900">{fest.name}</td>
                            </tr>
                            <tr className="border-b border-amber-200">
                              <td className="py-1.5 px-2 font-bold text-amber-950 bg-amber-100/70 border-r border-amber-200">PLACE</td>
                              <td className="py-1.5 px-2 text-stone-900 font-semibold">{fest.dzong}, {fest.location}</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 px-2 font-bold text-amber-950 bg-amber-100/70 border-r border-amber-200">DATE ({selectedYear})</td>
                              <td className="py-1.5 px-2 font-extrabold text-rose-900 bg-rose-50/50">{yearDate(fest)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="text-stone-700 text-xs leading-relaxed font-serif">{fest.description}</p>

                      <div className="p-3 bg-amber-100/70 rounded-2xl border border-amber-300 text-xs text-amber-950">
                        <span className="font-extrabold text-rose-900 block text-[10px] uppercase tracking-wider">Spiritual Blessing & Significance:</span>
                        <p className="italic font-serif font-medium mt-0.5 text-stone-800">{fest.significance}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-amber-200 flex items-center justify-between">
                    <span className="text-[11px] font-serif font-bold text-amber-900">Duration: {fest.durationDays} Days</span>
                    <button
                      onClick={() => setActiveModalFestival(fest)}
                      className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                    >
                      <span>View Details</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modal for Individual Festival Detail */}
        {activeModalFestival && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-3xl border-2 border-amber-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setActiveModalFestival(null)}
                className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-52 overflow-hidden">
                <img src={activeModalFestival.heroImage} alt={activeModalFestival.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                  <div>
                    <span className="bg-amber-500 text-amber-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
                      SL No. {activeModalFestival.slNo || activeModalFestival.id} • {activeModalFestival.month}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {activeModalFestival.name}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Official Table extracted from PDF */}
                <div className="bg-[#fcf8f2] rounded-2xl border-2 border-amber-300 overflow-hidden shadow-sm">
                  <div className="bg-amber-900 text-amber-100 px-4 py-2.5 font-serif font-extrabold text-xs flex items-center justify-between">
                    <span>OFFICIAL FESTIVAL DATE TABLE (PDF EXTRACT)</span>
                    <span className="text-amber-300 text-[11px]">BHUTAN LAND OF HAPPINESS TOURS</span>
                  </div>
                  <table className="w-full text-left font-serif text-xs border-collapse">
                    <tbody className="divide-y divide-amber-200">
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-amber-950 bg-amber-100/70 w-32 border-r border-amber-200">SL NO.</td>
                        <td className="py-2.5 px-4 font-extrabold text-amber-900">{activeModalFestival.slNo || activeModalFestival.id}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-amber-950 bg-amber-100/70 border-r border-amber-200">FESTIVAL NAME</td>
                        <td className="py-2.5 px-4 font-extrabold text-amber-950 text-sm">{activeModalFestival.name}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-amber-950 bg-amber-100/70 border-r border-amber-200">PLACE / DZONG</td>
                        <td className="py-2.5 px-4 font-bold text-stone-900">{activeModalFestival.dzong}, {activeModalFestival.location}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-amber-950 bg-amber-100/70 border-r border-amber-200">TENTATIVE DATE ({selectedYear})</td>
                        <td className="py-2.5 px-4 font-extrabold text-rose-900 text-sm bg-rose-50/80">
                          {yearDate(activeModalFestival)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-amber-950 bg-amber-100/70 border-r border-amber-200">DURATION</td>
                        <td className="py-2.5 px-4 font-semibold text-stone-800">{activeModalFestival.durationDays} Days Celebration</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif font-extrabold text-amber-950 text-sm">About {activeModalFestival.name}</h4>
                  <p className="text-stone-700 text-xs font-serif leading-relaxed">{activeModalFestival.description}</p>
                </div>

                <div className="p-4 bg-amber-100/80 rounded-2xl border border-amber-300 space-y-1">
                  <span className="font-extrabold text-rose-900 text-xs uppercase tracking-wider block">Spiritual Blessing & Significance:</span>
                  <p className="font-serif italic text-xs text-amber-950 font-medium">{activeModalFestival.significance}</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-amber-200">
                  <button
                    onClick={() => setActiveModalFestival(null)}
                    className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                  >
                    Close
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

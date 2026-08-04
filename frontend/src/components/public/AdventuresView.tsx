import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { MapPin, Clock, ChevronRight, FileText } from 'lucide-react';
import { luxuryHoverProps } from '../../utils/motion';

export const AdventuresView: React.FC = () => {
  const { packages, setActivePackage, brochures, setActiveBrochure, selectedParam } = useApp();

  const isTrekking = selectedParam === 'trekking';
  const adventurePackages = packages.filter(p => p.category === 'adventure' || (isTrekking && p.highlights.some(h => h.toLowerCase().includes('trek') || h.toLowerCase().includes('trail'))));
  const trekkingBrochure = brochures.find(b => b.category.includes('Adventure')) || brochures[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-800 shadow-xl"
      >
        <div className="max-w-2xl space-y-4">
          <span className="bg-amber-600 text-amber-950 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
            {isTrekking ? 'Trans-Bhutan Trail & High Mountain Passes' : 'Trans-Bhutan Trail & Heli-Expeditions'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            {isTrekking ? 'Trekking Packages & Mountain Trails' : 'Himalayan Wilderness & Adventure Tours'}
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm font-serif leading-relaxed">
            {isTrekking
              ? 'Hike restored sections of the ancient Trans-Bhutan Trail, traverse high Himalayan passes, and unwind in luxury wilderness dome camps with private cooks.'
              : 'Traverse restored ancient trails, glamp under starry Himalayan mountain skies with luxury dome tents and private chefs, ride mountain bikes down Chele La Pass, and soar on helicopter charters.'}
          </p>

          {trekkingBrochure && (
            <button
              onClick={() => setActiveBrochure(trekkingBrochure)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Read Trans-Bhutan Trekking PDF Brochure</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Package List */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {adventurePackages.map((pkg) => (
          <motion.div 
            key={pkg.id} 
            {...luxuryHoverProps}
            onClick={() => setActivePackage(pkg)}
            className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-md p-6 space-y-4 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="relative h-56 rounded-xl overflow-hidden">
                <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-amber-950/80 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {pkg.hotelCategory}
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>{pkg.durationDays} Days</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>{pkg.destinations.join(', ')}</span>
              </div>

              <h3 className="font-serif font-bold text-xl text-amber-950 group-hover:text-[#d96b27] transition-colors">{pkg.title}</h3>
              <p className="text-stone-600 text-xs leading-relaxed font-serif line-clamp-3">{pkg.description}</p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="font-bold text-amber-900 text-sm">${pkg.priceUSD.toLocaleString()} USD / person</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePackage(pkg);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <span>More Details</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { FileText } from 'lucide-react';
import { PackageList } from '../../packages/components/PackageList';

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
      <PackageList
        packages={adventurePackages}
        onSelect={setActivePackage}
        variant="adventure"
        gridClassName="grid grid-cols-1 md:grid-cols-2 gap-8"
      />

    </div>
  );
};

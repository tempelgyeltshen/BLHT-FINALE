import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { Download, Eye, BookOpen } from 'lucide-react';
import { luxuryHoverProps } from '../../../../utils/motion';
import { downloadBrochurePdf } from '../../../../utils/downloadPdf';

export const BrochuresView: React.FC = () => {
  const { brochures, setActiveBrochure, logBrochureDownload, showToast } = useApp();

  const handleDownload = (b: typeof brochures[0]) => {
    logBrochureDownload(b.id, 'guest@blht.bt');
    downloadBrochurePdf(b, showToast);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-red-950 via-amber-950 to-rose-950 text-amber-50 rounded-3xl p-6 sm:p-12 border-2 border-amber-500/60 text-center space-y-3 sm:space-y-4 shadow-xl"
      >
        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-extrabold text-[10px] uppercase px-3.5 py-1 rounded-full inline-block shadow-xs">
          Official Digital Publications
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-100 max-w-2xl mx-auto leading-snug">
          Brochure Library & PDF Downloads
        </h1>
        <p className="text-amber-200/90 text-xs sm:text-sm font-serif max-w-xl mx-auto leading-relaxed font-medium">
          Browse our high-resolution brochures in our interactive reader or download high-density PDFs for offline viewing on phone, tablet, and desktop.
        </p>
      </motion.div>

      {/* Brochure Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
      >
        {brochures.map((b) => (
          <motion.div 
            key={b.id} 
            {...luxuryHoverProps}
            className="bg-white rounded-3xl border-2 border-amber-300/80 p-4 sm:p-6 shadow-md flex flex-col sm:flex-row gap-4 sm:gap-6 cursor-pointer"
          >
            {/* Cover */}
            <div 
              onClick={() => setActiveBrochure(b)}
              className="relative w-full sm:w-48 lg:w-44 h-56 sm:h-60 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 cursor-pointer group shadow-md"
            >
              <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                  <Eye className="w-4 h-4" /> Launch Reader
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                  <span className="bg-rose-100 text-rose-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-rose-300">
                    {b.category}
                  </span>
                  <span className="text-[10px] text-stone-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {b.fileSize}{b.totalPages > 0 ? ` • ${b.totalPages} Pages` : ''}
                  </span>
                </div>

                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-amber-950 leading-snug break-words">
                  {b.title}
                </h3>
                <p className="text-stone-700 text-xs mt-1 font-serif font-medium leading-normal">
                  {b.subtitle}
                </p>

                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-widest block">
                    Table of Contents Sample:
                  </span>
                  <ul className="text-[11px] text-stone-800 font-medium space-y-0.5">
                    {b.tableOfContents?.slice(0, 3).map(toc => (
                      <li key={toc.page} className="flex justify-between border-b border-amber-100 pb-0.5">
                        <span className="truncate min-w-0 flex-1">p.{toc.page} {toc.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-amber-200 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <button
                  onClick={() => setActiveBrochure(b)}
                  className="w-full sm:flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-red-950 via-amber-950 to-rose-950 hover:from-red-900 hover:to-amber-900 text-amber-100 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="whitespace-nowrap">Read Brochure</span>
                </button>

                <button
                  onClick={() => handleDownload(b)}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[44px] whitespace-nowrap"
                  title="Direct Download PDF"
                >
                  <Download className="w-4 h-4 text-rose-800 shrink-0" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};


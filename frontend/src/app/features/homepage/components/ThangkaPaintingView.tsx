import React from 'react';
import { motion } from 'motion/react';
import { Brush, Palette, Award, Eye, ExternalLink, Phone, Mail, Star, Sparkles, Scroll, Mountain, Download, BookOpen, FileText } from 'lucide-react';
import { useApp } from '../../../core/providers/AppProvider';
import { downloadBrochurePdf } from '../../../../utils/downloadPdf';

export const ThangkaPaintingView: React.FC = () => {
  const { brochures, setActiveBrochure, logBrochureDownload, showToast } = useApp();
  const thangkaBrochures = brochures.filter(b => b.category.includes('Thangka'));
  const mainBrochure = thangkaBrochures[0];

  const handleDownload = (b: typeof brochures[0]) => {
    logBrochureDownload(b.id, 'guest@blht.bt');
    downloadBrochurePdf(b, showToast);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 overflow-hidden">
      
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#3b2314] text-amber-50 rounded-3xl p-6 sm:p-8 border border-[#d96b27]/30 shadow-xl space-y-3 text-center"
      >
        <span className="text-[#d96b27] font-bold text-xs uppercase tracking-widest font-serif block">
          Sacred Buddhist Art
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
          High Quality Thangka Painting
        </h1>
        <p className="text-amber-200/90 text-xs sm:text-sm font-serif max-w-3xl mx-auto leading-relaxed">
          Discover authentic traditional Bhutanese thangka art created by master artists. Each piece is a sacred masterpiece representing Buddhist deities, mandalas, and spiritual teachings, preserving centuries-old artistic traditions.
        </p>
      </motion.div>

      {/* About Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#f5eee4] border border-[#e2d1be] rounded-3xl p-6 sm:p-8 space-y-4"
      >
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider font-serif">Our Heritage</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314]">The Sacred Art of Thangka</h2>
          <p className="text-xs sm:text-sm text-stone-700 font-serif leading-relaxed">
            Thangka paintings are religious Buddhist scroll paintings that serve as important teaching tools and meditation aids. At Bhutan Land of Happiness Tours, we are the most competent tour operator in introducing visitors to Bhutan's rich tradition of Thangka paintings. Our master artists preserve ancient techniques passed down through generations, creating authentic pieces that capture the spiritual essence of Bhutanese Buddhism.
          </p>
          <p className="text-xs sm:text-sm text-stone-700 font-serif leading-relaxed italic border-l-2 border-[#d96b27] pl-4 py-2">
            "We know our history better and will never mislead our guests with exaggerated information. Each thangka tells a story of enlightenment, compassion, and the path to inner peace."
          </p>
        </div>
      </motion.div>

      {/* Services Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="text-[#d96b27] font-bold text-xs uppercase tracking-widest font-serif">Our Offerings</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314]">Thangka Art Services</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Brush className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Custom Thangkas</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Commission personalized thangka paintings of specific deities, mandalas, or spiritual themes. Our artists work closely with you to create meaningful, sacred art for your home or temple.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Traditional Techniques</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Authentic methods using natural pigments, gold leaf, and cotton canvas following ancient traditions. Each piece takes weeks to months to complete, ensuring spiritual authenticity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Art Workshops</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Learn the sacred art of thangka painting from master artists through hands-on workshops. Perfect for art enthusiasts, spiritual seekers, and cultural travelers.
            </p>
          </div>

        </div>
      </motion.div>

      {/* What We Offer */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="text-[#d96b27] font-bold text-xs uppercase tracking-widest font-serif">What We Offer</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314]">Comprehensive Thangka Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-serif leading-relaxed">
          
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Award className="w-5 h-5" />
              <span>Master Artists</span>
            </div>
            <p className="text-stone-700">
              Our thangka painters are trained masters with decades of experience in this sacred art form. They have studied under renowned masters and carry forward authentic lineages.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Star className="w-5 h-5" />
              <span>Authentic Quality</span>
            </div>
            <p className="text-stone-700">
              Each piece is created using traditional methods and materials, ensuring genuine spiritual significance. We use natural pigments, genuine gold leaf, and traditional canvas preparation.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Brush className="w-5 h-5" />
              <span>Custom Designs</span>
            </div>
            <p className="text-stone-700">
              Work with our artists to create personalized thangkas that resonate with your spiritual journey. We can depict specific deities, mandalas, or spiritual symbols meaningful to you.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Palette className="w-5 h-5" />
              <span>Cultural Education</span>
            </div>
            <p className="text-stone-700">
              Gain deep understanding of Buddhist symbolism and the spiritual meaning behind each thangka. Learn about the iconography, color symbolism, and meditation practices associated with each piece.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Scroll className="w-5 h-5" />
              <span>Sacred Scriptures</span>
            </div>
            <p className="text-stone-700">
              Each thangka is created following traditional sacred texts and iconographic guidelines. Our artists ensure every detail aligns with Buddhist religious requirements.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Restoration Services</span>
            </div>
            <p className="text-stone-700">
              Expert restoration of damaged or aged thangkas while preserving their spiritual essence. Our artists specialize in traditional restoration techniques for sacred art.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#f5eee4] border border-[#e2d1be] rounded-3xl p-6 sm:p-8 space-y-6"
      >
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314] text-center">Why Choose Our Thangka Services?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-serif leading-relaxed">
          
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Mountain className="w-5 h-5" />
              <span>Authentic Bhutanese Art</span>
            </div>
            <p className="text-stone-700">
              Our artists are Bhutanese masters trained in traditional techniques. We are the most competent tour operator in introducing visitors to Bhutan's rich thangka painting tradition.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Eye className="w-5 h-5" />
              <span>Spiritual Authenticity</span>
            </div>
            <p className="text-stone-700">
              Every thangka is created with proper rituals, prayers, and meditation practices. We ensure each piece carries genuine spiritual blessings and authenticity.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Thangka Painting Brochure - Main Publication */}
      {mainBrochure && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#3b2314] text-amber-50 rounded-3xl p-6 sm:p-10 border border-[#d96b27]/40 shadow-xl overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-10">
            <img src={mainBrochure.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden border-2 border-[#d96b27]/60 shadow-lg shrink-0 cursor-pointer group" onClick={() => setActiveBrochure(mainBrochure)}>
              <img src={mainBrochure.coverImage} alt={mainBrochure.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <span className="inline-block bg-[#d96b27] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Official Thangka Painting Brochure
              </span>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-amber-100 leading-snug">{mainBrochure.title}</h2>
              <p className="text-amber-200/90 text-xs sm:text-sm font-serif leading-relaxed max-w-2xl mx-auto sm:mx-0">
                {mainBrochure.subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-bold">
                <span className="bg-amber-50/10 border border-amber-200/30 px-2.5 py-1 rounded-md">{mainBrochure.fileSize}</span>
                <span className="bg-amber-50/10 border border-amber-200/30 px-2.5 py-1 rounded-md">{mainBrochure.totalPages} Pages</span>
                <span className="bg-amber-50/10 border border-amber-200/30 px-2.5 py-1 rounded-md">{mainBrochure.year}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center sm:justify-start">
                <button
                  onClick={() => setActiveBrochure(mainBrochure)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d96b27] to-[#b85116] hover:from-[#e07a35] hover:to-[#c85c1a] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-105"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read the Full 26-Page Brochure</span>
                </button>
                <button
                  onClick={() => handleDownload(mainBrochure)}
                  className="px-6 py-3 rounded-xl bg-[#f5eee4] hover:bg-[#efe2d3] border border-[#d8c7b2] text-[#3b2314] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105"
                  title="Direct Download PDF"
                >
                  <Download className="w-4 h-4 text-[#d96b27]" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contact Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-[#d96b27] to-[#b85116] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif text-xl sm:text-2xl font-bold">Commission Your Thangka</h3>
          <p className="text-xs sm:text-sm font-serif text-amber-100">
            Connect with our master artists for sacred thangka paintings
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono pt-1">
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> +975-17377777 / +975-77444445</span>
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> pemsbumthap@gmail.com</span>
          </div>
        </div>

        <a
          href="https://www.bhutanlhtours.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-[#3b2314] hover:bg-[#2b1d14] text-amber-100 font-serif font-bold text-xs rounded-xl shrink-0 shadow-md flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>Order at www.bhutanlhtours.com</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>

    </div>
  );
};
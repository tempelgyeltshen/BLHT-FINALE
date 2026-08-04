import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, ChevronRight, FileText, Sparkles, MapPin, Clock, Star, Calendar } from 'lucide-react';
import { Hotel } from '../../types';
import { luxuryHoverProps } from '../../utils/motion';

export const HomeView: React.FC = () => {
  const { 
    navigate, packages, hotels, brochures, 
    setActivePackage, setActiveHotel, setActiveBrochure
  } = useApp();
  const { t, translateText } = useLanguage();
  const navigateRouter = useNavigate();

  // Scroll Parallax for Hero Section
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const handleSelectHotel = (hotel: Hotel) => {
    setActiveHotel(hotel);
    const hotelSlug = hotel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigateRouter(`/hotels/${hotelSlug}`);
  };

  const featuredPackages = packages.filter(p => p.featured).slice(0, 4);
  const mainBrochure = brochures.find(b => b.featured) || brochures[0];
  const featuredHotels = hotels.filter(h => h.featured).slice(0, 3);

  return (
    <div className="bg-[#fcf8f2] text-[#2b1d14] space-y-20 pb-24 overflow-hidden">
      
      {/* Hero Header Block with Parallax Scroll & Staggered Luxury Fade-In */}
      <div ref={heroRef} className="relative pt-8 sm:pt-16 pb-6 overflow-hidden">
        
        {/* Subtle Ambient Parallax Background Watermark */}
        <motion.div 
          style={{ y: heroY, scale: bgScale, opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 z-0"
        >
          <div className="w-[500px] h-[500px] rounded-full bg-radial from-[#d96b27]/20 via-[#f5eee4]/10 to-transparent blur-3xl" />
          <span className="font-serif font-black text-[100px] sm:text-[200px] text-[#3b2314]/5 tracking-widest uppercase absolute">
            BHUTAN
          </span>
        </motion.div>

        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8"
        >
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[10px] sm:text-xs font-sans tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[#d96b27] font-bold block"
          >
            {t('hero.license', 'TOUR OPERATOR LICENSE #BLHT-8842')}
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-[0.08em] sm:tracking-[0.1em] uppercase text-[#3b2314] leading-tight"
          >
            {t('hero.title', 'Bhutan Land Of Happiness Tourism')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-sm sm:text-lg text-[#5c3820] max-w-3xl mx-auto leading-relaxed font-normal"
          >
            {t('hero.subtitle', 'Immerse yourself in the world’s first carbon-negative Kingdom. Guided by the Gross National Happiness philosophy, we orchestrate bespoke journeys across Bhutan’s sacred valleys, 5-star sanctuaries, and authentic cultural celebrations.')}
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
              {t('hero.circuits', 'Bespoke Circuits & Experiences')}
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-xs sm:text-base text-[#5c3820] max-w-3xl mx-auto leading-relaxed"
          >
            {t('hero.discoverItineraries', 'Discover our curated itineraries across Paro, Thimphu, Punakha, Gangtey, and Bumthang. Plan your journey with Bhutan Land Of Happiness Tourism for an unmatched spiritual and cultural renewal.')}
          </motion.p>
        </motion.section>

      </div>

      {/* Editorial Image Pair Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          
          {/* Card 1 */}
          <motion.div 
            {...luxuryHoverProps} 
            className="space-y-4 group cursor-pointer bg-[#fbf7f2] p-4 border border-[#e2d1be]" 
            onClick={() => navigate('luxury')}
          >
            <div className="relative h-[280px] xs:h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden bg-[#f0e4d6] border border-[#e2d1be]">
              <img 
                src="https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1400&q=80" 
                alt="Bhutan Himalayan Kingdom Circuit" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-[#d96b27] text-white text-[10px] font-sans tracking-[0.2em] uppercase px-3 py-1 font-semibold">
                {translateText('Kingdom Circuit')}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d96b27] font-sans font-bold block">{translateText('7 to 12 Night Circuits')}</span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                {t('home.circuit1Title', 'The Himalayan Kingdom Circuit')}
              </h3>
              <p className="font-serif text-xs text-[#5c3820] leading-relaxed line-clamp-2">
                {t('home.circuit1Desc', 'Traverse Paro, Thimphu, Punakha, Gangtey, and Bumthang across iconic 5-star sanctuary suites with private monastic blessings and helicopter transfers.')}
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            {...luxuryHoverProps} 
            className="space-y-4 group cursor-pointer bg-[#fbf7f2] p-4 border border-[#e2d1be]" 
            onClick={() => navigate('festivals')}
          >
            <div className="relative h-[280px] xs:h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden bg-[#f0e4d6] border border-[#e2d1be]">
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80" 
                alt="Sacred Bhutan Festivals" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-[#3b2314] text-white text-[10px] font-sans tracking-[0.2em] uppercase px-3 py-1 font-semibold">
                {translateText('Tshechu Festival')}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d96b27] font-sans font-bold block">{translateText('Cultural Celebrations')}</span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                {t('home.circuit2Title', 'Sacred Mask Dances & Tshechus 2026')}
              </h3>
              <p className="font-serif text-xs text-[#5c3820] leading-relaxed line-clamp-2">
                {t('home.circuit2Desc', 'VIP pavilion seating at Paro and Thimphu Tshechu festivals with custom silk Gho and Kira attire tailoring and private lama guided tours.')}
              </p>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* Feature Block: Orange & Brown Terracotta Accent */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center bg-[#f5eee4] p-6 sm:p-12 border border-[#e2d1be]">
          
          {/* Left Image */}
          <div className="lg:col-span-7 h-[260px] xs:h-[320px] sm:h-[400px] lg:h-[450px] overflow-hidden relative border border-[#e2d1be]">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" 
              alt="Bhutan Via Bangkok"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 lg:pl-4">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d96b27] font-bold block">{translateText('Seamless Travel')}</span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#3b2314] leading-tight">
              {t('home.serviceTitle', 'Bhutan Land Of Happiness Travel Service')}
            </h2>

            <p className="font-serif text-xs sm:text-sm text-[#5c3820] leading-relaxed">
              {t('home.serviceDesc', 'Traveling to the Kingdom is effortless with direct flight coordination via Drukair and Bhutan Airlines from Bangkok, Singapore, and New Delhi. Bhutan Land Of Happiness Tourism handles all visa processing, flight tickets, and personal concierge services.')}
            </p>

            <div className="pt-2">
              <a
                href="https://www.bhutanlhtours.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#d96b27] hover:bg-[#b85116] text-[#fcf8f2] text-[11px] font-medium tracking-[0.2em] uppercase px-8 py-3.5 transition-all cursor-pointer shadow-md min-h-[44px] inline-flex items-center justify-center"
              >
                {t('nav.planJourney', 'Plan your journey')}
              </a>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 5-Star Lodges Directory */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12"
      >
        <div className="text-center space-y-2 sm:space-y-3">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#d96b27] font-bold">{t('home.sanctuaries', '5-Star Sanctuaries')}</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#3b2314]">{translateText('Luxury Valleys & Lodges')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredHotels.map(hotel => (
            <motion.div 
              key={hotel.id}
              {...luxuryHoverProps}
              onClick={() => handleSelectHotel(hotel)}
              className="bg-[#f5eee4] border border-[#e2d1be] p-5 sm:p-6 space-y-4 cursor-pointer group"
            >
              <div className="h-48 sm:h-60 overflow-hidden relative">
                <img 
                  src={hotel.heroImage} 
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#3b2314] text-[#fcf8f2] text-[9px] font-sans tracking-[0.2em] uppercase px-3 py-1 font-semibold">
                  {translateText(hotel.region)} Valley
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#3b2314] group-hover:text-[#d96b27] transition-colors">
                  {hotel.name}
                </h3>
                <p className="font-serif text-xs text-[#5c3820] line-clamp-2 leading-relaxed">
                  "{hotel.tagline}"
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-[#3b2314] font-serif border-t border-[#e2d1be]">
                  <span className="font-semibold text-[#d96b27]">${hotel.pricePerNightUSD.toLocaleString()} / {translateText('night')}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectHotel(hotel);
                    }}
                    className="bg-[#d96b27] hover:bg-[#b85116] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>{t('button.viewDetails', 'More Details')}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Brochure Digital Reader Shelf */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-[#3b2314] text-[#fcf8f2] p-6 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border border-[#d96b27]/30 shadow-xl">
          
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            {mainBrochure && (
              <div 
                onClick={() => setActiveBrochure(mainBrochure)}
                className="cursor-pointer group max-w-xs sm:max-w-sm w-full border-2 border-[#d96b27] overflow-hidden shadow-2xl hover:scale-103 transition-transform"
              >
                <img src={mainBrochure.coverImage} alt={mainBrochure.title} className="w-full h-56 sm:h-72 lg:h-auto object-cover" />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#f28e2b] font-bold">
              {translateText('Official Publication Library')}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium leading-tight">
              {t('home.brochureTitle', 'Bhutan Land Of Happiness 2026 PDF Brochure')}
            </h2>
            <p className="font-serif text-xs sm:text-sm text-[#e2d1be] leading-relaxed">
              {translateText('Explore complete day-by-day itineraries, flight logistics, visa guidance, and luxury suite photography in our interactive reader or direct PDF download.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {mainBrochure && (
                <button
                  onClick={() => setActiveBrochure(mainBrochure)}
                  className="w-full sm:w-auto bg-[#d96b27] hover:bg-[#ea7a2a] text-[#fcf8f2] text-[11px] font-medium tracking-[0.2em] uppercase px-7 py-3.5 transition-colors cursor-pointer shadow-md text-center min-h-[44px]"
                >
                  {translateText('Launch Reader')}
                </button>
              )}
              <button
                onClick={() => navigate('brochures')}
                className="w-full sm:w-auto border border-[#e2d1be] text-[#fcf8f2] hover:bg-[#5c3820] text-[11px] font-medium tracking-[0.2em] uppercase px-7 py-3.5 transition-colors cursor-pointer text-center min-h-[44px]"
              >
                {translateText('Browse Brochure Collection')}
              </button>
            </div>
          </div>

        </div>
      </motion.section>

    </div>
  );
};


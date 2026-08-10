import React from 'react';
import { motion } from 'motion/react';
import { Car, Shield, Clock, Users, MapPin, Phone, Mail, ExternalLink, Fuel, Wrench, Star, Download, BookOpen, FileText } from 'lucide-react';
import { useApp } from '../../../core/providers/AppProvider';
import { downloadBrochurePdf } from '../../../../utils/downloadPdf';

export const CarRentalView: React.FC = () => {
  const { brochures, setActiveBrochure, logBrochureDownload, showToast } = useApp();
  const carRentalBrochures = brochures.filter(b => b.category.includes('Car Rental'));

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
          Premium Transport Services
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
          High Quality Car Rental
        </h1>
        <p className="text-amber-200/90 text-xs sm:text-sm font-serif max-w-3xl mx-auto leading-relaxed">
          Experience comfortable and reliable transportation across Bhutan with our premium vehicle rental services. From luxury SUVs to spacious buses, we have the perfect vehicle for your journey through the Land of Happiness.
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
          <span className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider font-serif">About Our Service</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314]">Premium Transportation Across Bhutan</h2>
          <p className="text-xs sm:text-sm text-stone-700 font-serif leading-relaxed">
            At Bhutan Land of Happiness Tours, we understand that comfortable transportation is essential for a memorable journey. Our car rental service offers a diverse fleet of well-maintained vehicles to suit every travel need, from solo travelers to large groups. Whether you're navigating the winding mountain roads to Paro's Tiger's Nest or exploring the remote valleys of Eastern Bhutan, our vehicles and experienced drivers ensure a safe, comfortable, and enjoyable travel experience.
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
          <span className="text-[#d96b27] font-bold text-xs uppercase tracking-widest font-serif">Our Fleet</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314]">Premium Vehicle Options</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Luxury SUVs</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Hyundai Tucson and Santa Fe for comfortable luxury travel across Bhutan's mountainous terrain. Perfect for families and small groups seeking comfort and style.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">4x4 Land Cruisers</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Toyota Land Cruisers for off-road adventures and remote destination access. Ideal for trekking support and exploration of Bhutan's rugged eastern regions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Group Buses</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Toyota Coaster buses for larger groups and organizational travel. Spacious, comfortable, and perfect for corporate retreats, wedding parties, or group tours.
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
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314]">Comprehensive Car Rental Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-serif leading-relaxed">
          
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Shield className="w-5 h-5" />
              <span>Well-Maintained Fleet</span>
            </div>
            <p className="text-stone-700">
              All vehicles undergo regular maintenance and safety inspections to ensure reliability on Bhutan's challenging mountain roads. Our fleet is always clean, comfortable, and road-ready.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Users className="w-5 h-5" />
              <span>Expert Local Drivers</span>
            </div>
            <p className="text-stone-700">
              Our experienced drivers are certified professionals who know every mountain pass, scenic route, and hidden gem across the Kingdom. They serve as both safe drivers and knowledgeable guides.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Clock className="w-5 h-5" />
              <span>Flexible Scheduling</span>
            </div>
            <p className="text-stone-700">
              Customizable rental periods from daily to weekly bookings. We adapt to your itinerary, whether you need airport transfers, day trips, or extended touring across multiple districts.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <MapPin className="w-5 h-5" />
              <span>Pan-Bhutan Coverage</span>
            </div>
            <p className="text-stone-700">
              Service available across all 20 districts of Bhutan - from Paro to Thimphu, Punakha to Bumthang, and beyond. No destination is too remote for our transportation network.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Fuel className="w-5 h-5" />
              <span>Fuel & Maintenance Included</span>
            </div>
            <p className="text-stone-700">
              Our rental packages include fuel costs and all maintenance during your rental period. Focus on enjoying your journey while we handle the logistics and vehicle upkeep.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Wrench className="w-5 h-5" />
              <span>24/7 Roadside Assistance</span>
            </div>
            <p className="text-stone-700">
              Comprehensive roadside assistance available throughout your rental. In the unlikely event of a breakdown, our support team ensures prompt assistance and alternative transportation if needed.
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
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314] text-center">Why Choose Our Car Rental Service?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-serif leading-relaxed">
          
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Star className="w-5 h-5" />
              <span>Competitive Pricing</span>
            </div>
            <p className="text-stone-700">
              Transparent pricing with no hidden fees. We offer competitive rates for all vehicle categories, with special packages for long-term rentals and group bookings.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#e2d1be]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Shield className="w-5 h-5" />
              <span>Safety First</span>
            </div>
            <p className="text-stone-700">
              All vehicles equipped with safety features including airbags, ABS, and emergency kits. Our drivers are trained in defensive driving and first aid for your peace of mind.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Car Rental Brochures */}
      {carRentalBrochures.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <span className="text-[#d96b27] font-bold text-xs uppercase tracking-widest font-serif">Brochures & Rate Cards</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2314]">Download Our Car Rental Brochures</h2>
            <p className="text-xs text-stone-600 font-serif max-w-2xl mx-auto">
              Browse our official fleet guides and rate cards in the interactive reader, or download the PDFs for offline use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carRentalBrochures.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-[#e2d1be] shadow-xs overflow-hidden flex flex-col hover:border-[#d96b27] transition-all hover:-translate-y-1"
              >
                <div className="relative h-40 bg-[#3b2314] flex items-center justify-center cursor-pointer group" onClick={() => setActiveBrochure(b)}>
                  <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute inset-0 bg-[#3b2314]/50 flex items-center justify-center">
                    <span className="bg-[#d96b27] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                      <FileText className="w-3.5 h-3.5" /> PDF Brochure
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="bg-[#f5eee4] text-[#d96b27] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#e2d1be]">
                      {b.category}
                    </span>
                    <span className="text-[10px] text-stone-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {b.fileSize}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#3b2314] leading-snug">{b.title}</h3>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed flex-1">{b.subtitle}</p>

                  <div className="pt-3 border-t border-[#e2d1be] flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setActiveBrochure(b)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#3b2314] hover:bg-[#2b1d14] text-amber-100 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#d96b27]" />
                      <span>Read Brochure</span>
                    </button>
                    <button
                      onClick={() => handleDownload(b)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#f5eee4] hover:bg-[#efe2d3] border border-[#d8c7b2] text-[#3b2314] font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      title="Direct Download PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-[#d96b27]" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
          <h3 className="font-serif text-xl sm:text-2xl font-bold">Book Your Vehicle Today</h3>
          <p className="text-xs sm:text-sm font-serif text-amber-100">
            Contact us for reservations and competitive pricing
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
          <span>Book at www.bhutanlhtours.com</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>

    </div>
  );
};
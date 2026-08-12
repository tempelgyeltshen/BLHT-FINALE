import React from 'react';
import { motion } from 'motion/react';
import { Award, Shield, Heart, Compass, UserCheck, Car, Building2, ExternalLink, Mail, Phone } from 'lucide-react';
import { CeoSection } from './CeoSection';

export const AboutView: React.FC = () => {

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
          Approved by the Government of Bhutan
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
          About Bhutan Land of Happiness- Tours
        </h1>
        <p className="text-amber-200/90 text-xs sm:text-sm font-serif max-w-3xl mx-auto leading-relaxed">
          Bhutan Land of Happiness- Tours is a home bred tour company approved by the Government of Bhutan, dedicated to delivering genuine, authentic, and unforgettable experiences across the Kingdom.
        </p>

        <div className="pt-2">
          <a
            href="https://www.bhutanlhtours.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
          >
            <span>Visit Official Booking Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Polished Executive Leadership & CEO Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <CeoSection />
      </motion.div>

      {/* Our Vision */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#f5eee4] border border-[#e2d1be] rounded-3xl p-8 sm:p-12 space-y-6 text-center"
      >
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider font-serif">Our Vision</span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2314] leading-relaxed">
            Remember, it's not about where you start; it's about where you're headed and the impact you make along the way.
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 font-serif leading-relaxed max-w-3xl mx-auto">
            This vision guides every journey we craft and every guest we welcome. We believe that meaningful travel is about transformation—how Bhutan's ancient wisdom, sacred landscapes, and warm hospitality can change not just your itinerary, but your perspective.
          </p>
        </div>
      </motion.div>

      {/* WHY CHOOSE US SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-8 pt-6"
      >
        <div className="text-center space-y-2">
          <span className="text-[#d96b27] font-bold text-xs uppercase tracking-widest font-serif">Excellence Guaranteed</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2314]">Why Choose Bhutan Land of Happiness Tours?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Custom Tours</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              We specialize in curating tours tailored to your travelling needs and budget ensuring you a unique travelling experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">No Hidden Cost</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              We operate our services with transparency allowing you to travel and explore the beauty of Bhutan without any hidden cost.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Authentic Experiences</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Our tour operators will ensure that you have an authentic travelling experience that will allow acknowledge the rich culture of Bhutan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2d1be] shadow-xs space-y-3 hover:border-[#d96b27] transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#f5eee4] rounded-xl flex items-center justify-center text-[#d96b27]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#3b2314]">Expert Guidance</h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              Embark on a smooth and hassle-free travelling experience with expert guidance and seamless assistance throughout your journey.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Management, Transport & Hotels */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#3b2314] text-amber-100 rounded-3xl p-8 sm:p-10 border border-[#e2d1be] space-y-8 shadow-xl"
      >
        <h2 className="font-serif text-2xl font-bold text-amber-50 border-b border-[#5c3820] pb-4">
          Infrastructures & Service Standards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-serif leading-relaxed">
          
          <div className="space-y-2 bg-[#4a2e1b] p-5 rounded-2xl border border-[#5c3820]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <UserCheck className="w-5 h-5" />
              <span>Certified Guides & Staff</span>
            </div>
            <p className="text-amber-200/90">
              Professionally trained tour guides certified by the Tourism Authority of Bhutan. Selected through rigorous interviews to ensure honesty, integrity, high values, and strong principles.
            </p>
          </div>

          <div className="space-y-2 bg-[#4a2e1b] p-5 rounded-2xl border border-[#5c3820]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Car className="w-5 h-5" />
              <span>Luxurious Transport Fleet</span>
            </div>
            <p className="text-amber-200/90">
              Capacity to provide comfortable vehicles based on your choice—ranging from Hyundai Tucson and Santa Fe cars to Toyota Coaster buses and Land Cruisers, driven by virtuoso drivers.
            </p>
          </div>

          <div className="space-y-2 bg-[#4a2e1b] p-5 rounded-2xl border border-[#5c3820]">
            <div className="flex items-center gap-2 text-[#d96b27] font-bold text-sm">
              <Building2 className="w-5 h-5" />
              <span>Graded Hotel Partnerships</span>
            </div>
            <p className="text-amber-200/90">
              Close partnerships with hotels graded by the Tourism Authority of Bhutan, featuring internationally trained chefs and versatile hotel staff guaranteeing smooth and satisfying services.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Direct Contact Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-[#d96b27] to-[#b85116] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif text-2xl font-bold">Contact Our Bhutan Headquarters</h3>
          <p className="text-xs sm:text-sm font-serif text-amber-100">
            Post Box, TDSC Building, Norzin Lam, Thimphu Bhutan
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono pt-1">
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> +975-17377777 / +975-77444445</span>
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> pemsbumthap@gmail.com</span>
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> bhutanlhtours@gmail.com</span>
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

import React from 'react';
import { useApp } from '../../../../core/providers/AppProvider';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../../../../config/constants';
import bhutanLogo from '../../../../../assets/images/blht_logo.png';

export const Footer: React.FC = () => {
  const { navigate, brochures, setActiveBrochure } = useApp();

  const handleBrochureClick = () => {
    const mainBrochure = brochures[0];
    if (mainBrochure) setActiveBrochure(mainBrochure);
    else navigate('brochures');
  };

  return (
    <footer className="bg-[#2a170a] text-[#fcf8f2] border-t-2 border-[#d96b27]">
      {/* Top Callout */}
      <div className="border-b border-[#422613] py-12 px-6 sm:px-8 bg-[#331c0c]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-2xl font-light text-[#fcf8f2]">Request Your Bhutan Land Of Happiness Travel Kit</h3>
            <p className="font-serif text-xs text-[#e2d1be]">Receive our 2026 digital brochure or speak directly with our travel concierge team in Thimphu.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleBrochureClick}
              className="border border-[#d96b27] text-[#fcf8f2] hover:bg-[#d96b27] text-[11px] font-medium tracking-[0.18em] uppercase px-6 py-3 transition-colors cursor-pointer"
            >
              2026 Brochure (PDF)
            </button>
            <a
              href="https://www.bhutanlhtours.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#d96b27] text-[#fcf8f2] hover:bg-[#b85116] text-[11px] font-medium tracking-[0.18em] uppercase px-6 py-3 transition-colors cursor-pointer font-bold shadow-md inline-block"
            >
              Book on Official Site
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-xs font-serif">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#d96b27] shadow-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img 
                src={bhutanLogo} 
                alt="Bhutan Land of Happiness Logo" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-[0.12em] uppercase text-[#fcf8f2] block leading-tight">
                BHUTAN LAND OF HAPPINESS
              </span>
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#d96b27] font-bold uppercase block mt-0.5">
                TOURS
              </span>
            </div>
          </div>
          <p className="text-[#e2d1be] leading-relaxed text-xs">
            Bhutan Land of Happiness Tours — explore our curated travel packages and itineraries. Official bookings are completed via our main portal at bhutanlhtours.com.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h5 className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d96b27] font-bold">Journeys</h5>
          <ul className="space-y-2 text-[#e2d1be]">
            <li><button onClick={() => navigate('luxury')} className="hover:text-[#d96b27] transition-colors">Kingdom Circuits</button></li>
            <li><button onClick={() => navigate('hotels')} className="hover:text-[#d96b27] transition-colors">5-Star Luxury Lodges</button></li>
            <li><button onClick={() => navigate('festivals')} className="hover:text-[#d96b27] transition-colors">Sacred Tshechu Festivals</button></li>
            <li><button onClick={() => navigate('brochures')} className="hover:text-[#d96b27] transition-colors">Digital Publication Library</button></li>
          </ul>
        </div>

        {/* Explorations */}
        <div className="space-y-3">
          <h5 className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d96b27] font-bold">Explore</h5>
          <ul className="space-y-2 text-[#e2d1be]">
            <li><button onClick={() => navigate('gallery')} className="hover:text-[#d96b27] transition-colors">Visual Experience Gallery</button></li>
            <li><button onClick={() => navigate('about')} className="hover:text-[#d96b27] transition-colors">Gross National Happiness Philosophy</button></li>
            <li><button onClick={() => navigate('contact')} className="hover:text-[#d96b27] transition-colors">Contact Us</button></li>
            <li><button onClick={() => navigate('search')} className="hover:text-[#d96b27] transition-colors">Search Expeditions</button></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h5 className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d96b27] font-bold">Thimphu HQ</h5>
          <ul className="space-y-2 text-[#e2d1be]">
            <li className="font-semibold text-amber-100">Bhutan Land of Happiness Tours</li>
            <li>TDSC Building, Norzin Lam, Building no: 45 Flat no 202, Thimphu Bhutan.</li>
            <li className="font-mono text-[11px]">+975-17377777 / +975-77444445</li>
            <li><a href="mailto:bhutanlhtours@gmail.com" className="hover:underline text-[#d96b27]">bhutanlhtours@gmail.com</a></li>
            <li className="pt-1">
              <a href="https://www.bhutanlhtours.com/" target="_blank" rel="noopener noreferrer" className="text-[#d96b27] font-bold hover:underline">
                www.bhutanlhtours.com
              </a>
            </li>
            <li className="pt-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp Us</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-[#422613] py-6 px-6 text-center text-[11px] font-serif text-[#e2d1be]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Bhutan Land Of Happiness Tourism (BLHT). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#d96b27]">
            <button onClick={() => navigate('privacy-terms')} className="hover:underline">Privacy Policy & Visa Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};


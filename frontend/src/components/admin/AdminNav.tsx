import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, FileText, Hotel, Edit, 
  MessageSquare, LogOut, Globe, Layers, Calendar, Film, Image, Menu, X 
} from 'lucide-react';
import { ViewRoute } from '../../types';
import bhutanLogo from '../../assets/images/blht_logo.png';

export const AdminNav: React.FC = () => {
  const { currentRoute, navigate, logoutAdmin, adminUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { label: string; route: ViewRoute; icon: React.ReactNode }[] = [
    { label: 'Dashboard', route: 'admin-dashboard', icon: <Package className="w-4 h-4" /> },
    { label: 'Packages', route: 'admin-packages', icon: <Package className="w-4 h-4" /> },
    { label: '5★ Lodges', route: 'admin-hotels', icon: <Hotel className="w-4 h-4" /> },
    { label: 'Festivals', route: 'admin-festivals', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Photo Gallery', route: 'admin-gallery', icon: <Image className="w-4 h-4" /> },
    { label: 'E-Brochures', route: 'admin-brochures', icon: <FileText className="w-4 h-4" /> },
    { label: 'Videos', route: 'admin-videos', icon: <Film className="w-4 h-4" /> },
    { label: 'Homepage', route: 'admin-homepage', icon: <Edit className="w-4 h-4" /> },
    { label: 'Inquiries', route: 'admin-contacts', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-amber-950 text-amber-100 border-b border-amber-900 px-3 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: User Info & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-amber-900/80 hover:bg-amber-800 text-amber-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle admin navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-300" /> : <Menu className="w-5 h-5 text-amber-300" />}
          </button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white p-1 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0">
            <img src={bhutanLogo} alt="Bhutan Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xs sm:text-sm text-amber-50 truncate max-w-[120px] sm:max-w-[200px]">
                {adminUser?.name || 'Dasho Tashi'}
              </span>
              <span className="text-[9px] bg-emerald-900 text-emerald-200 border border-emerald-700 px-1 py-0.2 rounded font-mono shrink-0">
                ADMIN
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-amber-400 truncate hidden xs:block">
              {adminUser?.role || 'Managing Director'}
            </p>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none py-1">
          {tabs.map(tab => {
            const isActive = currentRoute === tab.route;
            return (
              <button
                key={tab.route}
                onClick={() => navigate(tab.route)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-600 text-amber-950 font-bold shadow-xs'
                    : 'bg-amber-900/60 text-amber-200 hover:bg-amber-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => navigate('home')}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-850 text-amber-200 border border-amber-700 text-xs font-semibold flex items-center gap-1 cursor-pointer min-h-[44px]"
            title="View Public Site"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Public Site</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1 cursor-pointer min-h-[44px]"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-rose-300" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation for Admin */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-amber-900/80 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {tabs.map(tab => {
            const isActive = currentRoute === tab.route;
            return (
              <button
                key={tab.route}
                onClick={() => {
                  navigate(tab.route);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-amber-950 font-bold shadow-xs'
                    : 'bg-amber-900/60 text-amber-200 hover:bg-amber-800'
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


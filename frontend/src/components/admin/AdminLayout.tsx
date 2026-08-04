import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, FileText, Hotel, Edit, 
  MessageSquare, LogOut, Layers, Calendar, 
  Film, Image, Menu, X, ShieldAlert, ChevronRight
} from 'lucide-react';
import { ViewRoute } from '../../types';
import bhutanLogo from '../../assets/images/blht_logo.png';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface NavItem {
  label: string;
  route: ViewRoute;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { currentRoute, navigate, logoutAdmin, adminUser, packages, hotels, brochures, inquiries } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const navGroups: NavGroup[] = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', route: 'admin-dashboard' as ViewRoute, icon: <Package className="w-4 h-4" /> },
      ]
    },
    {
      group: 'Content Management (CRUD)',
      items: [
        { 
          label: 'Tour Packages', 
          route: 'admin-packages' as ViewRoute, 
          icon: <Package className="w-4 h-4" />,
          badge: packages.length
        },
        { 
          label: '5★ Lodges & Hotels', 
          route: 'admin-hotels' as ViewRoute, 
          icon: <Hotel className="w-4 h-4" />,
          badge: hotels.length
        },
        { 
          label: 'Festivals & Events', 
          route: 'admin-festivals' as ViewRoute, 
          icon: <Calendar className="w-4 h-4" />
        },
      ]
    },
    {
      group: 'Media Section (Gallery, E-Brochure & Video)',
      items: [
        { label: 'Photo Gallery', route: 'admin-gallery' as ViewRoute, icon: <Image className="w-4 h-4" /> },
        { 
          label: 'E-Brochures', 
          route: 'admin-brochures' as ViewRoute, 
          icon: <FileText className="w-4 h-4" />,
          badge: brochures.length
        },
        { label: 'Video Showcase', route: 'admin-videos' as ViewRoute, icon: <Film className="w-4 h-4" /> },
        { label: 'Homepage Editor', route: 'admin-homepage' as ViewRoute, icon: <Edit className="w-4 h-4" /> },
      ]
    },
    {
      group: 'Inquiries',
      items: [
        { 
          label: 'Customer Inquiries', 
          route: 'admin-contacts' as ViewRoute, 
          icon: <MessageSquare className="w-4 h-4" />,
          badge: newInquiriesCount > 0 ? `${newInquiriesCount} NEW` : inquiries.length,
          badgeColor: newInquiriesCount > 0 ? 'bg-rose-500 text-white' : undefined
        },
      ]
    }
  ];

  const handleNavClick = (route: ViewRoute) => {
    navigate(route);
    setMobileOpen(false);
  };

  const currentTab = navGroups.flatMap(g => g.items).find(i => i.route === currentRoute);

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#2b1d14] flex flex-col lg:flex-row antialiased selection:bg-[#d96b27] selection:text-white">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#170e08] text-amber-100 border-b border-[#3b2314] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-[#2d1b10] text-amber-300 hover:bg-[#3b2314] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-amber-900/50"
            aria-label="Toggle admin sidebar navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-amber-950 font-serif font-bold text-sm flex items-center justify-center shrink-0">
            𖤍
          </div>
          <div>
            <h1 className="font-serif font-bold text-xs text-amber-50 uppercase tracking-wider">Luxury Bhutan</h1>
            <p className="text-[10px] text-amber-400 font-sans">Admin Control Center</p>
          </div>
        </div>

        <button
          onClick={() => logoutAdmin()}
          className="p-2 rounded-lg bg-rose-950/80 text-rose-200 border border-rose-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-rose-300" />
          <span className="hidden xs:inline">Logout</span>
        </button>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex">
          <div className="bg-[#170e08] w-[280px] max-w-[85vw] h-full flex flex-col border-r border-[#3b2314] overflow-y-auto">
            
            {/* Mobile Drawer Top */}
            <div className="p-4 border-b border-[#3b2314] flex items-center justify-between bg-[#1f130b]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white p-1 border border-amber-400/40 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  <img src={bhutanLogo} alt="Bhutan Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-sm text-amber-50">Admin Panel</h2>
                  <p className="text-[10px] text-amber-400">Bhutan Luxury Tours</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-amber-400 hover:text-amber-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Drawer Nav Groups */}
            <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
              {navGroups.map((grp, gIdx) => (
                <div key={gIdx} className="space-y-1.5">
                  <p className="px-3 text-[10px] font-bold text-amber-500/80 uppercase tracking-widest font-mono">
                    {grp.group}
                  </p>
                  <div className="space-y-1">
                    {grp.items.map(item => {
                      const isActive = currentRoute === item.route;
                      return (
                        <button
                          key={item.route}
                          onClick={() => handleNavClick(item.route)}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer min-h-[44px] ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-sm'
                              : 'text-amber-200/80 hover:bg-[#2d1b10] hover:text-amber-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              item.badgeColor || (isActive ? 'bg-amber-950 text-amber-200' : 'bg-[#3b2314] text-amber-300')
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Drawer Bottom Logout */}
            <div className="p-3 border-t border-[#3b2314] bg-[#110a06]">
              <button
                onClick={() => logoutAdmin()}
                className="w-full px-3 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-900/80 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <LogOut className="w-4 h-4 text-rose-300" />
                <span>Logout from Admin</span>
              </button>
            </div>

          </div>

          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[260px] bg-[#170e08] text-amber-100 border-r border-[#3b2314] flex-col z-30 shadow-xl overflow-hidden">
        
        {/* Sidebar Header Brand */}
        <div className="p-5 border-b border-[#3b2314] bg-[#1f130b] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-amber-400/40 overflow-hidden flex items-center justify-center shrink-0 shadow-md">
            <img src={bhutanLogo} alt="Bhutan Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-amber-50 tracking-wider">LUXURY BHUTAN</h2>
            <p className="text-[10px] text-amber-400/90 font-mono tracking-tight uppercase">Admin Management Portal</p>
          </div>
        </div>



        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900/50">
          {navGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-amber-500/70 uppercase tracking-widest font-mono">
                {grp.group}
              </p>
              <div className="space-y-0.5">
                {grp.items.map(item => {
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      onClick={() => navigate(item.route)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-sm'
                          : 'text-amber-200/80 hover:bg-[#28180e] hover:text-amber-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.badgeColor || (isActive ? 'bg-amber-950 text-amber-200' : 'bg-[#2f1b0e] text-amber-300 border border-amber-900/60')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-3 border-t border-[#3b2314] bg-[#110a06]">
          <button
            onClick={() => logoutAdmin()}
            className="w-full px-3 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-900/60 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-300" />
            <span>Logout Administrator</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        
        {/* Top Breadcrumb & Page Action Header */}
        <header className="bg-white border-b border-amber-200/80 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <span>Admin Portal</span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span className="text-amber-900 font-semibold">{currentTab?.label || 'Management'}</span>
            </div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-amber-950 mt-0.5">
              {title || currentTab?.label || 'Dashboard'}
            </h1>
            {subtitle && (
              <p className="text-stone-500 text-xs mt-0.5">{subtitle}</p>
            )}
          </div>
        </header>

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};

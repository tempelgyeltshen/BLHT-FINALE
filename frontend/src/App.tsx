import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import AdminRoutes from './components/admin/AdminRoutes';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/public/HomeView';
import { AboutView } from './components/public/AboutView';
import { LuxuryView } from './components/public/LuxuryView';
import { AdventuresView } from './components/public/AdventuresView';
import { FestivalsView } from './components/public/FestivalsView';
import { HotelsView } from './components/public/HotelsView';
import { BrochuresView } from './components/public/BrochuresView';
import { VideosView } from './components/public/VideosView';
import { GalleryView } from './components/public/GalleryView';
import { ContentShowcaseView } from './components/public/ContentShowcaseView';
import { SearchView } from './components/public/SearchView';
import { ContactView } from './components/public/ContactView';
import { PrivacyTermsView } from './components/public/PrivacyTermsView';
import { PackageDetailPage } from './components/package/PackageDetailPage';
import { HotelDetailPage } from './components/hotel/HotelDetailPage';

import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminPackagesView } from './components/admin/AdminPackagesView';
import { AdminBrochuresView } from './components/admin/AdminBrochuresView';
import { AdminHotelsView } from './components/admin/AdminHotelsView';
import { AdminContactsView } from './components/admin/AdminContactsView';
import { AdminHomepageView } from './components/admin/AdminHomepageView';
import { AdminVideosView } from './components/admin/AdminVideosView';
import { AdminGalleryView } from './components/admin/AdminGalleryView';
import { AdminFestivalsView } from './components/admin/AdminFestivalsView';

import { PdfViewerModal } from './components/brochure/PdfViewerModal';
import { Toast } from './components/common/Toast';
import { PageLoader } from './components/common/PageLoader';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();
  const { loading, isAuthenticated, isAdmin } = useAuth();

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAdminRoute = isAdminPath || currentRoute.startsWith('admin');

  const renderView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'about':
        return <AboutView />;
      case 'luxury':
        return <LuxuryView />;
      case 'package-detail':
        return <PackageDetailPage />;
      case 'adventures':
        return <AdventuresView />;
      case 'festivals':
        return <FestivalsView />;
      case 'hotels':
        return <HotelsView />;
      case 'hotel-detail':
        return <HotelDetailPage />;
      case 'brochures':
        return <BrochuresView />;
      case 'brochure-viewer':
        return <PdfViewerModal />;
      case 'videos':
        return <VideosView />;
      case 'gallery':
        return <GalleryView />;
      case 'showcase':
        return <ContentShowcaseView />;
      case 'search':
        return <SearchView />;
      case 'contact':
        return <ContactView />;
      case 'privacy':
      case 'terms':
      case 'privacy-terms':
        return <PrivacyTermsView />;

      // Admin Routes
      case 'admin-login':
        return <AdminLoginView />;
      case 'admin-dashboard':
        return isAuthenticated && isAdmin ? <AdminDashboardView /> : <AdminLoginView />;
      case 'admin-packages':
      case 'admin-categories':
        return isAuthenticated && isAdmin ? <AdminPackagesView /> : <AdminLoginView />;
      case 'admin-festivals':
        return isAuthenticated && isAdmin ? <AdminFestivalsView /> : <AdminLoginView />;
      case 'admin-brochures':
        return isAuthenticated && isAdmin ? <AdminBrochuresView /> : <AdminLoginView />;
      case 'admin-brochure-viewer':
        return isAuthenticated && isAdmin ? <PdfViewerModal /> : <AdminLoginView />;
      case 'admin-hotels':
        return isAuthenticated && isAdmin ? <AdminHotelsView /> : <AdminLoginView />;
      case 'admin-contacts':
        return isAuthenticated && isAdmin ? <AdminContactsView /> : <AdminLoginView />;
      case 'admin-videos':
        return isAuthenticated && isAdmin ? <AdminVideosView /> : <AdminLoginView />;
      case 'admin-gallery':
        return isAuthenticated && isAdmin ? <AdminGalleryView /> : <AdminLoginView />;
      case 'admin-homepage':
        return isAuthenticated && isAdmin ? <AdminHomepageView /> : <AdminLoginView />;

      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#2b1d14] flex flex-col font-sans antialiased selection:bg-[#d96b27] selection:text-white">
      <PageLoader />
      {!isAdminRoute && <Navbar />}

      <main className="flex-1 overflow-x-hidden">
        {isAdminPath ? (
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        ) : isAdminRoute ? (
          <Routes>
            <Route path="*" element={renderView()} />
          </Routes>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes>
                <Route path="/hotels/:slug" element={<HotelDetailPage />} />
                <Route path="/hotels/id/:id" element={<HotelDetailPage />} />
                <Route path="*" element={renderView()} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {!isAdminRoute && <Footer />}

      {/* Global Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

import React, { useEffect } from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { PublicRoutes } from './PublicRoutes';
import { AdminRoutes } from './AdminRoutes';
import { analyticsService } from '../../../lib/services/analytics.service';

// Shared layout / feedback components
import { PageLoader } from '../../features/shared/components/layout/PageLoader';
import { Toast } from '../../features/shared/components/feedback/Toast';

/**
 * Root route table. Public pages are rendered inside the MainLayout
 * (Navbar + Footer) via PublicRoutes(), while admin pages render through
 * AdminRoutes(). Both are invoked as plain functions so that every child of
 * <Routes> is a <Route> element (React Router rejects custom components as
 * direct children of <Routes>).
 */
export const AppRoutes: React.FC = () => {
  const location = useLocation();

  // Track every route change for the analytics service.
  useEffect(() => {
    analyticsService.trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#2b1d14] flex flex-col font-sans antialiased selection:bg-[#d96b27] selection:text-white">
      <PageLoader />

      <Routes>
        {PublicRoutes()}
        {AdminRoutes()}
      </Routes>

      <Toast />
    </div>
  );
};

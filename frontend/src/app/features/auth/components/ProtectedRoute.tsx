import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Generic route guard for authenticated (and optionally admin-only) pages.
 *
 * - Shows a loading state while the session is being verified.
 * - Redirects unauthenticated visitors to `redirectTo` (defaults to the
 *   admin login page), remembering where they came from.
 * - When `requireAdmin` is set, non-admin users are sent back home.
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Require the user to have the `admin` role. */
  requireAdmin?: boolean;
  /** Where unauthenticated visitors are sent. Defaults to /admin/login. */
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  redirectTo = '/admin/login',
}) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf8f2] text-[#2b1d14]">
        <div className="animate-pulse rounded-xl bg-[#f3e8d6] px-6 py-4 text-sm font-semibold text-[#7c5c3b] shadow-sm">
          Verifying administrator access...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

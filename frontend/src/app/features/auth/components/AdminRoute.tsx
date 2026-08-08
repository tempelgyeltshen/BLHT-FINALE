import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Admin-only route guard: requires an authenticated admin session.
 * Delegates to the generic `ProtectedRoute` with `requireAdmin` enabled.
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
};

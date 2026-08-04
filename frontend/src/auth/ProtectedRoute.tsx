import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PageLoader } from "../components/common/PageLoader";
import { useAuth } from "../auth/useAuth";


interface ProtectedRouteProps {
  children: React.ReactNode;
}


export default function ProtectedRoute({
  children
}: ProtectedRouteProps) {

  const location = useLocation();

  const {
    isAuthenticated,
    isAdmin,
    loading
  } = useAuth();


  // Wait for /api/auth/me check
  if (loading) {
    return <PageLoader />;
  }


  // Not logged in
  if (!isAuthenticated) {

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );

  }


  // Logged in but not admin
  if (!isAdmin) {

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );

  }


  return children;

}
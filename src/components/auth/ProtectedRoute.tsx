import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AuthRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allow: AuthRole[];
  children: React.ReactNode;
}

/** Gates a route to logged-in, approved accounts whose role is in `allow`. */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allow, children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allow.includes(user.role)) {
    const homeByRole: Record<AuthRole, string> = { reviewer: '/reviewer', brand: '/brand', admin: '/admin' };
    return <Navigate to={homeByRole[user.role]} replace />;
  }

  return <>{children}</>;
};

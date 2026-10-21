import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl max-w-md mx-auto my-12">
        <h2 className="text-xl font-bold text-rose-800">Access Denied</h2>
        <p className="text-sm text-rose-600 mt-2">
          Your account role ({user.role}) is not authorized to view this page.
        </p>
      </div>
    );
  }

  return <Outlet />;
};
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!user || user.role !== 'admin') {
    // Regular users trying to access admin dashboard get booted to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

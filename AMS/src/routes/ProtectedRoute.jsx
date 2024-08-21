import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../Services/authservice';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
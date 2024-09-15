import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import authservice from '../../services/authservice';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authservice.getCurrentUser();

  useEffect(() => {
    if (location.pathname === '/logout') {
      authservice.logout();
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.userType)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
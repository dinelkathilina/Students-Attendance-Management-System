import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authservice from '../services/authservice';

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authservice.logout();
    navigate('/');
  }, [navigate]);

  return <div>Logging out...</div>;
};
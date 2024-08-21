import axios from 'axios';

const API_URL = 'https://localhost:7243'; // Your ASP.NET Core app's URL

export const login = async (email, password, rememberMe) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
    rememberMe
  });
  return response.data;
};

export const register = async (name, email, password, confirmPassword) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    confirmPassword
  });
  return response.data;
};

axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
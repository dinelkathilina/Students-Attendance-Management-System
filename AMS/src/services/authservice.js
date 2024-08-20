import axios from 'axios';

const API_URL = 'https://localhost:7243'; 

const authService = {

    login: async (email, password, rememberMe) => {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        rememberMe
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    },
  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.status === 401) {
          // Token might be expired, logout the user
          authService.logout();
        }
        return null;
      }
    }
    return null;
  },
  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Add more auth-related functions as needed
};

export default authService;
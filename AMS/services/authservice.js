import axios from 'axios';

const API_URL = 'https://ams-bmanedabbnb8gxdd.southeastasia-01.azurewebsites.net'; 
 //const API_URL = 'https://localhost:7243'; 

const authservice = {

  login: async (email, password, rememberMe) => {
    try {
      console.log('Sending login request with payload:', { email, rememberMe, passwordProvided: !!password });
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        rememberMe
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    );
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response',
        request: error.request ? {
          method: error.request.method,
          url: error.request.url,
          headers: error.request.headers
        } : 'No request'
      });
      throw error;
    }
  },

   /* login: async (email, password, rememberMe) => {
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
    },*/
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
          authservice.logout();
        }
        return null;
      }
    }
    return null;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  register: async (name, email, password, confirmPassword) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getLecturerCourses: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/api/session/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lecturer courses:', error);
      throw error;
    }
  },

  getLectureHalls: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/api/session/lecture-halls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lecture halls:', error);
      throw error;
    }
  },
  getLecturerCoursesTime: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/api/lecturer/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lecturer courses:', error);
      throw error;
    }
  },

  createSession: async (sessionData) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.post(`${API_URL}/api/session/create`, sessionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  checkInToSession: async (sessionCode) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No authentication token found");
  
    try {
      const response = await axios.post(`${API_URL}/api/attendance/check-in`, 
        { sessionCode }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error.response || error);
      if (error.response && error.response.data) {
        throw new Error(typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  // Add more auth-related functions as needed
};

export default authservice;
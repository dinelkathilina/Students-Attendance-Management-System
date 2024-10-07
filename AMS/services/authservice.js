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

  checkIn: async (sessionCode) => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const response = await axios.post(`${API_URL}/api/attendance/check-in`, 
        { sessionCode },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  },

  getCheckedInStudents: async (sessionCode) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/api/session/checked-in-students/${sessionCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching checked-in students:', error);
      throw error;
    }
  },


  //manage courses
  getLecturerCourses: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/api/manage-courses/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lecturer courses:', error);
      throw error;
    }
  },

  createCourse: async (courseData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await axios.post(`${API_URL}/api/manage-courses/courses`, courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Return the response data
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  },

  updateCourse: async (courseId, courseData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await axios.put(`${API_URL}/api/manage-courses/courses/${courseId}`, courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Return the response data
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  },
  deleteCourse: async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const response = await axios.delete(`${API_URL}/api/manage-courses/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      throw error;
    }
  },

 

  getAttendanceReport: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const response = await axios.get(`${API_URL}/api/attendance-report`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance report:', error);
      throw error;
    }
  },





  getActiveSession: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const response = await axios.get(`${API_URL}/api/session/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No active session found');
        return null;
      }
      console.error('Error fetching active session:', error);
      throw error;
    }
  },

  endSession: async (sessionId) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      await axios.post(`${API_URL}/api/session/end/${sessionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  },

  getCourseTime: async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const response = await axios.get(`${API_URL}/api/session/course-times/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course time:', error);
      return null;
    }
  },


};

export default authservice;
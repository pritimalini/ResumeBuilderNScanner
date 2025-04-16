import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized) by logging out
    if (error.response && error.response.status === 401) {
      // Clear auth token and redirect to login (except if already on login page)
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
  },
  
  getCurrentUser: async () => {
    return api.get('/api/users/profile');
  },
  
  updateProfile: async (userData) => {
    return api.put('/api/users/profile', userData);
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('authToken') ? true : false;
  }
};

// Resume services
export const resumeService = {
  getAllResumes: async () => {
    return api.get('/api/resumes');
  },
  
  getResumeById: async (id) => {
    return api.get(`/api/resumes/${id}`);
  },
  
  createResume: async (resumeData) => {
    return api.post('/api/resumes', resumeData);
  },
  
  updateResume: async (id, resumeData) => {
    return api.put(`/api/resumes/${id}`, resumeData);
  },
  
  deleteResume: async (id) => {
    return api.delete(`/api/resumes/${id}`);
  },
  
  uploadResume: async (formData) => {
    return api.post('/api/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Analysis services
export const analysisService = {
  submitForAnalysis: async (data) => {
    return api.post('/api/analysis', data);
  },
  
  getAllAnalyses: async () => {
    return api.get('/api/analysis');
  },
  
  getAnalysisById: async (id) => {
    return api.get(`/api/analysis/${id}`);
  },
  
  deleteAnalysis: async (id) => {
    return api.delete(`/api/analysis/${id}`);
  }
};

export default api; 
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Resume Scanner API
export const resumeApi = {
  // Upload resume
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/api/analyze-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Process job description
  processJobDescription: async (description: string, title?: string, company?: string, url?: string) => {
    return api.post('/api/process-job-description', {
      description,
      title,
      company,
      url,
    });
  },
  
  // Calculate score
  calculateScore: async (resumeId: string, jobId: string) => {
    const formData = new FormData();
    formData.append('resume_id', resumeId);
    formData.append('job_id', jobId);
    
    return api.post('/api/calculate-score', formData);
  },
  
  // Get recommendations
  getRecommendations: async (resumeId: string, jobId: string) => {
    const formData = new FormData();
    formData.append('resume_id', resumeId);
    formData.append('job_id', jobId);
    
    return api.post('/api/get-recommendations', formData);
  },
};

// Resume Builder API
export const builderApi = {
  // Build resume
  buildResume: async (resumeData: any) => {
    return api.post('/api/build-resume', resumeData);
  },
  
  // Get resume templates
  getTemplates: async () => {
    return api.get('/api/templates');
  },
  
  // Download resume
  downloadResume: (resumeId: string, format: string) => {
    return `${api.defaults.baseURL}/api/download/resume/${resumeId}/${format}`;
  },
};

// Settings API
export const settingsApi = {
  // Get LLM settings
  getLLMSettings: async () => {
    return api.get('/api/settings/llm-settings');
  },
  
  // Update LLM settings
  updateLLMSettings: async (settings: {
    provider: string;
    model: string;
    temperature: number;
    api_key?: string;
  }) => {
    return api.post('/api/settings/llm-settings', settings);
  },
};

export default api;

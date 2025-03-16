import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const applicationService = {
  getApplication: async () => {
    const response = await api.get('/api/student/application');
    return response.data;
  },
  createApplication: async (applicationData: any) => {
    const response = await api.post('/api/student/application', applicationData);
    return response.data;
  },
  updateApplication: async (applicationData: any) => {
    const response = await api.patch('/api/student/application', applicationData);
    return response.data;
  },
  submitApplication: async () => {
    const response = await api.post('/api/student/submit-application');
    return response.data;
  },
  uploadDocument: async (documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const documentService = {
  analyzeDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await api.post('/api/documents/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  analyzeDocumentUrl: async (documentUrl: string) => {
    const response = await api.post('/api/documents/analyze-url', { documentUrl });
    return response.data;
  },
  testAzureAI: async () => {
    const response = await api.get('/api/documents/test-azure-ai');
    return response.data;
  },
};

export const adminService = {
  getAllApplications: async () => {
    const response = await api.get('/api/admin/applications');
    return response.data;
  },
  reviewApplication: async (applicationId: string, decision: string, remarks: string) => {
    const response = await api.post(`/api/admin/applications/${applicationId}/review`, {
      decision,
      remarks,
    });
    return response.data;
  },
  verifyDocument: async (applicationId: string, documentId: string, status: string) => {
    const response = await api.patch(`/api/admin/applications/${applicationId}/documents/${documentId}`, {
      status,
    });
    return response.data;
  },
}; 
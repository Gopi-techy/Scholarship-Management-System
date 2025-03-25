import api from '../utils/api';

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  scholarshipId: string;
  scholarshipName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  documents: string[];
  academicDetails: {
    gpa: number;
    currentYear: number;
    major: string;
  };
}

const applicationService = {
  getApplications: async (): Promise<Application[]> => {
    const response = await api.get('/applications');
    return response.data;
  },

  getApplication: async (id: string): Promise<Application> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  getStudentApplications: async (studentId: string): Promise<Application[]> => {
    const response = await api.get(`/applications/student/${studentId}`);
    return response.data;
  },

  createApplication: async (data: Omit<Application, 'id' | 'submittedAt' | 'updatedAt'>): Promise<Application> => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  updateApplicationStatus: async (id: string, status: Application['status']): Promise<Application> => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  },

  deleteApplication: async (id: string): Promise<void> => {
    await api.delete(`/applications/${id}`);
  },
};

export { applicationService }; 
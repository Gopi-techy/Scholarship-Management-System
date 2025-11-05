import api from '../utils/api';

export interface Application {
  id: string;
  userId: string;
  scholarshipId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  documents?: string[];
  notes?: string;
}

const applicationService = {
  // Get all applications
  getApplications: async (): Promise<Application[]> => {
    const response = await api.get<Application[]>('/applications');
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id: string): Promise<Application> => {
    const response = await api.get<Application>(`/applications/${id}`);
    return response.data;
  },

  // Create new application
  createApplication: async (data: Partial<Application>): Promise<Application> => {
    const response = await api.post<Application>('/applications', data);
    return response.data;
  },

  // Submit application
  submitApplication: async (id: string): Promise<Application> => {
    const response = await api.post<Application>(`/applications/${id}/submit`);
    return response.data;
  },

  // Update application status (admin only)
  updateApplicationStatus: async (
    id: string,
    status: Application['status']
  ): Promise<Application> => {
    const response = await api.put<Application>(`/applications/${id}/status`, { status });
    return response.data;
  },

  // Review application (admin only)
  reviewApplication: async (
    id: string,
    data: { status: Application['status']; notes?: string }
  ): Promise<Application> => {
    const response = await api.post<Application>(`/applications/${id}/review`, data);
    return response.data;
  },

  // Add comment to application
  addComment: async (id: string, comment: string): Promise<Application> => {
    const response = await api.post<Application>(`/applications/${id}/comments`, { comment });
    return response.data;
  },

  // Get user's applications
  getUserApplications: async (): Promise<Application[]> => {
    const response = await api.get<Application[]>('/applications/user');
    return response.data;
  },
};

export default applicationService;

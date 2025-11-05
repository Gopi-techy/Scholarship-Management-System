import api from '../utils/api';

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  requirements: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

const scholarshipService = {
  // Get all scholarships
  getAllScholarships: async (): Promise<Scholarship[]> => {
    const response = await api.get<Scholarship[]>('/scholarships');
    return response.data;
  },

  // Get a single scholarship
  getScholarship: async (id: string): Promise<Scholarship> => {
    const response = await api.get<Scholarship>(`/scholarships/${id}`);
    return response.data;
  },

  // Create a new scholarship (admin only)
  createScholarship: async (data: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scholarship> => {
    const response = await api.post<Scholarship>('/scholarships', data);
    return response.data;
  },

  // Update a scholarship (admin only)
  updateScholarship: async (id: string, data: Partial<Scholarship>): Promise<Scholarship> => {
    const response = await api.put<Scholarship>(`/scholarships/${id}`, data);
    return response.data;
  },

  // Delete a scholarship (admin only)
  deleteScholarship: async (id: string): Promise<void> => {
    await api.delete(`/scholarships/${id}`);
  },

  // Apply for a scholarship
  applyForScholarship: async (scholarshipId: string, documents: string[]): Promise<ScholarshipApplication> => {
    const response = await api.post<ScholarshipApplication>('/applications', {
      scholarshipId,
      documents,
    });
    return response.data;
  },

  // Get user's applications
  getUserApplications: async (): Promise<ScholarshipApplication[]> => {
    const response = await api.get<ScholarshipApplication[]>('/applications/user');
    return response.data;
  },

  // Get all applications (admin only)
  getAllApplications: async (): Promise<ScholarshipApplication[]> => {
    const response = await api.get<ScholarshipApplication[]>('/applications');
    return response.data;
  },

  // Update application status (admin only)
  updateApplicationStatus: async (
    id: string,
    status: ScholarshipApplication['status']
  ): Promise<ScholarshipApplication> => {
    const response = await api.put<ScholarshipApplication>(`/applications/${id}/status`, { status });
    return response.data;
  },
};

export default scholarshipService; 
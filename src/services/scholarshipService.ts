import api from '../utils/api';

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  requirements: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const scholarshipService = {
  getScholarships: async (): Promise<Scholarship[]> => {
    const response = await api.get('/scholarships');
    return response.data;
  },

  getScholarship: async (id: string): Promise<Scholarship> => {
    const response = await api.get(`/scholarships/${id}`);
    return response.data;
  },

  createScholarship: async (data: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scholarship> => {
    const response = await api.post('/scholarships', data);
    return response.data;
  },

  updateScholarship: async (id: string, data: Partial<Scholarship>): Promise<Scholarship> => {
    const response = await api.put(`/scholarships/${id}`, data);
    return response.data;
  },

  deleteScholarship: async (id: string): Promise<void> => {
    await api.delete(`/scholarships/${id}`);
  },
};

export { scholarshipService }; 
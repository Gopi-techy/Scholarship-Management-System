import api from '../utils/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
  };
}

const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  updateProfile: async (id: string, data: Partial<User['profile']>): Promise<User> => {
    const response = await api.put(`/users/${id}/profile`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export { userService }; 
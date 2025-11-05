import api from '../utils/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    phone?: string;
    address?: string;
    education?: string;
    institution?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User['profile']>): Promise<User> => {
    const response = await api.put<User>('/users/profile', data);
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // Get user by ID (admin only)
  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await api.put<User>(`/users/${id}/role`, { role });
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

export default userService; 
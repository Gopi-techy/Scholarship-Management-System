import api from './api';

export interface Document {
  id: string;
  userId: string;
  type: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const documentService = {
  // Upload a document
  uploadDocument: async (file: File, type: string): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's documents
  getUserDocuments: async (): Promise<Document[]> => {
    const response = await api.get<Document[]>('/documents/user');
    return response.data;
  },

  // Get all documents (admin only)
  getAllDocuments: async (): Promise<Document[]> => {
    const response = await api.get<Document[]>('/documents');
    return response.data;
  },

  // Update document status (admin only)
  updateDocumentStatus: async (
    id: string,
    status: Document['status']
  ): Promise<Document> => {
    const response = await api.put<Document>(`/documents/${id}/status`, { status });
    return response.data;
  },

  // Delete a document
  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  // Get document by ID
  getDocument: async (id: string): Promise<Document> => {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
  },
};

export default documentService; 
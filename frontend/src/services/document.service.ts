import api from '../utils/api';

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
  uploadDocument: async (formData: FormData): Promise<Document> => {
    const response = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's documents
  getUserDocuments: async (): Promise<Document[]> => {
    const response = await api.get<Document[]>('/documents');
    return response.data;
  },

  // Get documents with query params
  getDocuments: async (query?: string): Promise<Document[]> => {
    const response = await api.get<Document[]>(`/documents${query ? `?${query}` : ''}`);
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

  // Analyze document (for Azure AI)
  analyzeDocument: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/documents/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Analyze document from URL
  analyzeDocumentUrl: async (url: string): Promise<any> => {
    const response = await api.post('/documents/analyze-url', { url });
    return response.data;
  },
};

export default documentService; 
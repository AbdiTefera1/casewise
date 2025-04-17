// lib/api/documents.ts
import api from './config';

export enum DocumentCategory {
  PLEADING = 'PLEADING',
  COURT_ORDER = 'COURT_ORDER',
  CONTRACT = 'CONTRACT',
  EVIDENCE = 'EVIDENCE',
  CORRESPONDENCE = 'CORRESPONDENCE',
  BILLING = 'BILLING',
  OTHER = 'OTHER'
}
// export enum DocumentCategory {
//   LEGAL_BRIEF = 'LEGAL_BRIEF',
//   COURT_ORDER = 'COURT_ORDER',
//   CONTRACT = 'CONTRACT',
//   EVIDENCE = 'EVIDENCE',
//   CORRESPONDENCE = 'CORRESPONDENCE',
//   BILLING = 'BILLING',
//   OTHER = 'OTHER'
// }

export interface Document {
  id: string;
  title: string;
  description?: string;
  downloadUrl: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: number;
  fileType: string;
  storagePath: string;
  storageUrl: string;
  caseId: string;
  uploadedById: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  case: {
    id: string;
    title: string;
    caseNumber: string;
  };
  uploadedBy: {
    id: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
  };
}

export interface DocumentUploadData {
  file: File;
  title: string;
  description?: string;
  category: DocumentCategory;
  caseId: string;
  organizationId: string;
}

const CASES_ENDPOINT = '/documents';

export const documentApi = {
  uploadDocument: async (data: DocumentUploadData) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('caseId', data.caseId);
    formData.append('organizationId', data.organizationId);

    const { data: response } = await api.post<Document>(CASES_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  getDocuments: async (params?: {
    page?: number;
    limit?: number;
    category?: DocumentCategory;
    organizationId?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }) => {
    const { data } = await api.get<{
      documents: Document[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
  }
      total: number;
      page: number;
      limit: number;
    }>(CASES_ENDPOINT, { params });
    return data;
  },

  getDocument: async (id: string) => {
    const { data } = await api.get<{document: Document}>(`${CASES_ENDPOINT}/${id}`);
    return data;
  },

  getCaseDocuments: async (caseId: string, params?: {
    page?: number;
    limit?: number;
    category?: DocumentCategory;
  }) => {
    const { data } = await api.get<{
      documents: Document[];
      total: number;
    }>(`${CASES_ENDPOINT}/case/${caseId}`, { params });
    return data;
  },

  downloadDocument: async (filePath: string) => {
    const response = await api.get<Blob>(`${CASES_ENDPOINT}/download/${filePath}`, {
      responseType: 'blob', // Ensure the response is treated as a file
    });

    if (!response) {
      throw new Error('Download failed');
    }

    return response;
  },

  deleteDocument: async (id: string) => {
    await api.delete(`${CASES_ENDPOINT}/${id}`);
  },
};



/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/cases.ts
import api from '@/lib/api/config';
import { CasePriority } from '@prisma/client';

// Types
export enum CaseStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export interface Case {
  id: string;
  organizationId: string;
  clientId?: string;
  lawyerId: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  caseNumber: string;
  startDate?: Date;
  endDate?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  client?: {
    id: string;
    name: string;
    email: string;
  };
  lawyer: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateCaseData {
  clientId?: string;
  lawyerId: string;
  title: string;
  description: string;
  status: CaseStatus;
  caseNumber: string;
  startDate?: Date;
}

interface UpdateCaseData {
  clientId?: string;
  lawyerId?: string;
  title?: string;
  description?: string;
  status?: CaseStatus;
  endDate?: Date;
}

interface CaseListResponse {
  cases: Case[]; // Replace `any` with your actual `Case` type.
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};



// API endpoints
const CASES_ENDPOINT = '/cases';

// API functions
export const casesApi = {
  create: (data: CreateCaseData) => 
    api.post<Case>(CASES_ENDPOINT, data),

  getAll: async (params?: Record<string, any>): Promise<CaseListResponse> => {
    const response = await api.get<CaseListResponse>(CASES_ENDPOINT, { params });
    return response.data;
  },

  getById: (id: string) => 
    api.get<Case>(`${CASES_ENDPOINT}/${id}`),

  update: (id: string, data: UpdateCaseData) => 
    api.patch<Case>(`${CASES_ENDPOINT}/${id}`, data),

  delete: (id: string) => 
    api.delete(`${CASES_ENDPOINT}/${id}`),

  getByStatus: (status: CaseStatus, params?: {
    page?: number;
    limit?: number;
  }) => api.get<CaseListResponse>(`${CASES_ENDPOINT}/status/${status}`, { params }),

  getArchived: (params?: {
    page?: number;
    limit?: number;
  }) => api.get<CaseListResponse>(`${CASES_ENDPOINT}/archived`, { params }),
};

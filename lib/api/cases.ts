// lib/api/cases.ts
import api from '@/lib/api/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export interface CaseListResponse {
  cases: Case[];
  total: number;
  pages: number;
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

// API endpoints
const CASES_ENDPOINT = '/cases';

// API functions
const casesApi = {
  create: (data: CreateCaseData) => 
    api.post<Case>(CASES_ENDPOINT, data),

  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: CaseStatus;
    startDate?: Date;
    endDate?: Date;
    lawyerId?: string;
    clientId?: string;
  }) => api.get<CaseListResponse>(CASES_ENDPOINT, { params }),

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

// React Query Hooks
export const useCases = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: CaseStatus;
  startDate?: Date;
  endDate?: Date;
  lawyerId?: string;
  clientId?: string;
}) => {
  return useQuery({
    queryKey: ['cases', params],
    queryFn: () => casesApi.getAll(params),
  });
};

export const useCase = (id: string) => {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: () => casesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: casesApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.setQueryData(['cases', data], data);
    },
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateCaseData & { id: string }) =>
      casesApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.setQueryData(['cases', data], data);
    },
  });
};

export const useDeleteCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: casesApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.removeQueries({ queryKey: ['cases', deletedId] });
    },
  });
};

export const useCasesByStatus = (status: CaseStatus, params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['cases', 'status', status, params],
    queryFn: () => casesApi.getByStatus(status, params),
  });
};

export const useArchivedCases = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['cases', 'archived', params],
    queryFn: () => casesApi.getArchived(params),
  });
};
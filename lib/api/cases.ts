/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/cases.ts
import api from '@/lib/api/config';
// import { CasePriority } from '@prisma/client';

// Types
export enum CaseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum CasePriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  URGENT = "URGENT"
}


export interface Case {
  id: string;
  organizationId: string;
  clientId: string;
  lawyerId: string;
  title: string;
  description: string;
  judge: string | null;
  caseType: string;
  caseSubType: string;
  stageOfCase: string;
  filingNumber: string;
  filingDate: Date;
  act: string;
  firstHearingDate: Date;
  nextHearingDate: Date | null;
  policeStation: string;
  firNumber: string;
  firDate: Date;
  transferDate: Date | null;
  fromCourt: string | null;
  toCourt: string | null;
  status: string;
  priority: string;
  caseNumber: string;
  startDate: Date;
  endDate: Date;
  lawyer: {
    id: string;
    email: string;
    name: string;
  };
  courts: {
    id: string;
    organizationId: string | null;
    caseId: string;
    courtNo: string;
    courtType: string;
    court: string;
    judgeType: string;
    judgeName: string;
    remarks: string;
  }[];
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Court {
  courtNo: string;
  courtType: string;
  court: string;
  judgeType: string;
  judgeName: string;
  remarks: string;
}

export interface CaseFormData {
  title: string;
  description: string;
  clientId: string;
  caseType: string;
  caseSubType: string;
  stageOfCase: string;
  filingNumber: string;
  filingDate: string;
  act: string;
  firstHearingDate: string;
  policeStation: string;
  firNumber: string;
  firDate: string;
  status: 'ACTIVE' | 'PENDING' | 'ARCHIVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'URGENT';
  startDate: string;
  endDate?: string | null;
  courts: Court[];
  assignedToId: string;
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
  create: (data: CaseFormData) => 
    api.post<Case>(CASES_ENDPOINT, data),

  getAll: async (params?: Record<string, any>): Promise<CaseListResponse> => {
    const response = await api.get<CaseListResponse>(CASES_ENDPOINT, { params });
    return response.data;
  },

  getById: (id: string) => 
    api.get<Case>(`${CASES_ENDPOINT}/${id}`),

  update: (id: string, data: CaseFormData) => 
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

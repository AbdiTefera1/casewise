/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/cases.ts
import api from '@/lib/api/config';
// import { CasePriority } from '@prisma/client';

// Types
export enum CaseStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
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
    firstName: string;
    email: string;
  };
  lawyer: {
    id: string;
    name: string;
    email: string;
  };
  court: {
    id: string;
    courtNo: string;
    courtType: string;
    court: string;
    judgeType: string;
    judgeName: string;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
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
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  startDate: string;
  endDate?: string | null;
  courts: Court[];
  assignedToId: string;
}

// export interface CreateCaseData {
//   // Client Details
//   clientId?: string;

//   // Lawyer Details
//   lawyerId?: string;

//   // Case Details
//   title: string;
//   description: string;
//   caseType: string;
//   caseSubType: string;
//   stageOfCase: string;
//   filingNumber: string;
//   filingDate: Date;
//   act: string;
//   firstHearingDate?: Date;
//   nextHearingDate?: Date;
//   policeStation: string;
//   firNumber: string;
//   firDate: Date;
//   status: CaseStatus;
//   priority?: CasePriority;
//   caseNumber: string;
//   startDate?: Date;
//   endDate?: Date;

//   // Court Details (Many-to-Many Relationship)
//   court: {
//     courtNo: string;
//     courtType: string;
//     court: string;
//     judgeType: string;
//     judgeName: string;
//     remarks: string;
//   }[];
// }

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

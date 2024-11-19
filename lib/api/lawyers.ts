// lib/api/lawyers.ts
import api from './config';

export interface LawyerCreateData {
  email: string;
  password: string;
  name: string;
  specializations: string[];
  barNumber: string;
  licenseStatus: string;
  jurisdictions: string[];
  hourlyRate: number;
  contactInfo: {
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  availability: {
    workDays: string[];
    workHours: {
      start: string;
      end: string;
    };
    exceptions?: {
      date: string;
      available: boolean;
    }[];
  };
}

export interface Lawyer {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  specializations: string[];
  barNumber: string;
  licenseStatus: string;
  jurisdictions: string[];
  hourlyRate: number;
  contactInfo: LawyerCreateData['contactInfo'];
  availability: LawyerCreateData['availability'];
  status: string;
}

export const lawyerApi = {
  createLawyer: async (data: LawyerCreateData) => {
    const { data: response } = await api.post<Lawyer>('/api/lawyers', data);
    return response;
  },

  getLawyers: async (params?: {
    page?: number;
    limit?: number;
    organizationId?: string;
    specialization?: string;
    status?: string;
  }) => {
    const { data } = await api.get<{
      lawyers: Lawyer[];
      total: number;
      page: number;
      limit: number;
    }>('/api/lawyers', { params });
    return data;
  },

  getLawyer: async (id: string) => {
    const { data } = await api.get<Lawyer>(`/api/lawyers/${id}`);
    return data;
  },

  updateLawyer: async (id: string, data: Partial<Omit<LawyerCreateData, 'email' | 'password'>>) => {
    const { data: response } = await api.patch<Lawyer>(`/api/lawyers/${id}`, data);
    return response;
  },

  deleteLawyer: async (id: string) => {
    await api.delete(`/api/lawyers/${id}`);
  },
};

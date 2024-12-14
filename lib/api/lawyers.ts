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
  organizationId: string;
  name: string;
  email: string;
  role: 'LAWYER';
  avator: string | null; // Assuming this is a typo and should be 'avatar'
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt?: string | null; // Optional field
  lawyerDetails: {
      id: string;
      userId: string;
      specializations: string[];
      barNumber: string;
      licenseStatus: 'Active' | 'Inactive'; // Assuming these are the only statuses
      jurisdictions: {
          regions: string[];
          countries: string[];
      };
      hourlyRate: number;
      contactInfo: {
          email: string;
          phone: string;
          address: {
              city: string;
              state: string;
              street: string;
              zipCode: string;
          };
      };
      availability: {
          daysAvailable: string[];
          hoursAvailable: {
              from: string; // Time in HH:mm format
              to: string;   // Time in HH:mm format
          };
      };
      status: 'ACTIVE' | 'INACTIVE'; // Assuming these are the only statuses
  };
  _count?: {
      cases?: number; // Optional field for counting associated cases
  };
}

const LAWYERS_ENDPOINT = '/lawyers';

export const lawyerApi = {
  createLawyer: async (data: LawyerCreateData) => {
    const { data: response } = await api.post<Lawyer>(LAWYERS_ENDPOINT, data);
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
    }>(LAWYERS_ENDPOINT, { params });
    return data;
  },

  getLawyer: async (id: string) => {
    const { data } = await api.get<Lawyer>(`${LAWYERS_ENDPOINT}/${id}`);
    return data;
  },

  updateLawyer: async (id: string, data: Partial<Omit<LawyerCreateData, 'email' | 'password'>>) => {
    const { data: response } = await api.patch<Lawyer>(`${LAWYERS_ENDPOINT}/${id}`, data);
    return response;
  },

  deleteLawyer: async (id: string) => {
    await api.delete(`${LAWYERS_ENDPOINT}/${id}`);
  },
};

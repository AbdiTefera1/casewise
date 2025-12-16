/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/lawyers.ts
import api from './config';

export interface LawyerCreateData {
  email: string; 
  password: string; 
  name: string; 
  specializations: string[]; 
  barNumber: string; 
  licenseStatus: 'Active' | 'Inactive'; 
  jurisdictions: {
    regions: string[]; 
    countries: string[]; 
  };
  hourlyRate: number; 
  contactInfo: {
    email: string; 
    phone?: string; 
    address: {
      street: string; 
      city: string; 
      state: string; 
      zipCode: string; 
    };
  };
  availability: {
    daysAvailable: string[]; 
    hoursAvailable: {
      from: string; 
      to: string; 
    };
  };
}


export interface Lawyer {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: 'LAWYER';
  avatar: string | null; // Corrected from 'avator' to 'avatar'
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt?: string | null; // Optional field
  lawyer: { // Changed from 'lawyerDetails' to 'lawyer'
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

interface LawyerListResponse {
  lawyers: Lawyer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const LAWYERS_ENDPOINT = '/lawyers';

export const lawyerApi = {
  createLawyer: async (data: LawyerCreateData) => {
    const { data: response } = await api.post<Lawyer>(LAWYERS_ENDPOINT, data);
    return response;
  },

  getLawyers: async (params?: Record<string, any>): Promise<LawyerListResponse> => {
    const { data } = await api.get<LawyerListResponse>(LAWYERS_ENDPOINT, { params });
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

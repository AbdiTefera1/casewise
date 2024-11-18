// lib/api/lawyers.ts
import api from './config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// hooks/useLawyers.ts


export function useLawyers(params?: Parameters<typeof lawyerApi.getLawyers>[0]) {
  return useQuery({
    queryKey: ['lawyers', params],
    queryFn: () => lawyerApi.getLawyers(params),
  });
}

export function useLawyer(id: string) {
  return useQuery({
    queryKey: ['lawyers', id],
    queryFn: () => lawyerApi.getLawyer(id),
    enabled: !!id,
  });
}

export function useCreateLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lawyerApi.createLawyer,
    onSuccess: (newLawyer) => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.setQueryData(['lawyers', newLawyer.id], newLawyer);
    },
  });
}

export function useUpdateLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<LawyerCreateData, 'email' | 'password'>> }) =>
      lawyerApi.updateLawyer(id, data),
    onSuccess: (updatedLawyer) => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.setQueryData(['lawyers', updatedLawyer.id], updatedLawyer);
    },
  });
}

export function useDeleteLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lawyerApi.deleteLawyer,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.removeQueries({ queryKey: ['lawyers', deletedId] });
    },
  });
}
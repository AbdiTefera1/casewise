"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { CasePriority, casesApi, CaseStatus, CaseFormData } from '@/lib/api/cases'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// interface UpdateCaseData {
//     clientId?: string;
//     lawyerId?: string;
//     title?: string;
//     description?: string;
//     status?: CaseStatus;
//     endDate?: Date;
//   }

export const useCases = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: CaseStatus;
  priority?: CasePriority;
  startDate?: Date;
  endDate?: Date;
  lawyerId?: string;
  clientId?: string;
}) => {
  return useQuery({
    queryKey: ['cases', params],
    queryFn: async () => {
      try{
        const { cases, pagination } = await casesApi.getAll(params);
        return { cases, pagination };
      } catch (error) {
        console.error('Cases fetch error:', error);
        throw new Error('Failed to fetch cases');
      }
    },
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
      mutationFn: ({ id, ...data }: CaseFormData & { id: string }) =>
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
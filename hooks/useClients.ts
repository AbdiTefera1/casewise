"use client"

import { ClientStatus, CompanyType, UpdateClientData, clientsApi } from '@/lib/api/clients';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// React Query Hooks

export const useClients = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: CompanyType;
    status?: ClientStatus;
    industry?: string;
  }) => {
    return useQuery({
      queryKey: ['clients', params],
      queryFn: () => clientsApi.getAll(params),
    });
  };
  
  export const useClient = (id: string) => {
    return useQuery({
      queryKey: ['clients', id],
      queryFn: () => clientsApi.getById(id),
      enabled: !!id,
    });
  };
  
  export const useCreateClient = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: clientsApi.create,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.setQueryData(['clients', data], data);
      },
    });
  };
  
  export const useUpdateClient = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, ...data }: UpdateClientData & { id: string }) =>
        clientsApi.update(id, data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.setQueryData(['clients', data], data);
      },
    });
  };
  
  export const useDeleteClient = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: clientsApi.delete,
      onSuccess: (_, deletedId) => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.removeQueries({ queryKey: ['clients', deletedId] });
      },
    });
  };
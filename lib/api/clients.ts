// lib/api/clients.ts
import api from './config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export enum CompanyType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  NON_PROFIT = 'NON_PROFIT',
  GOVERNMENT = 'GOVERNMENT'
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  ARCHIVED = 'ARCHIVED'
}

export interface ContactInfo {
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  alternateEmail?: string;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email?: string;
  type?: CompanyType;
  contactInfo?: ContactInfo;
  clientNumber: string;
  companyName?: string;
  industry?: string;
  website?: string;
  notes?: string;
  customFields?: string;
  status?: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ClientListResponse {
  clients: Client[];
  total: number;
  pages: number;
}

interface CreateClientData {
  name: string;
  email?: string;
  type?: CompanyType;
  contactInfo?: ContactInfo;
  clientNumber: string;
  companyName?: string;
  industry?: string;
  website?: string;
  notes?: string;
  customFields?: string;
  status?: ClientStatus;
}

type UpdateClientData = Partial<CreateClientData>;

// API endpoints
const CLIENTS_ENDPOINT = '/clients';

// API functions
const clientsApi = {
  create: (data: CreateClientData) => 
    api.post<Client>(CLIENTS_ENDPOINT, data),

  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: CompanyType;
    status?: ClientStatus;
    industry?: string;
  }) => api.get<ClientListResponse>(CLIENTS_ENDPOINT, { params }),

  getById: (id: string) => 
    api.get<Client>(`${CLIENTS_ENDPOINT}/${id}`),

  update: (id: string, data: UpdateClientData) => 
    api.patch<Client>(`${CLIENTS_ENDPOINT}/${id}`, data),

  delete: (id: string) => 
    api.delete(`${CLIENTS_ENDPOINT}/${id}`),
};

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
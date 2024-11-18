import api from '@/lib/api/config'; // Import the centralized axios instance
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface OrganizationSettings {
  theme?: {
    primaryColor?: string;
    logoUrl?: string;
  };
  billing?: {
    plan?: string;
    billingCycle?: 'monthly' | 'yearly';
  };
  features?: {
    [key: string]: boolean;
  };
}

export interface Organization {
  id: string;
  name: string;
  contactInfo: ContactInfo;
  domain: string;
  settings?: OrganizationSettings;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface CreateOrganizationData {
  name: string;
  contactInfo: ContactInfo;
  domain: string;
  settings?: OrganizationSettings;
}

interface UpdateOrganizationData {
  name?: string;
  contactInfo?: Partial<ContactInfo>;
  domain?: string;
  settings?: Partial<OrganizationSettings>;
}

// Create organization
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrganizationData) => {
      const response = await api.post<Organization>('/organizations', data);
      return response.data;
    },
    onSuccess: (newOrg) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.setQueryData(['organizations', newOrg.id], newOrg);
    },
  });
};

// Get all organizations with filtering and pagination
export const useOrganizations = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: async () => {
      const response = await api.get<{
        organizations: Organization[];
        total: number;
        pages: number;
      }>('/organizations', { params });
      return response.data;
    },
  });
};

// Get single organization
export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const response = await api.get<Organization>(`/organizations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Update organization
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdateOrganizationData & { id: string }) => {
      const response = await api.patch<Organization>(
        `/organizations/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (updatedOrg) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.setQueryData(['organizations', updatedOrg.id], updatedOrg);
    },
  });
};

// Delete organization
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/organizations/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.removeQueries({ queryKey: ['organizations', deletedId] });
    },
  });
};

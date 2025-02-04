/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api/config'; // Import the centralized axios instance

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

export interface CreateOrganizationData {
  name: string;
  contactInfo: ContactInfo;
  domain: string;
  settings?: OrganizationSettings;
}

export interface UpdateOrganizationData {
  name?: string;
  contactInfo?: Partial<ContactInfo>;
  domain?: string;
  settings?: Partial<OrganizationSettings>;
}

interface OrganizationResponse {
  organizations: Organization[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ORGANIZATIONS_ENDPOINT = '/organizations'

export const organizationApi = {
  createOrganization: async (data: CreateOrganizationData) => {
    const response = await api.post<Organization>(ORGANIZATIONS_ENDPOINT, data);
    return response.data;
  },
  getOrganizations: async (params?: Record<string, any>): Promise<OrganizationResponse> => {
    const response = await api.get<OrganizationResponse>(ORGANIZATIONS_ENDPOINT, { params });
    return response.data;
  },
  getOrganization: async (id: string) => {
    const response = await api.get<Organization>(`${ORGANIZATIONS_ENDPOINT}/${id}`);
    return response.data;
  },
  updateOrganization: async (id: string, data: UpdateOrganizationData) => {
    const response = await api.patch<Organization>(
      `${ORGANIZATIONS_ENDPOINT}/${id}`,
      data
    );
    return response.data;
  },
  deleteOrganization: async (id: string) => {
    await api.delete(`/organizations/${id}`);
    return id;
  }
}
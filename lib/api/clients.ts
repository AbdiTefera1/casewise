// lib/api/clients.ts
import api from './config';

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
  SUSPENDED = 'SUSPENDED'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
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
  firstName: string;
  middleName: string;
  lastName?: string;
  email?: string;
  type?: CompanyType;
  contactInfo?: ContactInfo;
  clientNumber?: string;
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
  clients: Client[]; // Array of Client objects
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


export interface CreateClientData {
  firstName: string;
  middleName: string;
  lastName?: string;
  email?: string;
  type?: CompanyType;
  gender?: Gender; 
  contactInfo?: ContactInfo;
  companyName?: string;
  industry?: string;
  website?: string;
  notes?: string;
  customFields?: string;
  status?: ClientStatus;
}

// type UpdateClientData = Partial<CreateClientData>;

export interface UpdateClientData {
  firstName: string;
  middleName: string;
  lastName?: string;
  email?: string;
  type?: CompanyType;
  gender?: Gender; 
  contactInfo?: ContactInfo;
  clientNumber: string;
  companyName?: string;
  industry?: string;
  website?: string;
  notes?: string;
  customFields?: string;
  status?: ClientStatus;
}

// API endpoints
const CLIENTS_ENDPOINT = '/clients';

// API functions
export const clientsApi = {
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


  here is what the fetch organization hook look like 
  // Get all organizations 
export const useOrganizations = () => {
    return useQuery({
      queryKey: ['organizations'],
      queryFn: () => organizationApi.getOrganizations() ,
    });
  };


  here is what the organization response look like 
  interface OrganizationResponse {
  organizations: Organization[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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

here is what users hook look like 
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
  });
}

here is what the user response look like export interface UsersResponse {
    users: User[],
    total: number;
  }
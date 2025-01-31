import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationApi, UpdateOrganizationData } from '@/lib/api/organizations'


// Create organization
export const useCreateOrganization = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: organizationApi.createOrganization,
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
      queryFn: () => organizationApi.getOrganizations(params) ,
    });
  };

// Get single organization
export const useOrganization = (id: string) => {
    return useQuery({
      queryKey: ['organizations', id],
      queryFn: () => organizationApi.getOrganization(id),
      enabled: !!id,
    });
  };

// Update organization
export const useUpdateOrganization = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, ...data }: UpdateOrganizationData & { id: string }) => organizationApi.updateOrganization(id, data),
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
      mutationFn: organizationApi.deleteOrganization,
      onSuccess: (deletedId) => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
        queryClient.removeQueries({ queryKey: ['organizations', deletedId] });
      },
    });
  };
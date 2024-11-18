import api from '@/lib/api/config'; // Use centralized axios instance
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@prisma/client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  organizationId?: string;
}

export interface User {
  id: string;
  organizationId?: string;
  name?: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Authentication API functions
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      // Store token or handle session
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: RegisterUserData) => {
      const { data } = await api.post('/auth/register', userData);
      return data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all queries from cache
    },
  });
};

// User Management API functions
export const useUsers = (params?: { 
  page?: number; 
  limit?: number; 
  search?: string;
  role?: UserRole;
}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await api.get('/users', { params });
      return data;
    },
    enabled: !!localStorage.getItem('token'), // Only fetch if authenticated
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
    enabled: !!userId && !!localStorage.getItem('token'),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateUserData & { id: string }) => {
      const { data } = await api.patch(`/users/${id}`, updateData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['users', data.id], data);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.delete(`/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

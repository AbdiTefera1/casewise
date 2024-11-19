import api from './config';

enum UserRole {
    ADMIN = "ADMIN",
    LAWYER = "LAWYER",
    PARALEGAL = "PARALEGAL",
    USER = "USER"
  }

export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    name: string;
    organizationId: string;
    role: UserRole;
    avator?: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avator?: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Auth API functions
  export const authApi = {
    login: async (credentials: LoginCredentials) => {
      const { data } = await api.post<{ token: string; user: User }>('/api/auth/login', credentials);
      return data;
    },
  
    register: async (userData: RegisterData) => {
      const { data } = await api.post<{ token: string; user: User }>('/api/auth/register', userData);
      return data;
    },
  
    logout: () => {
      localStorage.removeItem('token');
    },
  };
  
  // User API functions
  export const userApi = {
    getUsers: async (params?: {
      page?: number;
      limit?: number;
      organizationId?: string;
      role?: UserRole;
    }) => {
      const { data } = await api.get<{
        users: User[];
        total: number;
        page: number;
        limit: number;
      }>('/api/users', { params });
      return data;
    },
  
    getUser: async (id: string) => {
      const { data } = await api.get<User>(`/api/users/${id}`);
      return data;
    },
  
    updateUser: async (id: string, userData: Partial<User>) => {
      const { data } = await api.patch<User>(`/api/users/${id}`, { ...userData, avator: userData.avator });
      return data;
    },
  
    deleteUser: async (id: string) => {
      await api.delete(`/api/users/${id}`);
    },
  };
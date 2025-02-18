import api from './config';

export enum UserRole {
    SUPERADMIN = "SUPERADMIN",
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
    role?: UserRole;
    avator?: string;
    organizationId?: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avator: string;
    organization: {
      name: string;
      contactInfo: {
        email: string;
        phone: string;
      }
    };
  }

  export interface UsersResponse {
    users: User[],
    total: number;
  }

  interface userRep {
    user: User
  }
  
  // Auth API functions
  export const authApi = {
    login: async (credentials: LoginCredentials) => {
      const { data } = await api.post<{ token: string; user: User }>('/auth/login', credentials);
      return data;
    },
  
    register: async (userData: RegisterData) => {
      const { data } = await api.post<{ token: string; user: User }>('/auth/register', userData);
      return data;
    },
  
    logout: async () => {
      localStorage.removeItem('token');
      await api.post('/auth/logout');
    },
  };
  
  // User API functions
  export const userApi = {
    register: async (userData: RegisterData) => {
      const { data } = await api.post<User>('/auth/register', userData);
      return data;
    },

    getUsers: async () => {
      const { data } = await api.get<{
        users: User[];
        total: number;
      }>('/users');
      return data;
    },
  
    getUser: async (id: string) => {
      const { data } = await api.get<userRep>(`/users/${id}`);
      return data;
    },

    updateUser: async (id: string, userData: Partial<User>) => {
      const { data } = await api.patch<User>(`/users/${id}`, { ...userData, avator: userData.avator });
      return data;
    },
  
    deleteUser: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
  };
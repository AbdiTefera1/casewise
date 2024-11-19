// hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData } from '@/lib/api/users';
import { useAuthStore } from '@/zustand/auth';

export function useAuth() {
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
    },
  });

  const logout = () => {
    authApi.logout();
    clearAuth();
    queryClient.clear();
  };


  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
}



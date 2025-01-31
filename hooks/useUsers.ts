// hooks/useUsers.ts
"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, User } from '@/lib/api/users';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUser(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.register,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['users', newUser], newUser);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({queryKey: ['users']});
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({queryKey: ['users']});
      queryClient.removeQueries({queryKey: ['users', deletedId]});
    },
  });
}
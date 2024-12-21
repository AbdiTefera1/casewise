"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {lawyerApi, LawyerCreateData} from '@/lib/api/lawyers'
// hooks/useLawyers.ts


export function useLawyers(params?: Parameters<typeof lawyerApi.getLawyers>[0]) {
  return useQuery({
    queryKey: ['lawyers', params],
    queryFn: () => lawyerApi.getLawyers(params),
  });
}

export function useLawyer(id: string) {
  return useQuery({
    queryKey: ['lawyers', id],
    queryFn: () => lawyerApi.getLawyer(id),
    enabled: !!id,
  });
}

export function useCreateLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lawyerApi.createLawyer,
    onSuccess: (newLawyer) => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.setQueryData(['lawyers', newLawyer], newLawyer);
    },
  });
}

export function useUpdateLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<LawyerCreateData, 'email' | 'password'>> }) =>
      lawyerApi.updateLawyer(id, data),
    onSuccess: (updatedLawyer) => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.setQueryData(['lawyers', updatedLawyer.id], updatedLawyer);
    },
  });
}

export function useDeleteLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lawyerApi.deleteLawyer,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.removeQueries({ queryKey: ['lawyers', deletedId] });
    },
  });
}
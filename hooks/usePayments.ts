// hooks/usePayments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../lib/api/payments';

export function usePayments(params?: Parameters<typeof paymentApi.getPayments>[0]) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentApi.getPayments(params),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentApi.getPayment(id),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: (newPayment) => {
      queryClient.invalidateQueries({queryKey: ['payments']});
      queryClient.invalidateQueries({queryKey: ['invoices', newPayment.invoiceId]});
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentApi.deletePayment,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({queryKey: ['payments']});
      queryClient.removeQueries({queryKey: ['payments', deletedId]});
    },
  });
}
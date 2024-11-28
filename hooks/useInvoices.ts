// hooks/useInvoices.ts
"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi, InvoiceCreateData, Payment } from '@/lib/api/invoices';

export function useInvoices(params?: Parameters<typeof invoiceApi.getInvoices>[0]) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoiceApi.getInvoices(params),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoiceApi.getInvoice(id),
    enabled: !!id,
  });
}

export function useClientInvoices(clientId: string, params?: Parameters<typeof invoiceApi.getClientInvoices>[1]) {
  return useQuery({
    queryKey: ['invoices', 'client', clientId, params],
    queryFn: () => invoiceApi.getClientInvoices(clientId, params),
    enabled: !!clientId,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceApi.createInvoice,
    onSuccess: (newInvoice) => {
      queryClient.invalidateQueries({queryKey: ['invoices']});
      queryClient.invalidateQueries({queryKey: ['invoices', 'client', newInvoice.clientId]});
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InvoiceCreateData> }) =>
      invoiceApi.updateInvoice(id, data),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({queryKey: ['invoices']});
      queryClient.invalidateQueries({queryKey: ['invoices', 'client', updatedInvoice.clientId]});
      queryClient.setQueryData(['invoices', updatedInvoice.id], updatedInvoice);
    },
  });
}

export function useAddPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, payment }: { invoiceId: string; payment: Omit<Payment, 'id' | 'invoiceId'> }) =>
      invoiceApi.addPayment(invoiceId, payment),
    onSuccess: (_, { invoiceId }) => {
      queryClient.invalidateQueries({queryKey: ['invoices']});
      queryClient.invalidateQueries({queryKey: ['invoices', invoiceId]});
    },
  });
}
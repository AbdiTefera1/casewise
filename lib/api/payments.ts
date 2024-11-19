// lib/api/payments.ts
import api from './config';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CASH = 'CASH',
  WIRE_TRANSFER = 'WIRE_TRANSFER',
  OTHER = 'OTHER'
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  invoice: {
    id: string;
    invoiceNumber: string;
    total: number;
    clientId: string;
    client: {
      id: string;
      name: string;
    };
  };
}

export interface PaymentCreateData {
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export const paymentApi = {
  createPayment: async (data: PaymentCreateData) => {
    const { data: response } = await api.post<Payment>('/api/payments', data);
    return response;
  },

  getPayments: async (params?: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    method?: PaymentMethod;
    invoiceId?: string;
    clientId?: string;
  }) => {
    const { data } = await api.get<{
      payments: Payment[];
      total: number;
      page: number;
      limit: number;
    }>('/api/payments', { params });
    return data;
  },

  getPayment: async (id: string) => {
    const { data } = await api.get<Payment>(`/api/payments/${id}`);
    return data;
  },

  deletePayment: async (id: string) => {
    await api.delete(`/api/payments/${id}`);
  }
};
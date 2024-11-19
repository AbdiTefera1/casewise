// lib/api/invoices.ts
import api from './config';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  itemDate: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  caseId?: string;
  dueDate: Date;
  notes?: string;
  terms?: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  items: InvoiceItem[];
  payments: Payment[];
  client: {
    id: string;
    name: string;
    email: string;
  };
  case?: {
    id: string;
    title: string;
  };
}

export interface InvoiceCreateData {
  clientId: string;
  caseId?: string;
  dueDate: Date;
  notes?: string;
  terms?: string;
  items: Omit<InvoiceItem, 'id' | 'invoiceId'>[];
  tax?: number;
  organizationId: string;
}

const CASES_ENDPOINT = '/invoices';

export const invoiceApi = {
  createInvoice: async (data: InvoiceCreateData) => {
    const { data: response } = await api.post<Invoice>(CASES_ENDPOINT, data);
    return response;
  },

  getInvoices: async (params?: {
    page?: number;
    limit?: number;
    status?: InvoiceStatus;
    startDate?: Date;
    endDate?: Date;
    organizationId?: string;
    search?: string;
  }) => {
    const { data } = await api.get<{
      invoices: Invoice[];
      total: number;
      page: number;
      limit: number;
    }>(CASES_ENDPOINT, { params });
    return data;
  },

  getInvoice: async (id: string) => {
    const { data } = await api.get<Invoice>(`${CASES_ENDPOINT}/${id}`);
    return data;
  },

  getClientInvoices: async (clientId: string, params?: {
    page?: number;
    limit?: number;
    status?: InvoiceStatus;
  }) => {
    const { data } = await api.get<{
      invoices: Invoice[];
      total: number;
    }>(`${CASES_ENDPOINT}/client/${clientId}`, { params });
    return data;
  },

  updateInvoice: async (id: string, data: Partial<InvoiceCreateData>) => {
    const { data: response } = await api.patch<Invoice>(`${CASES_ENDPOINT}/${id}`, data);
    return response;
  },

  deleteInvoice: async (id: string) => {
    await api.delete(`${CASES_ENDPOINT}/${id}`);
  },

  addPayment: async (invoiceId: string, payment: Omit<Payment, 'id' | 'invoiceId'>) => {
    const { data } = await api.post<Payment>(`${CASES_ENDPOINT}/${invoiceId}/payments`, payment);
    return data;
  }
};


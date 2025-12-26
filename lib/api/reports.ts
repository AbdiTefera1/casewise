import { CaseStatus } from '@prisma/client';
import api from './config';

export interface ReportMetrics {
    totalCases: number;
    totalClients: number;
    totalLawyers: number;
    totalDocuments: number;
  }
  
  export interface CaseStatusReport {
    status: CaseStatus;
    count: number;
    percentage: number;
    trend: number; // percentage change from previous period
    avgResolutionTime: number;
    casesList: {
      id: string;
      title: string;
      clientName: string;
      openDate: Date;
    }[];
  }
  
  export interface FinancialReport {
    period: {
      start: Date;
      end: Date;
    };
    summary: {
      totalRevenue: number;
      totalExpenses: number;
      netIncome: number;
      outstandingInvoices: number;
      averagePaymentTime: number;
    };
    revenueByType: {
      type: string;
      amount: number;
      percentage: number;
    }[];
    monthlyRevenue: {
      month: string;
      revenue: number;
      expenses: number;
      profit: number;
    }[];
    topClients: {
      clientId: string;
      clientName: string;
      totalBilled: number;
      totalPaid: number;
      outstanding: number;
    }[];
  }
  
  export interface LawyerPerformanceReport {
    lawyerId: string;
    lawyerName: string;
    metrics: {
      casesHandled: number;
      completionRate: number;
      avgResolutionTime: number;
      clientSatisfaction: number;
      billingEfficiency: number;
    };
    caseload: {
      current: number;
      trending: number;
      byType: {
        type: string;
        count: number;
      }[];
    };
    revenue: {
      total: number;
      target: number;
      achievement: number;
      trend: number;
    };
    tasks: {
      completed: number;
      pending: number;
      overdue: number;
      efficiency: number;
    };
  }
  
  export const reportsApi = {
    getGeneralMetrics: async (params?: {
      startDate?: Date;
      endDate?: Date;
    }) => {
      const { data } = await api.get<ReportMetrics>('/reports', { params });
      return data;
    },
  
    getCaseStatusReport: async (params?: {
      startDate?: Date;
      endDate?: Date;
      status?: CaseStatus[];
    }) => {
      const { data } = await api.get<CaseStatusReport[]>('/reports/case-status', { params });
      return data;
    },
  
    getFinancialReport: async (params: {
      startDate: Date;
      endDate: Date;
      groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    }) => {
      const { data } = await api.get<FinancialReport>('/reports/financial', { params });
      return data;
    },
  
    getLawyerPerformance: async (params?: {
      lawyerId?: string;
      startDate?: Date;
      endDate?: Date;
    }) => {
      const { data } = await api.get<LawyerPerformanceReport[]>('/reports/lawyer-performance', { params });
      return data;
    }
  };
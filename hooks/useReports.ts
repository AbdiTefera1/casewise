// hooks/useReports.ts
"use client"

import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../lib/api/reports';

export function useGeneralMetrics(params?: Parameters<typeof reportsApi.getGeneralMetrics>[0]) {
  return useQuery({
    queryKey: ['reports', 'general', params],
    queryFn: () => reportsApi.getGeneralMetrics(params),
  });
}

export function useCaseStatusReport(params?: Parameters<typeof reportsApi.getCaseStatusReport>[0]) {
  return useQuery({
    queryKey: ['reports', 'case-status', params],
    queryFn: () => reportsApi.getCaseStatusReport(params),
  });
}

export function useFinancialReport(params: Parameters<typeof reportsApi.getFinancialReport>[0]) {
  return useQuery({
    queryKey: ['reports', 'financial', params],
    queryFn: () => reportsApi.getFinancialReport(params),
  });
}

export function useLawyerPerformance(params?: Parameters<typeof reportsApi.getLawyerPerformance>[0]) {
  return useQuery({
    queryKey: ['reports', 'lawyer-performance', params],
    queryFn: () => reportsApi.getLawyerPerformance(params),
  });
}
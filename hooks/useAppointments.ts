"use client"

import { appointmentApi, AppointmentCreateData } from '@/lib/api/appointments';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// hooks/useAppointments.ts
export function useAppointments(params?: Parameters<typeof appointmentApi.getAppointments>[0]) {
    return useQuery({
      queryKey: ['appointments', params],
      queryFn: () => appointmentApi.getAppointments(params),
    });
  }
  
  export function useAppointment(id: string) {
    return useQuery({
      queryKey: ['appointments', id],
      queryFn: () => appointmentApi.getAppointment(id),
      enabled: !!id,
    });
  }
  
  export function useClientAppointments(clientId: string, params?: Parameters<typeof appointmentApi.getClientAppointments>[1]) {
    return useQuery({
      queryKey: ['appointments', 'client', clientId, params],
      queryFn: () => appointmentApi.getClientAppointments(clientId, params),
      enabled: !!clientId,
    });
  }
  
  export function useLawyerAppointments(lawyerId: string, params?: Parameters<typeof appointmentApi.getLawyerAppointments>[1]) {
    return useQuery({
      queryKey: ['appointments', 'lawyer', lawyerId, params],
      queryFn: () => appointmentApi.getLawyerAppointments(lawyerId, params),
      enabled: !!lawyerId,
    });
  }
  
  export function useCreateAppointment() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: appointmentApi.createAppointment,
      onSuccess: (newAppointment) => {
        queryClient.invalidateQueries({queryKey: ['appointments']});
        queryClient.invalidateQueries({queryKey: ['appointments', 'client', newAppointment.clientId]});
        queryClient.invalidateQueries({queryKey: ['appointments', 'lawyer', newAppointment.lawyerId]});
      },
    });
  }
  
  export function useUpdateAppointment() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentCreateData> }) =>
        appointmentApi.updateAppointment(id, data),
      onSuccess: (updatedAppointment) => {
        queryClient.invalidateQueries({queryKey: ['appointments']});
        queryClient.invalidateQueries({queryKey: ['appointments', 'client', updatedAppointment.clientId]});
        queryClient.invalidateQueries({queryKey: ['appointments', 'lawyer', updatedAppointment.lawyerId]});
        queryClient.setQueryData(['appointments', updatedAppointment.id], updatedAppointment);
      },
    });
  }
  
  export function useDeleteAppointment() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: appointmentApi.deleteAppointment,
      onSuccess: (_, deletedId) => {
        queryClient.invalidateQueries({queryKey: ['appointments']});
        queryClient.removeQueries({queryKey: ['appointments', deletedId]});
      },
    });
  }
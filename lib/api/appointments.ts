// lib/api/appointments.ts
import api from './config';

export enum AppointmentType {
  IN_PERSON = 'IN_PERSON',
  VIRTUAL = 'VIRTUAL',
  PHONE_CALL = 'PHONE_CALL'
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED'
}

export interface AppointmentCreateData {
  caseId: string;
  clientId: string;
  lawyerId: string;
  title: string;
  description: string;
  organizationId?: string;
  appointmentDate: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  type: AppointmentType;
  status: AppointmentStatus;
}

// export interface Appointment {
//   id: string;
//   caseId: string;
//   clientId: string;
//   lawyerId: string;
//   title: string;
//   description: string;
//   organizationId?: string;
//   appointmentDate: Date;
//   startTime: Date;
//   endTime: Date;
//   location: string;
//   type: AppointmentType;
//   status: AppointmentStatus;
//   createdAt: Date;
//   updatedAt: Date;
//   case: {
//     id: string;
//     title: string;
//   };
//   client: {
//     id: string;
//     name: string;
//     email: string;
//   };
//   lawyer: {
//     id: string;
//     name: string;
//     email: string;
//   };
//   organization?: {
//     id: string;
//     name: string;
//   };
// }

export interface Appointment {
  id: string;
  title: string;
  description: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  location: string;
  type: AppointmentType;
  lawyerId: string;
  clientId: string;
  caseId?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
  lawyer: {
    id: string;
    name: string;
    email: string;
  };
  client: {
    id: string;
    firstName: string;
    email: string;
  };
  case?: {
    id: string;
    title: string;
    caseNumber: string;
  };
}

const CASES_ENDPOINT = '/appointments';

export const appointmentApi = {
  createAppointment: async (data: AppointmentCreateData) => {
    const { data: response } = await api.post<Appointment>(CASES_ENDPOINT, data);
    return response;
  },

  getAppointments: async (params?: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    status?: AppointmentStatus;
    type?: AppointmentType;
  }) => {
    const { data } = await api.get<{
      appointments: Appointment[];
      total: number;
      page: number;
      limit: number;
    }>(CASES_ENDPOINT, { params });
    return data;
  },

  getAppointment: async (id: string) => {
    const { data } = await api.get<Appointment>(`${CASES_ENDPOINT}/${id}`);
    return data;
  },

  getClientAppointments: async (clientId: string, params?: {
    page?: number;
    limit?: number;
    status?: AppointmentStatus;
  }) => {
    const { data } = await api.get<{
      appointments: Appointment[];
      total: number;
    }>(`${CASES_ENDPOINT}/client/${clientId}`, { params });
    return data;
  },

  getLawyerAppointments: async (lawyerId: string, params?: {
    page?: number;
    limit?: number;
    status?: AppointmentStatus;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const { data } = await api.get<{
      appointments: Appointment[];
      total: number;
    }>(`${CASES_ENDPOINT}/lawyer/${lawyerId}`, { params });
    return data;
  },

  updateAppointment: async (id: string, data: Partial<AppointmentCreateData>) => {
    const { data: response } = await api.patch<Appointment>(`${CASES_ENDPOINT}/${id}`, data);
    return response;
  },

  deleteAppointment: async (id: string) => {
    await api.delete(`${CASES_ENDPOINT}/${id}`);
  },
};


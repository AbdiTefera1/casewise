// lib/api/notifications.ts
import api from './config';

export enum NotificationType {
  INVOICE_CREATED = 'INVOICE_CREATED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  CASE_UPDATE = 'CASE_UPDATE',
  DOCUMENT_SHARED = 'DOCUMENT_SHARED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  DEADLINE_REMINDER = 'DEADLINE_REMINDER',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  reference?: string;
  referenceId?: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationCreateData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  reference?: string;
  referenceId?: string;
  priority?: NotificationPriority;
}

export const notificationApi = {
  createNotification: async (data: NotificationCreateData) => {
    const { data: response } = await api.post<Notification>('/api/notifications', data);
    return response;
  },

  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: NotificationType;
    priority?: NotificationPriority;
  }) => {
    const { data } = await api.get<{
      notifications: Notification[];
      total: number;
      unreadCount: number;
    }>('/api/notifications', { params });
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await api.patch<Notification>(`/api/notifications/${id}`, {
      read: true
    });
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch<{ count: number }>('/api/notifications/mark-all-read');
    return data;
  }
};
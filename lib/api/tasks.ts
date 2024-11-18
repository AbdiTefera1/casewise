// lib/api/tasks.ts
import api from './config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED'
}

export interface TaskCreateData {
  caseId: string;
  assignedTo: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
}

export interface Task {
  id: string;
  caseId: string;
  assignedTo: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  case: {
    id: string;
    title: string;
  };
  assignee: {
    id: string;
    name: string;
    email: string;
  };
}

export const taskApi = {
  createTask: async (data: TaskCreateData) => {
    const { data: response } = await api.post<Task>('/api/tasks', data);
    return response;
  },

  getTasks: async (params?: {
    page?: number;
    limit?: number;
    caseId?: string;
    assignedTo?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const { data } = await api.get<{
      tasks: Task[];
      total: number;
      page: number;
      limit: number;
    }>('/api/tasks', { params });
    return data;
  },

  getTask: async (id: string) => {
    const { data } = await api.get<Task>(`/api/tasks/${id}`);
    return data;
  },

  getTasksByCase: async (caseId: string, params?: {
    page?: number;
    limit?: number;
    status?: TaskStatus;
  }) => {
    const { data } = await api.get<{
      tasks: Task[];
      total: number;
    }>(`/api/tasks/case/${caseId}`, { params });
    return data;
  },

  getTasksByPriority: async (priority: TaskPriority, params?: {
    page?: number;
    limit?: number;
    status?: TaskStatus;
  }) => {
    const { data } = await api.get<{
      tasks: Task[];
      total: number;
    }>(`/api/tasks/priority/${priority}`, { params });
    return data;
  },

  updateTask: async (id: string, data: Partial<Omit<TaskCreateData, 'caseId'>>) => {
    const { data: response } = await api.patch<Task>(`/api/tasks/${id}`, data);
    return response;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/api/tasks/${id}`);
  },
};

// hooks/useTasks.ts

export function useTasks(params?: Parameters<typeof taskApi.getTasks>[0]) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskApi.getTasks(params),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
}

export function useTasksByCase(caseId: string, params?: {
  page?: number;
  limit?: number;
  status?: TaskStatus;
}) {
  return useQuery({
    queryKey: ['tasks', 'case', caseId, params],
    queryFn: () => taskApi.getTasksByCase(caseId, params),
    enabled: !!caseId,
  });
}

export function useTasksByPriority(priority: TaskPriority, params?: {
  page?: number;
  limit?: number;
  status?: TaskStatus;
}) {
  return useQuery({
    queryKey: ['tasks', 'priority', priority, params],
    queryFn: () => taskApi.getTasksByPriority(priority, params),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({queryKey:['tasks', 'case', newTask.caseId]});
      queryClient.setQueryData(['tasks', newTask.id], newTask);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<TaskCreateData, 'caseId'>> }) =>
      taskApi.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({queryKey:['tasks', 'case', updatedTask.caseId]});
      queryClient.setQueryData(['tasks', updatedTask.id], updatedTask);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.removeQueries({queryKey: ['tasks', deletedId]});
    },
  });
}
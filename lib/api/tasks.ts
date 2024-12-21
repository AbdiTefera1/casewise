// lib/api/tasks.ts
import api from './config';

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  URGENT = 'URGENT',
  LOW = 'LOW'
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
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
  startDate: Date;
  deadline: Date;
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
  client: {
      id: string;
      firstName: string;
      lastName: string;
  };
}

interface TaskListResponse {
  tasks: Task[]; // Replace `any` with your actual `Case` type.
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const TASKS_ENDPOINT = "/tasks"

export const taskApi = {
  createTask: async (data: TaskCreateData) => {
    const { data: response } = await api.post<Task>(TASKS_ENDPOINT, data);
    return response;
  },

  getTasks: async (params?: {
    page?: number;
    limit?: number;
    caseId?: string;
    search?: string;
    assignedTo?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TaskListResponse> => {
    const { data } = await api.get<TaskListResponse>(TASKS_ENDPOINT, { params });
    return data;
  },

  getTask: async (id: string) => {
    const { data } = await api.get<Task>(`${TASKS_ENDPOINT}/${id}`);
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
    }>(`${TASKS_ENDPOINT}/case/${caseId}`, { params });
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
    }>(`${TASKS_ENDPOINT}/priority/${priority}`, { params });
    return data;
  },

  updateTask: async (id: string, data: Partial<Omit<TaskCreateData, 'caseId'>>) => {
    const { data: response } = await api.patch<Task>(`${TASKS_ENDPOINT}/${id}`, data);
    return response;
  },

  deleteTask: async (id: string) => {
    await api.delete(`${TASKS_ENDPOINT}/${id}`);
  },
};


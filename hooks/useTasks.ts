"use client"
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {taskApi, TaskCreateData, TaskPriority, TaskStatus} from '@/lib/api/tasks';

export function useTasks(params?: Parameters<typeof taskApi.getTasks>[0]) {
    return useQuery({
      queryKey: ['tasks', params],
      queryFn: async () => {
        const { tasks, pagination } = await taskApi.getTasks(params);
        return {tasks, pagination};
      },
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
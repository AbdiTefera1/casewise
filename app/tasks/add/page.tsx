// app/tasks/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateTask } from '@/hooks/useTasks';
import { useLawyers } from '@/hooks/useLawyers';
import { useCases } from '@/hooks/useCases';
import { useClients } from '@/hooks/useClients';
import { TaskFormData } from '@/lib/api/tasks';


export default function CreateTaskPage() {
  const router = useRouter();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>();
  const createTask = useCreateTask();
  
  const { data: lawyers } = useLawyers();
  const { data: casesData } = useCases({
    limit: 100,
    status: 'ACTIVE'
  });
  const { data: clients } = useClients({
    limit: 100,
    status: 'ACTIVE'
  });

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(data, {
      onSuccess: () => {
        router.push('/tasks');
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Create New Task</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="form-input w-full rounded-md border-gray-300"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="form-textarea w-full rounded-md border-gray-300"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority*
                </label>
                <select
                  {...register('priority', { required: 'Priority is required' })}
                  className="form-select w-full rounded-md border-gray-300"
                >
                  <option value="">Select Priority</option>
                  <option value="URGENT">URGENT</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status*
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="form-select w-full rounded-md border-gray-300"
                >
                  <option value="">Select Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date*
                </label>
                <input
                  type="datetime-local"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="form-input w-full rounded-md border-gray-300"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline*
                </label>
                <input
                  type="datetime-local"
                  {...register('deadline', { required: 'Deadline is required' })}
                  className="form-input w-full rounded-md border-gray-300"
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Case*
              </label>
              <select
                {...register('caseId', { required: 'Case is required' })}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="form-select w-full rounded-md border-gray-300"
              >
                <option value="">Select Case</option>
                {casesData?.cases.map((case_) => (
                  <option key={case_.id} value={case_.id}>
                    {case_.title} - {case_.caseNumber}
                  </option>
                ))}
              </select>
              {errors.caseId && (
                <p className="mt-1 text-sm text-red-600">{errors.caseId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client*
              </label>
              <select
                {...register('clientId', { required: 'Client is required' })}
                className="form-select w-full rounded-md border-gray-300"
              >
                <option value="">Select Client</option>
                {clients?.data?.clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName} {client.companyName && `(${client.companyName})`}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To*
              </label>
              <select
                {...register('assignedTo', { required: 'Assignee is required' })}
                className="form-select w-full rounded-md border-gray-300"
              >
                <option value="">Select Lawyer</option>
                {lawyers?.lawyers.map((lawyer) => (
                  <option key={lawyer.id} value={lawyer.id}>
                    {lawyer.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedTo.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {createTask.isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
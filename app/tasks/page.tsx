'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskPriority, TaskStatus } from '@/lib/api/tasks';
import Link from 'next/link';

export default function TaskListPage() {
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Changed to number
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | undefined>();
  const [deadline, setDeadline] = useState<Date | null>(null);

  const baseParams = {
    page,
    limit: entriesPerPage,
    search: searchTerm,
    status: selectedStatus,
    priority: selectedPriority,
    deadline: deadline ? deadline.toISOString() : undefined,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError } = useTasks(baseParams);

  const tasks = data?.tasks || [];
  const pagination = data?.pagination || undefined;

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load tasks. Please try again later.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-700">Tasks</h1>
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          href='/tasks/add'
        >
          <span>+</span> Add Task
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>

          {/* Filters for Status and Priority */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
              className="border rounded px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
              className="border rounded px-2 py-1"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={deadline ? deadline.toISOString().split('T')[0] : ''}
              onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : null)}
              className="border rounded px-3 py-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                {['No', 'Task Name', 'Related To', 'Start Date', 'Deadline', 'Assignee', 'Status', 'Priority'].map((header, index) => (
                  <th key={index} 
                      className={`px-4 py-3 text-left cursor-pointer ${sortBy === header.toLowerCase() ? 'font-bold' : ''}`}
                      onClick={() => handleSort(header.toLowerCase())}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{(pagination?.page - 1) * pagination?.limit + index + 1}</td>
                  <td className="px-4 py-3">{task.title}</td>
                  <td className="px-4 py-3">{`${task.client.firstName} ${task.client.lastName}`}</td>
                  <td className="px-4 py-3">{formatDate(task.startDate)}</td>
                  <td className="px-4 py-3">{formatDate(task.deadline)}</td>
                  <td className="px-4 py-3">{task.assignee.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (Optional) */}
        {pagination && (
          <div className="flex justify-between p-4">
            <button 
              onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
              disabled={page === 1}
              className={`px-4 py-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button 
              onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))} 
              disabled={page === pagination.totalPages}
              className={`px-4 py-2 ${page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-800',
    'NOT_STARTED': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-cyan-100 text-cyan-800',
  };

  // Default style if status is not recognized
  const defaultStyle = 'bg-gray-200 text-gray-600';

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${statusStyles[status] || defaultStyle}`}>
      {status || 'Unknown'}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const priorityStyles: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };

  // Default style if priority is not recognized
  const defaultStyle = 'bg-gray-200 text-gray-600';

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${priorityStyles[priority] || defaultStyle}`}>
      {priority || 'Unknown'}
    </span>)
}


function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

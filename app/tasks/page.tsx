// 'use client';

// import { useState } from 'react';
// import { useTasks } from '@/hooks/useTasks';
// import { TaskPriority, TaskStatus } from '@/lib/api/tasks';
// import Link from 'next/link';
// import { FaEdit, FaEye } from 'react-icons/fa';

// export default function TaskListPage() {
//   const [entriesPerPage, setEntriesPerPage] = useState(10); // Changed to number
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(1);
//   const [sortBy, setSortBy] = useState('deadline');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//   const [selectedStatus, setSelectedStatus] = useState<TaskStatus | undefined>();
//   const [selectedPriority, setSelectedPriority] = useState<TaskPriority | undefined>();
//   const [deadline, setDeadline] = useState<Date | null>(null);

//   const baseParams = {
//     page,
//     limit: entriesPerPage,
//     search: searchTerm,
//     status: selectedStatus,
//     priority: selectedPriority,
//     deadline: deadline ? deadline.toISOString() : undefined,
//     sortBy,
//     sortOrder,
//   };

//   const { data, isLoading, isError } = useTasks(baseParams);

//   const tasks = data?.tasks || [];
//   const pagination = data?.pagination || undefined;

//   if (isLoading) {
//     return <div className="p-6">Loading...</div>;
//   }

//   if (isError) {
//     return <div className="p-6 text-red-500">Failed to load tasks. Please try again later.</div>;
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl text-gray-700">Tasks</h1>
//         <Link
//           className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
//           href='/tasks/add'
//         >
//           <span>+</span> Add Task
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow">
//         <div className="p-4 flex justify-between items-center border-b">
//           <div className="flex items-center gap-2">
//             <span>Show</span>
//             <select
//               value={entriesPerPage}
//               onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//               className="border rounded px-2 py-1"
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//             </select>
//             <span>entries</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <span>Search:</span>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border rounded px-3 py-1"
//             />
//           </div>

//           {/* Filters for Status and Priority */}
//           <div className="flex items-center gap-2">
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
//               className="border rounded px-2 py-1"
//             >
//               <option value="">All Statuses</option>
//               <option value="COMPLETED">Completed</option>
//               <option value="NOT_STARTED">Not Started</option>
//               <option value="IN_PROGRESS">In Progress</option>
//             </select>

//             <select
//               value={selectedPriority}
//               onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
//               className="border rounded px-2 py-1"
//             >
//               <option value="">All Priorities</option>
//               <option value="LOW">Low</option>
//               <option value="MEDIUM">Medium</option>
//               <option value="HIGH">High</option>
//               <option value="URGENT">Urgent</option>
//             </select>

//             {/* Date Filter */}
//             <input
//               type="date"
//               value={deadline ? deadline.toISOString().split('T')[0] : ''}
//               onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : null)}
//               className="border rounded px-3 py-1"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50 border-b">
//                 {['No', 'Task Name', 'Related To', 'Start Date', 'Deadline', 'Assignee', 'Status', 'Priority'].map((header, index) => (
//                   <th key={index} 
//                       className={`px-4 py-3 text-left cursor-pointer ${sortBy === header.toLowerCase() ? 'font-bold' : ''}`}
//                       onClick={() => handleSort(header.toLowerCase())}>
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {tasks.map((task, index) => (
//                 <tr key={task.id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-3">{((pagination?.page ?? 1) - 1) * (pagination?.limit ?? entriesPerPage) + index + 1}</td>
//                   <td className="px-4 py-3">{task.title}</td>
//                   <td className="px-4 py-3">{`${task.client.firstName} ${task.client.lastName}`}</td>
//                   <td className="px-4 py-3">{formatDate(task.startDate)}</td>
//                   <td className="px-4 py-3">{formatDate(task.deadline)}</td>
//                   <td className="px-4 py-3">{task.assignee.name}</td>
//                   <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
//                   <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
//                   <td className="border-b px-4 py-2 flex justify-center gap-2">
//                   <Link className="text-[#4CAF50] hover:text-gray-600" href={``}>
//                     <FaEdit size={24}/>
//                   </Link>
//                   <Link className="text-[#24A0ED] hover:text-gray-600" href={`/tasks/${task.id}`}>
//                     <FaEye size={24}/>
//                   </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls (Optional) */}
//         {pagination && (
//           <div className="flex justify-between p-4">
//             <button 
//               onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
//               disabled={page === 1}
//               className={`px-4 py-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               Previous
//             </button>
//             <span>Page {page} of {pagination.totalPages}</span>
//             <button 
//               onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))} 
//               disabled={page === pagination.totalPages}
//               className={`px-4 py-2 ${page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   function handleSort(column: string) {
//     if (sortBy === column) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(column);
//       setSortOrder('asc');
//     }
//   }
// }

// function StatusBadge({ status }: { status: string }) {
//   const statusStyles: Record<string, string> = {
//     COMPLETED: 'bg-green-100 text-green-800',
//     'NOT_STARTED': 'bg-blue-100 text-blue-800',
//     'IN_PROGRESS': 'bg-cyan-100 text-cyan-800',
//   };

//   // Default style if status is not recognized
//   const defaultStyle = 'bg-gray-200 text-gray-600';

//   return (
//     <span className={`px-2 py-1 rounded-full text-sm ${statusStyles[status] || defaultStyle}`}>
//       {status || 'Unknown'}
//     </span>
//   );
// }

// function PriorityBadge({ priority }: { priority: string }) {
//   const priorityStyles: Record<string, string> = {
//     LOW: 'bg-gray-100 text-gray-800',
//     MEDIUM: 'bg-blue-100 text-blue-800',
//     HIGH: 'bg-orange-100 text-orange-800',
//     URGENT: 'bg-red-100 text-red-800',
//   };

//   // Default style if priority is not recognized
//   const defaultStyle = 'bg-gray-200 text-gray-600';

//   return (
//     <span className={`px-2 py-1 rounded-full text-sm ${priorityStyles[priority] || defaultStyle}`}>
//       {priority || 'Unknown'}
//     </span>)
// }


// function formatDate(date: Date): string {
//   return new Date(date).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   });
// }





'use client';

import { useState } from 'react';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { TaskPriority, TaskStatus } from '@/lib/api/tasks';
import Link from 'next/link';
import { FaEdit, FaEye, FaSave, FaTimes } from 'react-icons/fa';

export default function TaskListPage() {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | undefined>();
  const [deadline, setDeadline] = useState<Date | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<{
    title: string;
    priority: TaskPriority;
    status: TaskStatus;
    startDate: string;
    deadline: string;
    assignedTo: string; // assuming assignee id
  }>>({});

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
  const updateMutation = useUpdateTask();

  const tasks = data?.tasks || [];
  const pagination = data?.pagination;

  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditedTask({
      title: task.title,
      priority: task.priority,
      status: task.status,
      startDate: task.startDate,
      deadline: task.deadline,
      assignedTo: task.assignee.id || '', // adjust if your assignee structure differs
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedTask({});
  };

  const saveEdit = (taskId: string) => {
    const dataToUpdate = { ...editedTask };
    // Convert dates to ISO if needed (your API likely expects ISO strings)
    if (dataToUpdate.startDate) dataToUpdate.startDate = new Date(dataToUpdate.startDate).toISOString();
    if (dataToUpdate.deadline) dataToUpdate.deadline = new Date(dataToUpdate.deadline).toISOString();

    updateMutation.mutate(
      { id: taskId, data: dataToUpdate },
      {
        onSuccess: () => cancelEdit(),
        onError: () => alert('Update failed. Please try again.'),
      }
    );
  };

  const handleChange = (field: string, value: any) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load tasks.</div>;

  return (
    <div className="p-6">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-700">Tasks</h1>
        <Link href="/tasks/add" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <span>+</span> Add Task
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Filters */}
        <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="border rounded px-2 py-1">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1"
          />

          <div className="flex items-center gap-3">
            <select
              value={selectedStatus ?? ''}
              onChange={(e) => setSelectedStatus(e.target.value ? (e.target.value as TaskStatus) : undefined)}
              className="border rounded px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>

            <select
              value={selectedPriority ?? ''}
              onChange={(e) => setSelectedPriority(e.target.value ? (e.target.value as TaskPriority) : undefined)}
              className="border rounded px-2 py-1"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            <input
              type="date"
              value={deadline ? deadline.toISOString().split('T')[0] : ''}
              onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : null)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['No', 'Task Name', 'Related To', 'Start Date', 'Deadline', 'Assignee', 'Status', 'Priority', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task: any, idx: number) => {
                const isEditing = editingId === task.id;
                const current = isEditing ? { ...task, ...editedTask } : task;

                return (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{(page - 1) * entriesPerPage + idx + 1}</td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={current.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        task.title
                      )}
                    </td>

                    <td className="px-4 py-3">{`${task.client.firstName} ${task.client.lastName}`}</td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="date"
                          value={current.startDate?.split('T')[0] || ''}
                          onChange={(e) => handleChange('startDate', e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        formatDate(task.startDate)
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="date"
                          value={current.deadline?.split('T')[0] || ''}
                          onChange={(e) => handleChange('deadline', e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        formatDate(task.deadline)
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={current.assignee?.name || ''}
                          placeholder="Assignee name"
                          onChange={(e) => handleChange('assignedTo', e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        task.assignee.name
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={current.status}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      ) : (
                        <StatusBadge status={task.status} />
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={current.priority}
                          onChange={(e) => handleChange('priority', e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="URGENT">Urgent</option>
                        </select>
                      ) : (
                        <PriorityBadge priority={task.priority} />
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(task.id)}
                              disabled={updateMutation.isPending}
                              className="text-green-600 hover:text-green-800"
                            >
                              <FaSave size={20} />
                            </button>
                            <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                              <FaTimes size={20} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(task)} className="text-[#4CAF50] hover:text-gray-600">
                              <FaEdit size={20} />
                            </button>
                            <Link href={`/tasks/${task.id}`} className="text-[#24A0ED] hover:text-gray-600">
                              <FaEye size={20} />
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Badges & formatting remain the same
function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    COMPLETED: 'bg-green-100 text-green-800',
    NOT_STARTED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-cyan-100 text-cyan-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-sm ${styles[status] || 'bg-gray-200 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-sm ${styles[priority] || 'bg-gray-200 text-gray-600'}`}>
      {priority}
    </span>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

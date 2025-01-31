export const useCases = (params?: Parameters<typeof lawyerApi.getLawyers>[0]) => {
return useQuery({
queryKey: ['cases', params],
queryFn: async () => {
const { cases, pagination } = await casesApi.getAll(params);
return { cases, pagination };
},
});
};

export const useClients = (params?: Parameters<typeof lawyerApi.getLawyers>[0]) => {
return useQuery({
queryKey: ['clients', params],
queryFn: () => clientsApi.getAll(params),
});
};

export function useLawyers(params?: Parameters<typeof lawyerApi.getLawyers>[0]) {
return useQuery({
queryKey: ['lawyers', params],
queryFn: () => lawyerApi.getLawyers(params),
});
}



// app/dashboard/page.tsx
'use client';

import { useCases } from '@/hooks/useCases';
import { useTasks } from '@/hooks/useTasks';
import { FiEye, FiEdit, FiPrinter, FiDownload } from 'react-icons/fi';

interface DashboardStat {
  title: string;
  count: number;
  subtitle: string;
  icon: React.ReactNode;
  className?: string;
}

interface Case {
  id: number;
  type: 'Contract' | 'Litigation';
  client: string;
  nextDate: string;
  status: string;
}

interface Task {
  id: number;
  title: string;
  type: 'warning' | 'danger' | 'info' | 'primary';
}

export default function DashboardPage() {
  const { data: casesData } = useCases();
  const { data: tasksData } = useTasks();

  const stats: DashboardStat[] = [
    {
      title: 'Cases',
      count: 12,
      subtitle: 'Total cases',
      icon: (
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      title: 'Archived',
      count: 20,
      subtitle: 'Total completed cases',
      icon: (
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      title: 'Important Cases',
      count: 5,
      subtitle: 'Total important cases',
      icon: (
        <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      title: 'Clients',
      count: 30,
      subtitle: 'Total clients',
      icon: (
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl text-blue-600 font-semibold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-gray-900">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.count}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.subtitle}</p>
              </div>
              <div className="text-gray-400">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cases Board */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Cases board</h2>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <FiPrinter className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <FiDownload className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">No.</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Case</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Next dates</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {casesData?.cases.map((case_, index) => (
                    <tr key={case_.id}>
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{case_.type}</td>
                      <td className="px-4 py-3">{case_.client}</td>
                      <td className="px-4 py-3">{case_.nextDate}</td>
                      <td className="px-4 py-3">{case_.status}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="text-green-600 hover:text-green-800">
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiEdit className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Task List</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {tasksData?.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg ${
                      task.type === 'warning' ? 'bg-orange-100' :
                      task.type === 'danger' ? 'bg-red-100' :
                      task.type === 'info' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.id}</span>
                      <span>{task.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
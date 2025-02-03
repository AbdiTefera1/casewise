"use client";

import { useState } from 'react';
import { useAuthStore } from '@/zustand/auth';
import { useTasks } from '@/hooks/useTasks';
import { useCases } from '@/hooks/useCases';
import { PageHeader } from './PageHeader';
import StatCard from './StatCard';
import CasesTable from '../Cases/CasesTable';
import TaskList from '../Tasks/TaskList';
import { UserRole } from '@prisma/client';
import { FaPlus } from 'react-icons/fa';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(5);

  const { data: tasksData, isLoading: tasksLoading } = useTasks();
  const tasks = tasksData?.tasks || [];
  const { data, isLoading } = useCases({ page: currentPage, limit });
  const cases = data?.cases || [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1 };

  const stats = {
    totalCases: cases.length,
    archivedCases: cases.filter((c) => c.status === 'ARCHIVED').length,
    importantCases: cases.filter((c) => c.priority === 'HIGH' || c.priority === 'URGENT' || c.status === 'ACTIVE').length,
    totalClients: [...new Set(cases.map((c) => c.clientId))].length,
  };

  if (tasksLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="min-h-screen">
      <PageHeader title="Dashboard">
        <button className="bg-[#1D4ED8] text-white font-medium flex items-center p-1 rounded-md">
          <FaPlus className="mr-2" />
          New Case
        </button>
      </PageHeader>

      <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Cases" 
            subtitle= "Total cases"
            count={stats.totalCases} 
            icon={<svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>} 
          />
          <StatCard 
            title="Archived" 
            subtitle="Total completed cases" 
            count={stats.archivedCases} 
            icon={<svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>} 
          />
          <StatCard 
            title="Important Cases" 
            subtitle="Total important cases" 
            count={stats.importantCases} 
            icon={<svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>} 
          />
          <StatCard 
            title="Clients" 
            subtitle="Total clients" 
            count={stats.totalClients} 
            icon={<svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Cases</h2>
              </div>
              <CasesTable cases={cases} userRole={user?.role as UserRole} />
              <div className="flex justify-between p-4">
                <button
                  className="btn-secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="btn-secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Tasks</h2>
              </div>
              <TaskList tasks={recentTasks} userRole={user?.role as UserRole} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
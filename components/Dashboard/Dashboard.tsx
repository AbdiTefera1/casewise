"use client";

import { useState } from 'react';
import { useAuthStore } from '@/zustand/auth';
// import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks';
import { useCases } from '@/hooks/useCases';
import { PageHeader } from '@/components/shared/PageHeader';
import StatCard from './StatCard';
import CasesTable from '../Cases/CasesTable';
import TaskList from '../Tasks/TaskList';
import { UserRole } from '@prisma/client';
import { FaPlus, FaGavel, FaStar, FaUsers } from 'react-icons/fa';
import { FaFileLines } from 'react-icons/fa6';

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
        <button className="btn-primary">
          <FaPlus className="mr-2" />
          New Case
        </button>
      </PageHeader>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total cases" 
            value={stats.totalCases} 
            icon={<FaGavel className="w-5 h-5" />} 
            trend={10} 
          />
          <StatCard 
            title="Total completed cases" 
            value={stats.archivedCases} 
            icon={<FaFileLines className="w-5 h-5" />} 
            trend={5} 
          />
          <StatCard 
            title="Total important cases" 
            value={stats.importantCases} 
            icon={<FaStar className="w-5 h-5" />} 
            trend={-2} 
          />
          <StatCard 
            title="Total clients" 
            value={stats.totalClients} 
            icon={<FaUsers className="w-5 h-5" />} 
            trend={8} 
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
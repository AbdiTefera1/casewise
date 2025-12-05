"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/zustand/auth";
import { useTasks } from "@/hooks/useTasks";
import { useCases } from "@/hooks/useCases";
import { UserRole } from "@prisma/client";
import {
  FileText,
  AlertCircle,
  Users,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Timer,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import CasesTable from "../Cases/CasesTable";
import TaskList from "../Tasks/TaskList";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const { data: tasksData, isLoading: tasksLoading } = useTasks();
  const { data, isLoading: casesLoading } = useCases({ page: currentPage, limit });

  const tasks = tasksData?.tasks || [];
  const cases = data?.cases || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  const stats = {
    totalCases: cases.length,
    activeCases: cases.filter((c) => c.status === "ACTIVE").length,
    urgentCases: cases.filter((c) => c.priority === "URGENT").length,
    overdueTasks: tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "COMPLETED").length,
    totalClients: [...new Set(cases.map((c) => c.clientId))].length,
    completedThisWeek: tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return t.status === "COMPLETED" && taskDate > weekAgo;
    }).length,
  };

  if (casesLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const recentTasks = tasks.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening in your firm today</p>
          </div>

          <button className="group relative inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-300">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
            New Case
            <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          <StatCard
            icon={<FileText className="h-8 w-8" />}
            title="Total Cases"
            value={stats.totalCases}
            subtitle="Active Cases"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<AlertCircle className="h-8 w-8" />}
            title="Urgent"
            value={stats.urgentCases}
            subtitle="Need Attention"
            gradient="from-red-500 to-pink-500"
            pulse={stats.urgentCases > 0}
          />
          <StatCard
            icon={<Timer className="h-8 w-8" />}
            title="Overdue"
            value={stats.overdueTasks}
            subtitle="Tasks"
            gradient="from-orange-500 to-red-500"
            pulse={stats.overdueTasks > 0}
          />
          <StatCard
            icon={<Users className="h-8 w-8" />}
            title="Clients"
            value={stats.totalClients}
            subtitle="This Month"
            gradient="from-purple-500 to-indigo-500"
          />
          <StatCard
            icon={<CheckCircle2 className="h-8 w-8" />}
            title="Completed"
            value={stats.completedThisWeek}
            subtitle="This Week"
            gradient="from-emerald-500 to-teal-500"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Win Rate"
            value="87%"
            subtitle="Last 30 days"
            gradient="from-green-500 to-emerald-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl ring-1 ring-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Cases</h2>
                  <p className="text-gray-500">Your most active matters</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Updated {new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="overflow-x-auto">
                <CasesTable cases={cases} userRole={user?.role as UserRole} />
              </div>

              {/* Pagination */}
              <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Page <span className="text-blue-600 font-bold">{pagination.page}</span> of{" "}
                  <span className="text-purple-600 font-bold">{pagination.totalPages}</span>
                </span>

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-3xl shadow-xl ring-1 ring-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  Upcoming Tasks
                </h3>
                {stats.overdueTasks > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold animate-pulse">
                    {stats.overdueTasks} overdue
                  </span>
                )}
              </div>
              <TaskList tasks={recentTasks} userRole={user?.role as UserRole} />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
              <Sparkles className="h-10 w-10 mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-3">Need to act fast?</h3>
              <p className="text-white/90 mb-6">
                Create a new case, add a client, or schedule a hearing in seconds.
              </p>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-medium transition">
                  + New Client
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-medium transition">
                  + Schedule Hearing
                </button>
                <button className="w-full py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition">
                  View Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard Component
interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  gradient: string;
  pulse?: boolean;
}

const StatCard = ({ icon, title, value, subtitle, gradient, pulse = false }: StatCardProps) => (
  <div
    className={`relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1 ${pulse ? "animate-pulse" : ""
      }`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
        {pulse && <div className="h-3 w-3 bg-red-500 rounded-full animate-ping" />}
      </div>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      <p className="text-xs text-gray-400 mt-2">{title}</p>
    </div>
  </div>
);
"use client"

import { useEffect, useState } from 'react';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import SuperAdminDashboard from '@/components/Dashboard/SuperAdminDashboard';
import { useAuthStore } from '@/zustand/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle unauthorized access
  useEffect(() => {
    if (isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // Show loader until auth state is determined
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return user?.role === "SUPERADMIN" ? <SuperAdminDashboard /> : <Dashboard />;
}

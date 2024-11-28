// components/layout/Layout.tsx
"use client"

import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { login, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!login) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="h-screen overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
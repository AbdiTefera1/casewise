// components/layout/Layout.tsx
"use client"

import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import { redirect } from 'next/navigation';
import Header from './Header';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { login, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!login) {
    redirect('/login');
  }

  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      <div className="flex flex-1">
        <Sidebar isMenuOpen={isMenuOpen} />
        <div className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-16'} top-20 relative`}>
          <main className="h-screen overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
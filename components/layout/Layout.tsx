// "use client"

// import { useAuth } from '@/hooks/useAuth';
// import { useAuthStore } from '@/zustand/auth';
// import Sidebar from './Sidebar';
// import { redirect } from 'next/navigation';
// import Header from './Header';
// import { useState } from 'react';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout = ({ children }: LayoutProps) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(true);
//   const { login, isLoading } = useAuth();
//   const { user } = useAuthStore();

//   if (!user) {redirect('/login');}

//   if (isLoading) return (<div className="flex items-center justify-center h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//   </div>);

//   if (!login) {
//     redirect('/login');
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
//       <div className="flex flex-1 overflow-hidden pt-16">
//         <Sidebar isMenuOpen={isMenuOpen} />
//         <div className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-16'} overflow-auto`}>
//           <main className="h-full p-4">
//             {children}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;


"use client"

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/zustand/auth';
import Sidebar from './Sidebar';
import { redirect } from 'next/navigation';
import Header from './Header';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { login, isLoading } = useAuth();
  const { user } = useAuthStore();

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  if (!user) {
    redirect('/login');
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (!login) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Pass toggleDarkMode and isDarkMode to Header */}
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar isMenuOpen={isMenuOpen} />
        <div className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-16'} overflow-auto`}>
          <main className="h-full p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
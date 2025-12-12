"use client";
import { FiMenu, FiMoon, FiSun, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/zustand/auth';
import Link from 'next/link';
import logo from "@/public/logo.svg";
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  setIsMenuOpen: (value: boolean) => void;
  isMenuOpen: boolean;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ setIsMenuOpen, isMenuOpen, toggleDarkMode, isDarkMode }) => {
  const { user } = useAuthStore();
  const [isDropdown, setIsDropdown] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
    setIsDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="flex justify-between items-center py-4 px-6">
        {/* Left Side - Logo + Menu */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center">
            <Image 
              src={logo} 
              width={248} 
              alt="Casewise Logo" 
              className="h-9 w-auto transition-all duration-300 hover:scale-105 dark:invert" 
            />
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group p-3 rounded-xl bg-gray-100/70 dark:bg-gray-800/70 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:shadow-md"
          >
            <FiMenu className="text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-200" size={22} />
          </button>
        </div>

        {/* Right Side - Theme + User */}
        <div className="flex items-center gap-5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200/70 dark:from-gray-800 dark:to-gray-900/70 hover:shadow-lg hover:shadow-yellow-500/20 dark:hover:shadow-yellow-600/10 transition-all duration-300 group"
          >
            <div className="relative">
              {isDarkMode ? (
                <FiSun className="text-yellow-500 group-hover:rotate-180 transition-all duration-700" size={22} />
              ) : (
                <FiMoon className="text-[#00a79d] dark:text-[#5eb8e5] group-hover:-rotate-12 transition-all duration-500" size={22} />
              )}
              <span className="absolute inset-0 rounded-full bg-white/30 dark:bg-black/20 blur-xl scale-0 group-hover:scale-150 transition-transform duration-500"></span>
            </div>
          </button>

          {/* User Section */}
          <div className="relative">
            <button
              onClick={() => setIsDropdown(!isDropdown)}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-300 group"
            >
              <div className="text-right">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || "Member"}</p>
              </div>

              <div className="relative">
                {user?.avator ? (
                  <Image
                    src={user.avator}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-[#00a79d] dark:group-hover:ring-[#5eb8e5] transition-all duration-300"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00a79d] to-[#5eb8e5] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.name?.[0]?.toUpperCase() || <FiUser />}
                  </div>
                )}
                {/* Online Indicator */}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-md"></span>
              </div>
            </button>

            {/* Enhanced Dropdown */}
            <div
              className={`absolute right-0 top-16 w-56 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 origin-top-right ${
                isDropdown
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'
              }`}
            >
              <div className="py-2">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdown(false)}
                  className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                >
                  <FiUser className="text-[#00a79d] dark:text-[#5eb8e5]" size={18} />
                  <span className="font-medium">My Profile</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsDropdown(false)}
                  className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <FiSettings className="text-gray-600 dark:text-gray-400" size={18} />
                  <span className="font-medium">Settings</span>
                </Link>

                <hr className="my-2 border-gray-200 dark:border-gray-700" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-5 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <FiLogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
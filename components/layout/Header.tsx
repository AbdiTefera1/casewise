// "use client";

// import { FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
// import { useAuthStore } from '@/zustand/auth';
// import Link from 'next/link';
// import logo from "@/public/logo.svg";
// import Image from 'next/image';
// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';

// interface HeaderProps {
//   setIsMenuOpen: (value: boolean) => void;
//   isMenuOpen: boolean;
// }

// const Header: React.FC<HeaderProps> = ({ setIsMenuOpen, isMenuOpen }) => {
//   const { user } = useAuthStore();
//   const [isDropdown, setIsDropdown] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const { logout } = useAuth();

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle('dark');
//   };

//   const handleLogout = () => {
//     logout(); // Call the logout function
//     setIsDropdown(false); // Close the dropdown after logout
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900 shadow-md z-10 transition-colors duration-300">
//       <div className="flex items-center">
//         <Link href="/dashboard" className="flex items-center gap-3">
//           <Image src={logo} width={248} alt="Casewise Logo" className="dark:invert" />
//         </Link>
//         <button
//           className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <FiMenu className="text-gray-600 dark:text-gray-400" size={24} />
//         </button>
//       </div>

//       <div className="flex items-center gap-6 relative">
//         <button
//           onClick={toggleDarkMode}
//           className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//         >
//           {isDarkMode ? (
//             <FiSun className="text-yellow-500" size={24} />
//           ) : (
//             <FiMoon className="text-gray-600 dark:text-gray-400" size={24} />
//           )}
//         </button>

//         <div className="flex items-center gap-3">
//           <Link href="#" className="flex flex-col items-end">
//             <span className="font-bold text-gray-800 dark:text-gray-200">{user?.name}</span>
//             <span className="text-sm text-gray-600 dark:text-gray-400">{user?.role}</span>
//           </Link>
//           <button
//             onClick={() => setIsDropdown(!isDropdown)}
//             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//           >
//             <FiUser className="text-gray-600 dark:text-gray-400" size={24} />
//           </button>
//         </div>

//         {/* Dropdown Menu */}
//         <div
//           className={`absolute top-14 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
//             isDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
//           }`}
//         >
//           <Link
//             href="/profile"
//             className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
//           >
//             Profile
//           </Link>
//           <button
//             onClick={handleLogout} // Call handleLogout on button click
//             className="block w-full text-left px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



"use client";

import { FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { useAuthStore } from '@/zustand/auth';
import Link from 'next/link';
import logo from "@/public/logo.svg";
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  setIsMenuOpen: (value: boolean) => void;
  isMenuOpen: boolean;
  toggleDarkMode: () => void; // Add this
  isDarkMode: boolean; // Add this
}

const Header: React.FC<HeaderProps> = ({ setIsMenuOpen, isMenuOpen, toggleDarkMode, isDarkMode }) => {
  const { user } = useAuthStore();
  const [isDropdown, setIsDropdown] = useState(false);
  const { logout } = useAuth();

  // Initialize dark mode from localStorage
  // useEffect(() => {
  //   const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  //   setIsDarkMode(savedDarkMode);
  //   document.documentElement.classList.toggle('dark', savedDarkMode);
  // }, []);

  // // Toggle dark mode
  // const toggleDarkMode = () => {
  //   const newDarkMode = !isDarkMode;
  //   setIsDarkMode(newDarkMode);
  //   document.documentElement.classList.toggle('dark', newDarkMode);
  //   localStorage.setItem('darkMode', newDarkMode.toString());
  // };

  const handleLogout = () => {
    logout(); // Call the logout function
    setIsDropdown(false); // Close the dropdown after logout
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900 shadow-md z-10 transition-colors duration-300">
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src={logo} width={248} alt="Casewise Logo" className="dark:invert" />
        </Link>
        <button
          className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FiMenu className="text-gray-600 dark:text-gray-400" size={24} />
        </button>
      </div>

      <div className="flex items-center gap-6 relative">
      <button
          onClick={toggleDarkMode} // Use toggleDarkMode
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          {isDarkMode ? ( // Use isDarkMode to determine the icon
            <FiSun className="text-yellow-500" size={24} />
          ) : (
            <FiMoon className="text-gray-600 dark:text-gray-400" size={24} />
          )}
        </button>

        <div className="flex items-center gap-3">
          <Link href="#" className="flex flex-col items-end">
            <span className="font-bold text-gray-800 dark:text-gray-200">{user?.name}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{user?.role}</span>
          </Link>
          <button
            onClick={() => setIsDropdown(!isDropdown)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <FiUser className="text-gray-600 dark:text-gray-400" size={24} />
          </button>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-14 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
            isDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <Link
            href="/profile"
            className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;



// interface HeaderProps {
//   setIsMenuOpen: (value: boolean) => void;
//   isMenuOpen: boolean;
//   toggleDarkMode: () => void; // Add this
//   isDarkMode: boolean; // Add this
// }

// const Header: React.FC<HeaderProps> = ({ setIsMenuOpen, isMenuOpen, toggleDarkMode, isDarkMode }) => {
//   // Existing code...

//   return (
//     <header className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900 shadow-md z-10 transition-colors duration-300">
//       {/* Existing code... */}

//       <div className="flex items-center gap-6 relative">
//         <button
//           onClick={toggleDarkMode} // Use toggleDarkMode
//           className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//         >
//           {isDarkMode ? ( // Use isDarkMode to determine the icon
//             <FiSun className="text-yellow-500" size={24} />
//           ) : (
//             <FiMoon className="text-gray-600 dark:text-gray-400" size={24} />
//           )}
//         </button>

//         {/* Existing code... */}
//       </div>
//     </header>
//   );
// };

// export default Header;
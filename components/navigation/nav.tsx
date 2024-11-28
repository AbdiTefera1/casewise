// /* eslint-disable @typescript-eslint/no-explicit-any */
// // components/navigation/Navbar.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useDebounce } from '@/hooks/useDebounce';

// interface NavbarProps {
//   className?: string;
// }

// export function Navbar({ className = '' }: NavbarProps) {
//   const [scrollY, setScrollY] = useState(0);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const pathname = usePathname();

//   // Debounced scroll handler for better performance
//   const handleScroll = useCallback(() => {
//     setScrollY(window.scrollY);
//   }, []);

//   const debouncedHandleScroll = useDebounce(handleScroll, 10);

//   useEffect(() => {
//     window.addEventListener('scroll', debouncedHandleScroll);
//     return () => window.removeEventListener('scroll', debouncedHandleScroll);
//   }, [debouncedHandleScroll]);

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest('#navbar-menu') && !target.closest('#profile-menu')) {
//         setIsMenuOpen(false);
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: '📊' },
//     { name: 'Projects', href: '/projects', icon: '📁' },
//     { name: 'Team', href: '/team', icon: '👥' },
//     { name: 'Reports', href: '/reports', icon: '📈' },
//   ];

//   const NavLink = ({ href, children, isMobile = false }: any) => {
//     const isActive = pathname === href;
    
//     return (
//       <Link href={href}>
//         <motion.span
//           className={`
//             relative px-4 py-2 rounded-lg text-sm font-medium
//             ${isMobile ? 'block w-full' : 'inline-flex items-center'}
//             ${isActive 
//               ? 'text-white' 
//               : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
//             }
//           `}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           {children}
//           {isActive && (
//             <motion.div
//               layoutId="active-pill"
//               className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg -z-10"
//               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//             />
//           )}
//         </motion.span>
//       </Link>
//     );
//   };

//   return (
//     <motion.nav
//       className={`
//         fixed top-0 left-0 right-0 z-50
//         ${className}
//       `}
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: "spring", bounce: 0.2 }}
//     >
//       <motion.div
//         className={`
//           absolute inset-0 -z-10 backdrop-blur-[8px]
//           ${scrollY > 0 
//             ? 'bg-white/75 dark:bg-gray-900/75 shadow-lg'
//             : 'bg-transparent'
//           }
//         `}
//         animate={{
//           opacity: scrollY > 0 ? 1 : 0,
//           backdropFilter: `blur(${Math.min(scrollY / 5, 8)}px)`
//         }}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <motion.div
//             className="flex-shrink-0"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Link href="/dashboard" className="flex items-center space-x-2">
//               <div className="relative w-8 h-8">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg" />
//                 <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-[6px]" />
//                 <span className="absolute inset-0 flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
//                   A
//                 </span>
//               </div>
//               <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
//                 AppName
//               </span>
//             </Link>
//           </motion.div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navigation.map((item) => (
//               <NavLink key={item.href} href={item.href}>
//                 <span className="mr-2">{item.icon}</span>
//                 {item.name}
//               </NavLink>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Theme Toggle */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//             >
//               <span className="sr-only">Toggle theme</span>
//               🌙
//             </motion.button>

//             {/* Notifications */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//             >
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
//               <span className="sr-only">Notifications</span>
//               🔔
//             </motion.button>

//             {/* Profile Dropdown */}
//             <div className="relative" id="profile-menu">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
//                   U
//                 </div>
//               </motion.button>

//               <AnimatePresence>
//                 {isProfileOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden"
//                   >
//                     <div className="py-1 bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
//                       {['Profile', 'Settings', 'Sign out'].map((item) => (
//                         <motion.button
//                           key={item}
//                           whileHover={{ x: 6 }}
//                           className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                         >
//                           {item}
//                         </motion.button>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//           >
//             <span className="sr-only">Open menu</span>
//             {isMenuOpen ? '✕' : '☰'}
//           </motion.button>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden"
//             id="navbar-menu"
//           >
//             <div className="px-2 pt-2 pb-3 space-y-1 bg-white/75 dark:bg-gray-900/75 backdrop-blur-lg">
//               {navigation.map((item) => (
//                 <NavLink key={item.href} href={item.href} isMobile>
//                   <span className="mr-2">{item.icon}</span>
//                   {item.name}
//                 </NavLink>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// }






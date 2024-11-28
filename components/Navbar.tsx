// // components/Navbar.js
// "use client"
// import Link from 'next/link'
// import { useState } from 'react'

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false)

//   const toggleMenu = () => setIsOpen(!isOpen)

//   return (
//     <nav className="bg-gray-800 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="text-white text-2xl font-bold">
//           <Link href="/">Casewise</Link>
//         </div>
//         <button
//           className="text-white md:hidden"
//           onClick={toggleMenu}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             strokeWidth="2"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//         <div
//           className={`${
//             isOpen ? 'block' : 'hidden'
//           } md:flex space-x-6 text-white`}
//         >
//           <Link href="/">
//             <span className="hover:text-gray-400">Home</span>
//           </Link>
//           <Link href="/about">
//             <span className="hover:text-gray-400">About</span>
//           </Link>
//           <Link href="/services">
//             <span className="hover:text-gray-400">Services</span>
//           </Link>
//           <Link href="/contact">
//             <span className="hover:text-gray-400">Contact</span>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar

"use client"

import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <span className="font-bold text-xl">Casewise</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Pricing</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">About Us</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Resources</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Support</a>
              <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md">Get Started</a>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open. */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle className based on menu state. */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#" className="block text-gray-700 hover:text-gray-900">Home</a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">Features</a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">Pricing</a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">About Us</a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">Resources</a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">Support</a>
          <a href="/login" className="block bg-blue-600 text-white px-4 py-2 rounded-md">Get Started</a>
        </div>
      </div>
    </nav>
  );
}
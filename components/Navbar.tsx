"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/public/logo.svg";
import Image from 'next/image';
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Benefits", href: "#benefits" },
    { name: "Pricing", href: "#pricing" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              {/* <div className="relative">
                <Zap className="h-9 w-9 text-blue-600 drop-shadow-lg" />
                <div className="absolute inset-0 bg-blue-600/30 blur-2xl scale-150 -z-10" />
              </div>
              <span className="ml-3 text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Casewise
              </span> */}
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} width={248} alt="Casewise Logo" className="dark:invert rounded-md bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300" />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8 space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-5 py-3 text-gray-700 font-medium text-sm tracking-wide hover:text-gray-900 transition-colors duration-300 group"
                >
                  {item.name}
                  <span className="absolute left-4 right-4 bottom-1 h-0.5 bg-gradient-to-r from-[#00a79d] to-[#5eb8e5] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-full" />
                </a>
              ))}

              <a
                href="/login"
                className="ml-8 relative overflow-hidden px-8 py-4 font-bold text-white bg-gradient-to-r from-[#00a79d] to-[#5eb8e5] rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {isOpen ? (
                <X className="h-7 w-7 text-gray-800" />
              ) : (
                <Menu className="h-7 w-7 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-In Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl transform transition-all duration-500 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Top glow effect */}
          <div className="h-1 bg-gradient-to-r from-[#00a79d] to-[#5eb8e5]" />

          <div className="flex-1 overflow-y-auto pt-24 pb-10 px-8">
            <div className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-5 px-6 text-xl font-semibold text-gray-800 hover:text-[#00a79d] hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all duration-300 transform hover:translate-x-3"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* CTA at bottom */}
          <div className="p-8 border-t border-gray-100">
            <a
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-5 px-8 text-xl font-bold text-white bg-gradient-to-r from-[#00a79d] to-[#5eb8e5] rounded-2xl shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </a>
            <p className="text-center text-gray-500 mt-4 font-medium">
              No credit card needed • 14-day trial
            </p>
          </div>
        </div>
      </div>

      {/* Dark overlay when mobile menu open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}
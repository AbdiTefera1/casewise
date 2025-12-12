"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/auth";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Shield, CheckCircle } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.svg";

const RegisterPage = () => {
  const { register, isLoading, error } = useAuth();
  const { user } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side – Hero Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#00a79d] to-[#5eb8e5]">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-300" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 flex flex-col justify-center items-center text-white px-16"
        >
          <div className="text-center max-w-2xl">
            {/* Logo */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-5">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} width={248} alt="Casewise Logo" className="dark:invert rounded-md bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300" />
              </Link>
              </div>
            </div>

            <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
              Start Winning More Time
              <br />
              <span className="text-white/90">From Day One</span>
            </h2>

            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Join 5,000+ attorneys who’ve eliminated chaos, reclaimed their calendar,
              and grown their practice — all with one intelligent platform.
            </p>

            {/* Feature Pills */}
            <div className="space-y-4 text-left">
              {[
                "14-day free trial — no card required",
                "Cancel anytime, zero risk",
                "Setup in under 5 minutes",
                "Bank-grade security & encryption",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 text-lg"
                >
                  <CheckCircle className="h-7 w-7 text-white/80 flex-shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Trust Bar */}
            <div className="mt-16 flex items-center justify-center gap-12 text-white/80">
              <div className="text-center">
                <div className="text-4xl font-black">5K+</div>
                <div className="text-sm">Active Firms</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black">47h</div>
                <div className="text-sm">Saved/Month</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black">4.9</div>
                <div className="text-sm">Star Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side – Registration Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50/80 via-white to-blue-50/50 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 mb-8">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} width={248} alt="Casewise Logo" className="dark:invert rounded-md bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300" />
              </Link>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Your Account</h2>
            <p className="text-lg text-gray-600">Start your free trial in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#5eb8e5] transition" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                required
                className="w-full pl-14 pr-5 py-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg"
              />
            </div>

            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#5eb8e5] transition" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@lawfirm.com"
                required
                className="w-full pl-14 pr-5 py-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg"
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition" />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a strong password"
                required
                minLength={8}
                className="w-full pl-14 pr-5 py-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg"
              />
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-medium flex items-center justify-center gap-3"
              >
                <Shield className="h-5 w-5" />
                {error.message || "Something went wrong. Please try again."}
              </motion.div>
            )}

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-gradient-to-r from-[#00a79d] to-[#5eb8e5] text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-purple-500/40 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {isLoading ? (
                  <>
                    <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Start Free Trial
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#5eb8e5] hover:underline">
              Sign in here
            </Link>
          </p>

          {/* Trust Footer */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
              <Shield className="h-4 w-4" />
              <span>Bank-grade encryption • SOC 2 Compliant • Privacy First</span>
            </div>
            <p className="text-xs text-gray-400">
              By signing up, you agree to our{" "}
              <a href="#" className="underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
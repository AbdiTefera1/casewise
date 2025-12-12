"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/auth";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.svg";

const LoginPage = () => {
  const { login, isLoading, error } = useAuth();
  const { user } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side – Hero Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#00a79d] to-[#5eb8e5]">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl"
          >
            {/* Logo */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} width={248} alt="Casewise Logo" className="dark:invert rounded-md bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300" />
              </Link>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Welcome to the Future
              <br />
              of Case Management
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-xl">
              Join 5,000+ attorneys who’ve reclaimed their time, eliminated missed deadlines,
              and grown their practice — without working harder.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { icon: CheckCircle, label: "Zero Missed Dates" },
                { icon: CheckCircle, label: "10h Saved/Week" },
                { icon: CheckCircle, label: "4.9/5 Rating" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <item.icon className="h-10 w-10 mb-3 text-white/80" />
                  <span className="font-bold text-lg">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side – Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} width={248} alt="Casewise Logo" className="dark:invert rounded-md bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300" />
              </Link>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Log in to access your firm’s command center
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lawfirm.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-[#5eb8e5] transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#00a79d] focus:ring-[#00a79d]"
                />
                <span className="text-gray-700 font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[#5eb8e5] font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium"
              >
                {error.message || "Invalid credentials. Please try again."}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-[#00a79d] to-[#5eb8e5] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing you in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Login to Dashboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
                </span>
              )}
            </button>
          </form>

          {/* Sign Up CTA */}
          <p className="text-center mt-8 text-gray-600">
            New to Casewise?{" "}
            <Link href="/register" className="font-bold text-[#5eb8e5] hover:underline">
              Start your free trial
            </Link>
          </p>

          {/* Trust Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              Trusted by top law firms • SOC 2 Compliant • Bank-grade encryption
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
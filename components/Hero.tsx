"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import Image from "next/image";
import dashboardPreview from "@/public/dashboard-preview.png";

export default function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-32 pb-20 lg:pt-44 lg:pb-32">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-pink-400/20 to-blue-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/50 px-5 py-2.5 rounded-full shadow-lg mb-8"
            >
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                Trusted by 5,000+ law firms worldwide
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="block text-5xl sm:text-6xl lg:text-7xl font-black font-extrabold tracking-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Run Your Law Firm
              </span>
              <br />
              <span className="text-gray-900">Like Clockwork</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              The all-in-one case management platform that saves you{" "}
              <span className="font-bold text-blue-600">10+ hours per week</span> on admin work.
              <br className="hidden sm:block" />
              Focus on winning cases — let Casewise handle the rest.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <a
                href="/login"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </a>

              <a
                href="#demo"
                className="px-10 py-5 text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-md border-2 border-gray-200 rounded-2xl hover:bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                Watch Demo
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600"
            >
              {[
                "No credit card required",
                "14-day free trial",
                "Cancel anytime",
                "Setup in 5 minutes",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dashboard Preview - Floating Card */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 relative mx-auto max-w-6xl"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <Image
                src={dashboardPreview}
                alt="Casewise Dashboard Preview"
                className="w-full object-cover"
                width={1000}
                height={1000}
                // Fallback if no image yet
                // Replace with a beautiful gradient placeholder if needed
              />
              <div className="absolute bottom-8 left-8 z-20 text-white z-20">
                <p className="text-lg font-semibold opacity-90">Live Dashboard Preview</p>
                <p className="text-sm opacity-70">Drag to explore • Fully responsive</p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-10 -left-10 animate-bounce">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-xl">
                <div className="h-12 w-12 bg-white/20 rounded-lg" />
              </div>
            </div>
            <div className="absolute -bottom-12 -right-8 animate-pulse delay-300">
              <div className="bg-gradient-to-tr from-pink-500 to-yellow-500 p-5 rounded-3xl shadow-2xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}
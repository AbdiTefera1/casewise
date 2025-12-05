"use client";

import { motion } from "framer-motion";
import {
  Users,
  CheckSquare,
  Calendar,
  BellRing,
  Shield,
  FileText,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Intelligent Case Management",
    description: "Track every case from intake to closure with automated workflows, deadlines, and document linking.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Centralized Client Portal",
    description: "Securely store client info, communication history, invoices, and shared documents in one place.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: CheckSquare,
    title: "Smart Task Automation",
    description: "Assign tasks, set dependencies, get reminders — never miss a filing or follow-up again.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Calendar,
    title: "Court Date Sync & Reminders",
    description: "Auto-sync with your calendar. Get push, email & SMS alerts 7 days, 48h, and 1h before hearings.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: BellRing,
    title: "Deadline Guardian",
    description: "AI-powered deadline calculator based on jurisdiction rules. Zero missed statutes of limitations.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "End-to-end encryption, SOC 2 compliant, automatic backups, and role-based access control.",
    gradient: "from-rose-500 to-pink-600",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900">
            Built for Lawyers
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Who Win
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to run a modern, efficient, and profitable law practice — without the chaos.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />

                <div className="relative bg-white rounded-3xl p-8 shadow-xl ring-1 ring-gray-100 hover:ring-gray-200 transition-all duration-500 h-full">
                  {/* Icon with Gradient Background */}
                  <div
                    className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition duration-500`}
                  >
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Subtle bottom accent */}
                  <div
                    className={`mt-6 h-1 w-16 bg-gradient-to-r ${feature.gradient} rounded-full opacity-70 group-hover:w-full transition-all duration-700`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-gray-600 mb-8">
            Join 5,000+ attorneys already saving <span className="font-bold text-blue-600">47 hours per month</span>
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-purple-2xl hover:shadow-purple-500/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            Start Winning More Time
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
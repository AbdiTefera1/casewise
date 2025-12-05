"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Folders,
  HeartHandshake,
  ArrowDownUp,
  Lock,
  BellRing,
  BarChart3,
  CreditCard,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "10× Faster Workflow",
    description: "Automate repetitive tasks — filing updates, reminders, follow-ups — and reclaim your evenings.",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Folders,
    title: "Everything in One Place",
    description: "Cases, clients, documents, emails, invoices — all organized, searchable, and instantly accessible.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: HeartHandshake,
    title: "Happier Clients",
    description: "Faster responses, transparent updates, and secure portals = more referrals and 5-star reviews.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: ArrowDownUp,
    title: "No More Chaos",
    description: "Visual timelines, task dependencies, and automated workflows keep every case on track.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Lock,
    title: "Fort Knox Security",
    description: "Military-grade encryption, automatic backups, audit logs, and GDPR/HIPAA compliance built-in.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: BellRing,
    title: "Never Miss a Deadline Again",
    description: "Smart reminders via email, SMS, and app — 7 days, 48h, and 1h before every hearing.",
    gradient: "from-red-500 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Know Your Firm’s Pulse",
    description: "Real-time reports on caseload, win rates, revenue, and team performance.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: CreditCard,
    title: "Get Paid Faster",
    description: "Generate invoices in seconds, track payments, send automatic reminders — no more chasing clients.",
    gradient: "from-amber-500 to-orange-600",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function Benefits() {
  return (
    <section id="benefits" className="py-mt-10 py-24 lg:py-32 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-5 w-5" />
            The Modern Law Firm Advantage
          </div>

          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
            Stop Surviving.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Start Thriving.
            </span>
          </h2>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Lawyers using Casewise report{" "}
            <span className="font-bold text-blue-600">47% less stress</span> and{" "}
            <span className="font-bold text-purple-600">32% more billable hours</span>.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={index}
                variants={card}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Glow background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative h-full bg-white rounded-3xl p-8 shadow-lg ring-1 ring-gray-100 hover:ring-gray-200 hover:shadow-2xl transition-all duration-500">
                  {/* Icon with gradient circle */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} shadow-xl mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition duration-500`}
                  >
                    <Icon className="h-9 w-9 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Expanding bar */}
                  <div className="mt-6 h-1 w-12 bg-gradient-to-r ${benefit.gradient} rounded-full group-hover:w-full transition-all duration-700" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-2xl font-semibold text-gray-700 mb-8">
            Ready to focus on what matters: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">winning cases</span>
          </p>

          <a
            href="/login"
            className="inline-flex items-center gap-4 px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl hover:shadow-purple-500/40 transform hover:-translate-y-2 transition-all duration-300 group"
          >
            <Sparkles className="h-7 w-7" />
            Start Your Free 14-Day Trial
            <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition" />
          </a>

          <p className="mt-6 text-gray-500 font-medium">
            No credit card • Instant access • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
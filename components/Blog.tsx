"use client";

import { motion } from "framer-motion";
import {
  Clock,
  BookOpen,
  Users,
  Zap,
  FileText,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

const blogPosts = [
  {
    title: "How Top Attorneys Save 12 Hours Per Week",
    excerpt: "The exact systems, templates, and automations that let you focus on winning cases instead of admin work.",
    category: "Productivity",
    date: "Dec 2024",
    readTime: "7 min",
    author: "Sarah Chen",
    image: "gradient-orange",
    stats: "12K views • 342 shares",
  },
  {
    title: "The 2025 Legal Tech Stack Every Firm Needs",
    excerpt: "Forget the hype. Here's what actually works for modern law practices — and what to avoid.",
    category: "Legal Tech",
    date: "Nov 2024",
    readTime: "9 min",
    author: "Michael Rodriguez",
    image: "gradient-blue",
    stats: "8.7K views • 189 shares",
  },
  {
    title: "Never Miss a Court Date: The Ultimate Checklist",
    excerpt: "A bulletproof system for deadlines, reminders, and notifications that keeps you compliant and stress-free.",
    category: "Case Management",
    date: "Oct 2024",
    readTime: "6 min",
    author: "Emily Park",
    image: "gradient-purple",
    stats: "15K views • 412 shares",
  },
  {
    title: "How to 3x Client Referrals Without Spending More",
    excerpt: "The psychology of trust, automated follow-ups, and referral systems that work for solo practitioners.",
    category: "Client Growth",
    date: "Sep 2024",
    readTime: "8 min",
    author: "David Kim",
    image: "gradient-green",
    stats: "6.2K views • 267 shares",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const categoryColors = {
  Productivity: "from-orange-500 to-red-500",
  "Legal Tech": "from-blue-500 to-cyan-500",
  "Case Management": "from-purple-500 to-violet-500",
  "Client Growth": "from-emerald-500 to-teal-500",
};

export default function Blog() {
  return (
    <section id="blog" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50/50 via-white to-white/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <BookOpen className="h-5 w-5" />
            Thought Leadership from Casewise
          </div>

          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            The Lawyer&apos;s Playbook
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              for Winning More
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Practical strategies from 10+ years of helping 5,000+ law firms work smarter, not harder.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              variants={card}
              whileHover={{ y: -12 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ring-1 ring-gray-100 hover:ring-gray-200"
            >
              {/* Gradient Background Image */}
              <div
                className={`relative h-56 overflow-hidden ${
                  index % 2 === 0 ? "lg:h-64" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    categoryColors[post.category as keyof typeof categoryColors]
                  } opacity-90`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Decorative elements */}
                <div className="absolute top-6 right-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white/80" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between text-white/90">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {post.stats}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10">
                {/* Author & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-xs font-semibold">
                        {post.author.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <span>{post.author}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {post.date}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {post.excerpt}
                </p>

                {/* Read More CTA */}
                <motion.a
                  href={`/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  whileHover={{ x: 8 }}
                  className="inline-flex items-center gap-3 text-blue-600 font-semibold text-lg group/read"
                >
                  Read the full guide
                  <ExternalLink className="h-5 w-5 group-hover/read:translate-x-1 transition-transform" />
                </motion.a>

                {/* Bottom accent line */}
                <div className="mt-8 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20 lg:mt-32"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
              Ready to Work Smarter, Not Harder?
            </h3>
            <p className="text-xl text-gray-600 mb-10">
              Join 5,000+ attorneys reading our insights and transforming their practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/login"
                className="group inline-flex items-center gap-3 px-8 py-5 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl hover:shadow-purple-500/40 transform hover:-translate-y-1 transition-all duration-300"
              >
                Start Free Trial
                <Zap className="h-5 w-5 group-hover:translate-x-1 transition" />
              </a>
              
              <a
                href="/blog"
                className="px-8 py-5 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg"
              >
                Browse All Posts
              </a>
            </div>

            {/* Stats Row */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Users, number: "5K+", label: "Attorneys" },
                { icon: BookOpen, number: "42", label: "Articles" },
                { icon: TrendingUp, number: "98%", label: "Satisfaction" },
                { icon: Clock, number: "12h", label: "Saved/Week" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4"
                  >
                    <Icon className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
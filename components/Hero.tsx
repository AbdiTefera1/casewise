"use client"
// components/Hero.js
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Hero() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            variants={fadeInUp}
          >
            Simplify Your Legal Practice with Our Case Management Solution.
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            variants={fadeInUp}
          >
            Effortlessly manage cases, clients, and schedules all in one place.
          </motion.p>
          <motion.a 
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </motion.div>
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Uncomment the following line if you have an image to display */}
          {/* <img 
            src="/dashboard-preview.png" 
            alt="Dashboard Preview" 
            className="w-full rounded-lg shadow-xl"
          /> */}
        </motion.div>
      </div>
    </div>
  );
}
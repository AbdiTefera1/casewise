"use client"
// components/Features.js
import { motion } from 'framer-motion'

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
  
const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

export default function Features() {
    const features = [
      {
        title: "Increased Productivity",
        description: "Automate routine tasks like court updates, notifications, and scheduling.",
        icon: "⚡"
      },
      // ... add more features
    ]
  
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex flex-col md:flex-row items-center gap-8"
                variants={fadeInUp}
              >
                <motion.div 
                  className="text-4xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }
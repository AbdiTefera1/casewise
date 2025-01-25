"use client"
// components/Benefits.js
import { motion } from 'framer-motion'

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Benefits() {
    const benefits = [
        {
          title: "Case Management",
          description: "Streamline case progression and access",
          icon: "⚖️"
        },
        {
          title: "Client Tracking",
          description: "Maintain detailed records of client information",
          icon: "👥"
        },
        {
          title: "Task Monitor",
          description: "Efficiently plan and monitor daily activities",
          icon: "📋"
        },
        {
          title: "Court Date Reminders",
          description: "Never miss important deadlines",
          icon: "🔔"
        },
        {
          title: "Appointment Management",
          description: "Easily schedule, track and get appointment reminders",
          icon: "📅"
        }
      ]
  
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-100 p-6 rounded-lg"
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: 0.5 }
                  }
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                {/* <motion.div 
                  className="text-3xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                > */}
                  {benefit.icon}
                {/* </motion.div> */}
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }
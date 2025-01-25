"use client"
// components/Pricing.js
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
  
export default function Pricing() {
    const plans = [
      {
        name: "Basic",
        price: "0",
        features: ["Limited cases and clients", "Basic task management", "Calendar integration"]
      },
      {
        name: "Pro",
        price: "500",
        features: ["Unlimited cases and clients", "Advanced task management", "Appointment scheduling", "Enhanced reporting tools"]
      },
      {
        name: "Enterprise",
        price: "Contact Us",
        features: ["All Pro features", "Custom integrations", "Priority support", "Team training"]
      }
    ]
  
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {plans.map((plan, index) => (
              <motion.div 
                key={index}
                className="border rounded-lg p-8"
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  {typeof plan.price === 'number' && <span className="text-lg">/month</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <motion.svg 
                        className="w-5 h-5 text-green-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className="mt-8 w-full bg-blue-600 text-white py-2 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }
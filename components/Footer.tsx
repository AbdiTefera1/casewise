"use client"
// components/Footer.js
import { motion } from 'framer-motion'

export default function Footer() {
  const footerSections = {
    company: {
      title: "Company",
      links: ["About Us", "Careers", "Press", "News"]
    },
    product: {
      title: "Product",
      links: ["Features", "Pricing", "Case Studies", "Reviews"]
    },
    resources: {
      title: "Resources",
      links: ["Blog", "Help Center", "Documentation", "API"]
    },
    legal: {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "GDPR"]
    }
  }

  const socialIcons = [
    { name: "LinkedIn", icon: "linkedin.svg" },
    { name: "Twitter", icon: "twitter.svg" },
    { name: "Facebook", icon: "facebook.svg" },
    { name: "Instagram", icon: "instagram.svg" }
  ]

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {Object.entries(footerSections).map(([key, section], index) => (
            <motion.div
              key={key}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
            >
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.hr 
          className="my-12 border-gray-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            {socialIcons.map((social, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-gray-400 hover:text-white"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* <img 
                  src={social.icon} 
                  alt={social.name}
                  className="w-6 h-6"
                /> */}
              </motion.a>
            ))}
          </div>

          <motion.p 
            className="text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            © {new Date().getFullYear()} Legal Case Management. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiLinkedin, 
  FiTwitter, 
  FiFacebook, 
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';
import logo from "@/public/logo.svg";
import Image from 'next/image';

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
  };

  const socialLinks = [
    { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Logo + Tagline Column (replacing one section visually, but structure preserved) */}
          <motion.div
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Link href="/" className="inline-block mb-6">
              <Image 
                src={logo} 
                alt="Casewise Logo" 
                width={200} 
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Streamline legal case management with intelligent tools built for modern law firms.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail size={16} />
                <span>support@casewise.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Other Sections */}
          {Object.entries(footerSections).map(([key, section], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <h4 className="text-lg font-bold mb-5 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <motion.li
                    key={link}
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-6"></span>
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Animated Divider */}
        <motion.div
          className="my-16 relative"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md"></div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {/* Social Icons */}
          <div className="flex items-center gap-6">
            {socialLinks.map(({ icon: Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all duration-300"
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon 
                  size={20} 
                  className="text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" 
                />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {label}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            © {new Date().getFullYear()} Casewise. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
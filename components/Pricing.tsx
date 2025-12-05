"use client";

import { motion } from "framer-motion";
import { Check, Zap, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 0,
    popular: false,
    description: "Perfect for solo practitioners just getting started",
    features: [
      "Up to 25 active cases",
      "Basic case & client management",
      "Calendar sync",
      "Email support",
      "Mobile app access",
    ],
  },
  {
    name: "Professional",
    price: 49,
    popular: true,
    description: "The #1 choice for growing firms (most popular)",
    badge: "MOST POPULAR",
    features: [
      "Unlimited cases & clients",
      "Advanced automation & workflows",
      "Court date reminders (SMS + Email)",
      "Client portal & secure messaging",
      "Time tracking & invoicing",
      "Custom reports & analytics",
      "Priority email + chat support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    popular: false,
    description: "For large firms needing full control & white-glove service",
    features: [
      "Everything in Professional",
      "Custom integrations (Clio, Outlook, etc.)",
      "Dedicated account manager",
      "Onboarding & team training",
      "SSO + advanced permissions",
      "Custom data retention",
      "SLA & 24/7 phone support",
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const card = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles className="h-5 w-5" />
            Transparent Pricing • No Hidden Fees
          </div>

          <h2 className="text-5xl lg:text-6xl font-black text-gray-900">
            Choose the Perfect Plan
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              for Your Firm
            </span>
          </h2>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Join 5,000+ law firms already saving time and winning more cases.
            <br className="hidden sm:block" />
            <span className="font-bold text-blue-600">14-day free trial</span> on all paid plans — no credit card required.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={card}
              whileHover={{ y: -12 }}
              className={`relative group ${plan.popular ? "lg:scale-105" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                    <Zap className="h-5 w-5" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div
                className={`relative h-full rounded-3xl p-8 lg:p-10 overflow-hidden transition-all duration-500 ${
                  plan.popular
                    ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl ring-4 ring-purple-600/30"
                    : "bg-white shadow-xl ring-1 ring-gray-200"
                }`}
              >
                {/* Background glow for popular */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl -z-10" />
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-3xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-3 text-lg ${plan.popular ? "text-white/80" : "text-gray-600"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-10 text-center">
                  {typeof plan.price === "number" ? (
                    <div>
                      <span className={`text-6xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}>
                        ${plan.price}
                      </span>
                      <span className={`text-xl ${plan.popular ? "text-white/70" : "text-gray-500"}`}>
                        /month
                      </span>
                      {plan.price === 0 && (
                        <p className="mt-2 text-lg font-semibold text-green-500">Forever Free</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-4xl font-black text-white">{plan.price}</div>
                  )}
                </div>

                <ul className="space-y-5 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Check
                        className={`h-6 w-6 flex-shrink-0 ${
                          plan.popular ? "text-white" : "text-green-500"
                        }`}
                      />
                      <span className={`${plan.popular ? "text-white/90" : "text-gray-700"} font-medium`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full block text-center py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                    plan.popular
                      ? "bg-white text-purple-600 hover:bg-gray-100"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl"
                  }`}
                >
                  {plan.price === 0 ? "Get Started Free" : plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            <span className="font-bold text-2xl text-blue-600">10,000+</span> cases managed •{" "}
            <span className="font-bold text-purple-600">4.9/5</span> from 1,200+ reviews •{" "}
            <span className="font-bold text-green-600">Zero</span> missed court dates reported
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {["Clio", "MyCase", "PracticePanther", "Smokeball"].map((logo) => (
              <div key={logo} className="text-gray-400 font-semibold">
                Trusted alternative to {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
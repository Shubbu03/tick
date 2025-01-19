"use client";

import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";

const features = [
  { text: "Centralized Subscription Dashboard", icon: Sparkles },
  { text: "Smart Renewal Reminders", icon: CheckCircle },
  { text: "Personalized Spending Insights", icon: ArrowRight },
];

export default function Features() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="grid md:grid-cols-3 gap-8 mt-12"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="flex items-center bg-gradient-to-r from-white/10 to-white/20 dark:from-white/5 dark:to-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/10 shadow-lg"
        >
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <feature.icon className="h-6 w-6 mr-3 text-emerald-300 dark:text-emerald-400" />
          </motion.div>
          <p className="text-lg text-white dark:text-teal-100">
            {feature.text}
          </p>
        </motion.div>
      ))}
    </motion.section>
  );
}

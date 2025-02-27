"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-center p-4 md:p-6 bg-gradient-to-r from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 backdrop-blur-lg text-white dark:text-teal-100 border-t border-white/10 dark:border-teal-900/30">
      <div className="flex items-center justify-center gap-2">
        <span>made with ❤️ by shubham</span>
        <span>.</span>
        <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
          <a
            href="https://github.com/Shubbu03"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-100 hover:text-white dark:text-teal-200 dark:hover:text-white"
          >
            <Github size={20} />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}

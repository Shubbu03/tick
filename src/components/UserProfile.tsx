import { getInitials } from "@/lib/userInitials";
import { motion } from "framer-motion";
import Link from "next/link";

interface UserProfileProps {
  isCollapsed: boolean;
  user: {
    name: string;
    email: string;
  };
}

export default function UserProfile({ isCollapsed, user }: UserProfileProps) {
  const userInitials = getInitials(user.name);

  return (
    <Link href="/profile" className="block">
      <div
        className={`
        absolute bottom-0 left-0 right-0 p-4
        border-t border-white/10 
        flex items-center
        ${isCollapsed ? "justify-center" : "space-x-3"}
        bg-gradient-to-b from-transparent to-cyan-600/50 dark:to-cyan-900/50
        hover:bg-white/10 transition-colors duration-200
      `}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
          {userInitials}
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            <span className="text-sm font-medium text-white">{user.name}</span>
            <span className="text-xs text-white/70">{user.email}</span>
          </motion.div>
        )}
      </div>
    </Link>
  );
}

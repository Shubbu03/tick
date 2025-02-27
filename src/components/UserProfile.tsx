import { getInitials } from "@/lib/userInitials";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface UserProfileProps {
  isCollapsed: boolean;
  user: {
    name: string;
    email: string;
  };
}

export default function UserProfile({ isCollapsed, user }: UserProfileProps) {
  const { data: session } = useSession();
  const userInitials = getInitials(user.name);
  const userProfilePic = session?.user.image;

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
        <Avatar className="w-8 h-8 cursor-pointer transition-opacity duration-200 hover:opacity-80 rounded-full overflow-hidden">
          {userProfilePic ? (
            <AvatarImage
              src={userProfilePic}
              alt="User"
              className="rounded-full w-full h-full object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-teal-100 text-teal-600 text-xs rounded-full w-full h-full flex items-center justify-center">
            {userInitials}
          </AvatarFallback>
        </Avatar>
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

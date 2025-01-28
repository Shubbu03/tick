"use client";

import { LogOut, Music, Plus, Video } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import StatsCard from "@/components/StatsCard";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "react-day-picker";
import SubscriptionCard from "@/components/SubscriptionCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.log("SESSION DATA IS::", session);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`flex-1 ${
          isCollapsed ? "pl-16" : "pl-60"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold">
              Hi, {session?.user?.username || ""}! 👋
            </h1>
            <p className="text-gray-500">Here`s your subscription overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
  //     <Sidebar />
  //     <div className="flex-1 pl-16">
  //       <div className="flex justify-end items-center p-4 space-x-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
  //         <ThemeToggle />
  //         <button
  //           className="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  //           onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
  //         >
  //           <LogOut className="w-5 h-5" />
  //         </button>
  //       </div>

  // <div className="p-8">
  //   <div className="mb-8">
  //     <h1 className="text-2xl font-bold mb-2">Welcome back, {session?.user?.name || 'John'}!</h1>
  //     <p className="text-gray-500">Here`s your subscription overview</p>
  //   </div>

  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  //           <StatsCard
  //             title="Monthly Expenses"
  //             value="$349.99"
  //             subValue={<span className="text-green-500">↑ 2.5%</span>}
  //           />
  //           <StatsCard
  //             title="Active Subscriptions"
  //             value="12"
  //             subValue={<span className="text-red-500">↓ 1</span>}
  //           />
  //           <StatsCard
  //             title="Next Payment"
  //             value="$29.99"
  //             subValue="in 3 days"
  //           />
  //         </div>

  //         <div className="mb-6">
  //           <h2 className="text-xl font-bold mb-4">Recent Subscriptions</h2>``
  //           <SubscriptionCard
  //             icon={Music}
  //             name="Spotify Premium"
  //             category="Music"
  //             price="9.99"
  //           />
  //           <SubscriptionCard
  //             icon={Video}
  //             name="Netflix"
  //             category="Streaming"
  //             price="14.99"
  //           />
  //         </div>

  //         <Dialog open={modalOpen} onOpenChange={setModalOpen}>
  //           <DialogTrigger asChild>
  //             <Button
  //               className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg"
  //               size="icon"
  //             >
  //               <Plus className="w-6 h-6" />
  //             </Button>
  //           </DialogTrigger>
  //           <AddSubscriptionModal open={modalOpen} onOpenChange={setModalOpen} />
  //         </Dialog>
  //       </div>
  //     </div>
  //   </div>
  // );
}

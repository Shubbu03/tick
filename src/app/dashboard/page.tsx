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
import axios from "axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [montlyExpense, setMontlyExpense] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMonthlyExpense();
  }, []);
  const fetchMonthlyExpense = async () => {
    try {
      const response = await axios.get("/api/get-monthly-expense");
      if (response) {
        setMontlyExpense(response.data.data);
      }
    } catch (err) {
      console.error("Error occured while loading user's montly expense:", err);
    }
  };

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

        <div className="flex w-full p-4 gap-4">
          <StatsCard title="Monthly Expense" amount={montlyExpense} />
          <StatsCard title="Active Subscription" amount={12} />
          <StatsCard title="Next Payment" amount={29.99} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import SubscriptionList from "@/components/SubscriptionCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Icon, Music2 } from "lucide-react";

const SubscriptionCard = () => (
  <div className="flex items-center w-1/2 ml-2 justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
    <div className="flex items-center space-x-4">
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900">
        <Music2 className="w-6 h-6 text-blue-500" />
      </div>
      <div>
        <h3 className="font-medium">{"Spotify"}</h3>
        <p className="text-sm text-gray-500">{"Music"}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium">₹{119}/mo</p>
    </div>
  </div>
);

export default SubscriptionCard;

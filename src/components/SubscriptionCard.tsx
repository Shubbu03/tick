"use client";

import { Icon, Music2, Dot, Repeat, Circle } from "lucide-react";

export interface SubscriptionCardProps {
  title: string;
  category: string;
  monthlyPrice: number;
  isActive: boolean;
  isRecurring: boolean;
}

const SubscriptionCard = ({
  title,
  category,
  monthlyPrice,
  isActive,
  isRecurring,
}: SubscriptionCardProps) => (
  <div className="flex items-center ml-4 mr-4 justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow mb-4">
    <div className="flex items-center space-x-4">
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900">
        <Music2 className="w-6 h-6 text-blue-500" />
      </div>
      <div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500 font-light">{category}</p>
      </div>
    </div>
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-center space-x-2">
        {isActive && <Circle className="w-4 h-4 text-green-500 fill-current" />}
        {isRecurring && <Repeat className="w-4 h-4 text-gray-500" />}
      </div>
      <p className="font-medium">₹{monthlyPrice}/mo</p>
    </div> 
  </div>
);

export default SubscriptionCard;

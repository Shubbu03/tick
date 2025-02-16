"use client";

import { SubscriptionCategory } from "@/lib/enums";
import { SubscriptionCardProps } from "@/lib/interfaces";
import {
  Music2,
  Tv,
  Dumbbell,
  GraduationCap,
  Newspaper,
  Gamepad,
  Cloud,
  Briefcase,
  ShoppingCart,
  Circle,
  Repeat,
} from "lucide-react";

const getCategoryIcon = (category: SubscriptionCategory) => {
  switch (category) {
    case SubscriptionCategory.Music:
      return Music2;
    case SubscriptionCategory.OTT:
      return Tv;
    case SubscriptionCategory.Fitness:
      return Dumbbell;
    case SubscriptionCategory.Education:
      return GraduationCap;
    case SubscriptionCategory.News:
      return Newspaper;
    case SubscriptionCategory.Gaming:
      return Gamepad;
    case SubscriptionCategory.CloudStorage:
      return Cloud;
    case SubscriptionCategory.Productivity:
      return Briefcase;
    case SubscriptionCategory.ECommerce:
      return ShoppingCart;
    default:
      return Music2;
  }
};

const SubscriptionCard = ({
  name,
  category,
  price,
  isActive,
  autoRenew,
  planDuration,
  dueDate,
  onSubscriptionPage,
}: SubscriptionCardProps) => {
  const CategoryIcon = getCategoryIcon(category as SubscriptionCategory);

  return (
    <div className="flex items-center ml-4 mr-4 justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow mb-4 transition-all duration-200 border border-transparent hover:border-gray-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-[0.5rem] bg-blue-50 dark:bg-blue-900">
          <CategoryIcon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-sm text-gray-500 font-light">
            {category} | {planDuration}
          </p>
        </div>
      </div>
      {!onSubscriptionPage ? (
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            {isActive && (
              <Circle className="w-4 h-4 text-green-500 fill-current" />
            )}
            {autoRenew && <Repeat className="w-4 h-4 text-gray-500" />}
          </div>
          <p className="font-medium">₹{price}/mo</p>
        </div>
      ) : (
        <div className="flex items-baseline space-y-2">
          <p className="text-sm text-gray-500">Next payment: {dueDate}</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;

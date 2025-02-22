import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: string | number;
    timeframe: string;
    trend: "up" | "down";
  };
  className?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  change,
  className,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={`${className} w-full transition-colors duration-200 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700`}
      >
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold dark:text-white transition-colors">
                {value}
              </p>
              <div className="flex items-center gap-1">
                {change.trend === "up" ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
                )}
                <span
                  className={`text-sm ${
                    change.trend === "up"
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {change.value} {change.timeframe}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 transition-colors">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CategoryDistributionProps } from "@/lib/interfaces";

const CategoryDistribution = ({ data }: CategoryDistributionProps) => {
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const getBarColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-teal-600 dark:bg-teal-500";
      case 1:
        return "bg-cyan-500 dark:bg-cyan-400";
      case 2:
        return "bg-blue-500 dark:bg-blue-400";
      default:
        return "bg-emerald-500 dark:bg-emerald-400";
    }
  };

  return (
    <Card className="w-full dark:border-white rounded-xl">
      <CardHeader>
        <CardTitle className="dark:text-white">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm dark:text-gray-300">
                <span>{category.name}</span>
                <span>{category.percentage.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-2 rounded-full ${getBarColor(index)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;

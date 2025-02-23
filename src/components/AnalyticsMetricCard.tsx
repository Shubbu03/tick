import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: string | number;
    timeframe: string;
    trend: "up" | "down";
  };
}

const MetricCard = ({ title, value, icon, change }: MetricCardProps) => {
  return (
    <Card className="flex-1 rounded-xl bg-gray-50 dark:bg-card shadow-[2px_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_8px_rgba(0,0,0,0.2)] overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-lg text-muted-foreground">
            {title}
          </CardTitle>
          <div className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-700">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-col space-y-1">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="flex items-center gap-1">
            {change.trend === "up" ? (
              <ArrowUpIcon className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
            ) : (
              <ArrowDownIcon className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
            )}
            <span
              className={`text-xs ${
                change.trend === "up"
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {change.value} {change.timeframe}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

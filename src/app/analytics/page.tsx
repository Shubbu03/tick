"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Clipboard, BarChart3, IndianRupee } from "lucide-react";
import MetricCard from "@/components/AnalyticsMetricCard";
import MonthlySpendingChart from "@/components/MonthlySpendingChart";
import CategoryDistribution from "@/components/CategotyDistribution";
import { formatCurrency, formatPercentage } from "@/lib/analytics";
import type { AnalyticsData } from "@/types/analytics";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Analytics() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/analytics");

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-gray-900">
        <div className="text-center space-y-2">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    totalSpent,
    totalSpentChange,
    activeSubscriptions,
    activeSubscriptionsChange,
    averageCost,
    averageCostChange,
    monthlySpending,
    categoryDistribution,
  } = data;

  const metrics = [
    {
      title: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: (
        <IndianRupee className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      ),
      change: {
        value: formatPercentage(totalSpentChange),
        timeframe: "from last year",
        trend: totalSpentChange >= 0 ? ("up" as "up") : ("down" as "down"),
      },
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions,
      icon: <Clipboard className="w-6 h-6 text-gray-600 dark:text-gray-300" />,
      change: {
        value: Math.abs(activeSubscriptionsChange),
        timeframe: "from last month",
        trend:
          activeSubscriptionsChange >= 0 ? ("up" as "up") : ("down" as "down"),
      },
    },
    {
      title: "Average Cost",
      value: formatCurrency(averageCost),
      icon: <BarChart3 className="w-6 h-6 text-gray-600 dark:text-gray-300" />,
      change: {
        value: formatCurrency(Math.abs(averageCostChange)),
        timeframe: "from last month",
        trend: averageCostChange >= 0 ? ("up" as "up") : ("down" as "down"),
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="space-y-4 p-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Analytics Overview
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Track your subscription spending patterns
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="space-y-4">
          <div className="w-full">
            <MonthlySpendingChart data={monthlySpending} />
          </div>
          <div className="w-full">
            <CategoryDistribution data={categoryDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}

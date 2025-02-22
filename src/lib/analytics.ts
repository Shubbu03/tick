import { MonthlySpendingData, CategoryDistributionData } from "@/types/analytics";
import { Subscription } from "./interfaces";

/**
 * Formats a number as currency in USD
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  options: {
    decimals?: number;
    includeSymbol?: boolean;
  } = {}
): string => {
  const { decimals = 2, includeSymbol = true } = options;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(amount);
  return includeSymbol ? formatted : formatted.replace("$", "");
};

/**
 * Formats a number as a percentage
 * @param value - The value to format as percentage
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculates the percentage change between two numbers
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Groups subscriptions by month and calculates total spending
 * @param subscriptions - Array of subscriptions
 * @returns Monthly spending data
 */
export const calculateMonthlySpending = (
  subscriptions: Subscription[]
): MonthlySpendingData[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentMonth = new Date().getMonth();

  return months.map((month, index) => {
    const monthlySubscriptions = subscriptions.filter((sub) => {
      const subscriptionMonth = new Date(sub.startDate).getMonth();
      return subscriptionMonth === index;
    });

    const amount = monthlySubscriptions.reduce(
      (total, sub) => total + sub.price,
      0
    );

    return {
      month,
      amount,
      isCurrentMonth: index === currentMonth,
    };
  });
};

/**
 * Calculates the distribution of subscriptions across categories
 * @param subscriptions - Array of subscriptions
 * @returns Category distribution data
 */
export const calculateCategoryDistribution = (
  subscriptions: Subscription[]
): CategoryDistributionData[] => {
  const categoryTotals = subscriptions.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + sub.price;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
  }));
};

/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

/**
 * Checks if a subscription is active based on due date
 * @param subscription - Subscription to check
 * @returns Boolean indicating if subscription is active
 */
export const isSubscriptionActive = (subscription: Subscription): boolean => {
  const now = new Date();
  const dueDate = new Date(subscription.dueDate);
  return subscription.isActive && dueDate > now;
};

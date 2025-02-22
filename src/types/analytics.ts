export interface MonthlySpendingData {
  month: string;
  amount: number;
  isCurrentMonth: boolean;
}

export interface CategoryDistributionData {
  name: string;
  percentage: number;
}

export interface AnalyticsData {
  totalSpent: number;
  totalSpentChange: number;

  activeSubscriptions: number;
  activeSubscriptionsChange: number;

  averageCost: number;
  averageCostChange: number;

  monthlySpending: MonthlySpendingData[];
  categoryDistribution: CategoryDistributionData[];
}

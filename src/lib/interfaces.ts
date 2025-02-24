import mongoose from "mongoose";
import { PlanType, SubscriptionCategory } from "./enums";

export interface Subscription extends Document {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  planSelected: string;
  planDuration: PlanType;
  price: number;
  startDate: Date;
  dueDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  category: SubscriptionCategory;
  paymentHistory: [
    {
      amount: number;
      date: Date;
      status: string;
    }
  ];
}

export interface User extends Document {
  _id?: mongoose.Types.ObjectId | string;
  username: string;
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  monthlyExpense: number;
  subscription: [Subscription];
}

export interface UserSubscription {
  _id: string;
  name: string;
  planSelected: string;
  planDuration: string;
  price: number;
  startDate: string;
  dueDate: string;
  isActive: boolean;
  autoRenew: boolean;
  category: string;
}

export interface AddSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (formData: any) => void;
}

export interface CardProps {
  title: string;
  amount: number;
  isMoney?: boolean;
  date?: Date | null;
}

export interface SubscriptionCardProps {
  _id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  autoRenew: boolean;
  planDuration: string;
  dueDate: string;
  onSubscriptionPage?: boolean;
  onClick?: (id: string) => void;
}

export interface MonthlySpendingData {
  month: string;
  amount: number;
  isCurrentMonth?: boolean;
}

export interface MonthlySpendingChartProps {
  data: MonthlySpendingData[];
}

export interface CategoryData {
  name: string;
  percentage: number;
}

export interface CategoryDistributionProps {
  data: CategoryData[];
}

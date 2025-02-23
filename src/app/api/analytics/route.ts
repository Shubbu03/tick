import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { AnalyticsData } from "@/types/analytics";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const currentYear = new Date().getFullYear();
    const subscriptionsThisYear = user.subscription.filter(
      (sub) => new Date(sub.startDate).getFullYear() === currentYear
    );
    const totalSpent = subscriptionsThisYear.reduce(
      (acc, sub) => acc + sub.price,
      0
    );

    const lastYear = currentYear - 1;
    const subscriptionsLastYear = user.subscription.filter(
      (sub) => new Date(sub.startDate).getFullYear() === lastYear
    );
    const totalSpentLastYear = subscriptionsLastYear.reduce(
      (acc, sub) => acc + sub.price,
      0
    );
    const totalSpentChange =
      totalSpentLastYear === 0
        ? 0
        : ((totalSpent - totalSpentLastYear) / totalSpentLastYear) * 100;

    const activeSubscriptions = user.subscription.filter(
      (sub) => sub.isActive
    ).length;
    const activeSubscriptionsLastMonth = user.subscription.filter(
      (sub) =>
        sub.isActive &&
        new Date(sub.startDate) <=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    const activeSubscriptionsChange =
      activeSubscriptions - activeSubscriptionsLastMonth;

    const averageCost =
      activeSubscriptions > 0 ? totalSpent / activeSubscriptions : 0;
    const averageCostLastMonth =
      activeSubscriptionsLastMonth > 0
        ? totalSpentLastYear / activeSubscriptionsLastMonth
        : 0;
    const averageCostChange = averageCost - averageCostLastMonth;

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

    const monthlySpending = months.map((month, index) => {
      const monthlyTotal = user.subscription
        .filter((sub) => new Date(sub.startDate).getMonth() === index)
        .reduce((acc, sub) => acc + sub.price, 0);

      return {
        month,
        amount: monthlyTotal,
        isCurrentMonth: index === currentMonth,
      };
    });

    const categoryTotals = user.subscription.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.price;
      return acc;
    }, {} as Record<string, number>);

    const totalAmount = Object.values(categoryTotals).reduce(
      (a, b) => a + b,
      0
    );

    const categoryDistribution = Object.entries(categoryTotals).map(
      ([name, amount]) => ({
        name,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      })
    );

    const analyticsData: AnalyticsData = {
      totalSpent,
      totalSpentChange,
      activeSubscriptions,
      activeSubscriptionsChange,
      averageCost,
      averageCostChange,
      monthlySpending,
      categoryDistribution,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

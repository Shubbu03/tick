import type { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  try {
    const { userId } = params;
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return Response.json(
        { success: false, message: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const [userWithSubscription] = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          subscription: {
            $filter: {
              input: "$subscription",
              as: "sub",
              cond: {
                $eq: ["$$sub._id", new mongoose.Types.ObjectId(subscriptionId)],
              },
            },
          },
          monthlyExpense: 1,
          allSubscriptions: "$subscription",
        },
      },
    ]);

    if (!userWithSubscription) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!userWithSubscription.subscription.length) {
      return Response.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    const subscriptionToRemove = userWithSubscription.subscription[0];

    const monthlyDivisors: { [key: string]: number } = {
      Yearly: 12,
      Half_Yearly: 6,
      Quarterly: 3,
      Monthly: 1,
    };

    const divisor = monthlyDivisors[subscriptionToRemove.planDuration] || 1;
    const monthlyReduction = Number(
      (subscriptionToRemove.price / divisor).toFixed(2)
    );

    const remainingSubscriptions = userWithSubscription.allSubscriptions.filter(
      (sub: { _id: { toString: () => any } }) =>
        sub._id.toString() !== subscriptionId
    );

    const newMonthlyExpense = remainingSubscriptions.reduce(
      (
        total: number,
        sub: { planDuration: string | number; price: number }
      ) => {
        const subDivisor = monthlyDivisors[sub.planDuration] || 1;
        return total + sub.price / subDivisor;
      },
      0
    );

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          monthlyExpense: Number(newMonthlyExpense.toFixed(2)),
          subscription: remainingSubscriptions,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update user" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Subscription deleted successfully",
        data: {
          subscription: updatedUser.subscription,
          monthlyExpense: updatedUser.monthlyExpense,
          deletedAmount: monthlyReduction,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return Response.json(
      { success: false, message: "Error deleting subscription" },
      { status: 500 }
    );
  }
}

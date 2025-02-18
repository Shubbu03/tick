import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "@/lib/interfaces";
import mongoose, { mongo, ObjectId } from "mongoose";

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json(
        { success: false, message: "Invalid user ID provided" },
        { status: 400 }
      );
    }

    const {
      name,
      _id: subscriptionId,
      planSelected,
      planDuration,
      price,
      dueDate,
      category,
      isActive,
      autoRenew,
    } = await request.json();

    if (
      !name ||
      !subscriptionId ||
      !planSelected ||
      !planDuration ||
      !price ||
      !dueDate ||
      !category
    ) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const subscriptionIndex = user.subscription.findIndex(
      (sub) => sub._id?.toString() === subscriptionId
    );

    if (subscriptionIndex === -1) {
      return Response.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    const oldSubscription = user.subscription[subscriptionIndex];
    const oldMonthlyPrice = calculateMonthlyPrice(
      oldSubscription.price,
      oldSubscription.planDuration
    );
    const newMonthlyPrice = calculateMonthlyPrice(price, planDuration);

    const currentMonthlyExpense = Number(user.monthlyExpense || 0);
    const updatedMonthlyExpense = Number(
      (currentMonthlyExpense - oldMonthlyPrice + newMonthlyPrice).toFixed(2)
    );

    user.subscription[subscriptionIndex] = {
      _id: oldSubscription._id,
      name,
      category,
      planSelected: planSelected || oldSubscription.planSelected,
      planDuration,
      price,
      dueDate,
      isActive: isActive ?? oldSubscription.isActive,
      autoRenew: autoRenew ?? oldSubscription.autoRenew,
      paymentHistory: oldSubscription.paymentHistory,
      startDate: oldSubscription.startDate,
    } as any;

    user.monthlyExpense = updatedMonthlyExpense;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Subscription updated successfully",
        data: user,
        updatedMonthlyExpense,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating subscription:", error);
    return Response.json(
      { success: false, message: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

function calculateMonthlyPrice(price: number, planDuration: string): number {
  switch (planDuration) {
    case "Yearly":
      return price / 12;
    case "Half_Yearly":
      return price / 6;
    case "Quarterly":
      return price / 3;
    default: // Monthly
      return price;
  }
}

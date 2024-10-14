import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import mongoose, { mongo, ObjectId } from "mongoose";

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      id: searchParams.get("id"),
    };

    const { name, subscriptionId, planSelected, planDuration, price, dueDate } =
      await request.json();

    const userId = new mongoose.Types.ObjectId(queryParam.id);

    const user = await UserModel.findOne({
      _id: userId,
    });

    if (!user) {
      console.log("Unable to edit user subscription!!");
      return Response.json(
        {
          success: false,
          message: "Unable to edit user subscription!!",
        },
        { status: 401 }
      );
    }

    const subscriptionIndex = user.subscription.findIndex(
      (sub) => sub._id.toString() === subscriptionId
    );

    if (subscriptionIndex === -1) {
      return Response.json(
        {
          success: false,
          message: "Subscription not found!!",
        },
        { status: 404 }
      );
    }

    let monthlyExpense = parseFloat(user.monthlyExpense || "0");
    const oldSubscription = user.subscription[subscriptionIndex];
    const oldMonthlyPrice = calculateMonthlyPrice(
      oldSubscription.price,
      oldSubscription.planDuration
    );
    const newMonthlyPrice = calculateMonthlyPrice(price, planDuration);

    // Update monthly expense
    monthlyExpense = monthlyExpense - oldMonthlyPrice + newMonthlyPrice;

    // Update the subscription
    user.subscription[subscriptionIndex] = {
      name,
      planSelected,
      planDuration,
      price,
      dueDate,
      isActive: true,
    };

    // Update the user's monthly expense
    user.monthlyExpense = monthlyExpense.toFixed(2);

    await user.save();

    return Response.json(
      {
        data: user,
        success: true,
        message: "User subscription edited!!",
        updatedMonthlyExpense: user.monthlyExpense,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error editing subscription details!!", err);
    return Response.json(
      { success: false, message: "Error editing subscription details!!" },
      { status: 400 }
    );
  }
}

function calculateMonthlyPrice(price: string, planDuration: string): number {
  const numericPrice = parseFloat(price);
  switch (planDuration) {
    case "Yearly":
      return numericPrice / 12;
    case "Half_Yearly":
      return numericPrice / 6;
    case "Quaterly":
      return numericPrice / 3;
    default: // Monthly
      return numericPrice;
  }
}

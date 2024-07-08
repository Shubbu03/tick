import dbConnect from "@/lib/dbConnect";
import UserModel, { Subscription } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, name, planSelected, planDuration, price, dueDate } =
      await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found!!" },
        { status: 404 }
      );
    }
    if (price <= 0) {
      return Response.json(
        {
          success: false,
          message: "Subscription Price can't be zero!!",
        },
        { status: 403 }
      );
    }

    const newSubscription = {
      name,
      planSelected,
      planDuration,
      price,
      dueDate,
      isActive: true,
    };

    user.subscription.push(newSubscription as unknown as Subscription);

    if (newSubscription.planDuration === "Yearly") {
      user.monthlyExpense += newSubscription.price / 12;
    } else if (newSubscription.planDuration === "Half_Yearly") {
      user.monthlyExpense += newSubscription.price / 6;
    } else if (newSubscription.planDuration === "Quaterly") {
      user.monthlyExpense += newSubscription.price / 3;
    } else {
      user.monthlyExpense += newSubscription.price;
    }

    await user.save();

    return Response.json(
      { data: user, success: true, message: "New subscription added!!" },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error occured while adding new subscription!!", err);
    return Response.json(
      {
        success: false,
        message: "Error occured while adding new subscription!!",
      },
      { status: 400 }
    );
  }
}

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

    await user.save();

    return Response.json(
      { success: true, message: "New subscription added!!" },
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

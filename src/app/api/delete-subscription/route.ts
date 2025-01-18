import dbConnect from "@/lib/dbConnect";
import UserModel, { Subscription } from "@/model/User";

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      id: searchParams.get("id"),
    };

    const { subscriptionId } = await request.json();

    const user = await UserModel.findById(queryParam.id);

    if (!user) {
      throw new Error("User not found");
    }

    const removeExpense = user.subscription.filter(
      (sub) => sub.id === subscriptionId
    );

    if (removeExpense[0].planDuration === "Yearly") {
      user.monthlyExpense -= removeExpense[0].price / 12;
    } else if (removeExpense[0].planDuration === "Half_Yearly") {
      user.monthlyExpense -= removeExpense[0].price / 6;
    } else if (removeExpense[0].planDuration === "Quarterly") {
      user.monthlyExpense -= removeExpense[0].price / 3;
    } else {
      user.monthlyExpense -= removeExpense[0].price;
    }

    const data = user.subscription.filter((sub) => sub.id !== subscriptionId);

    user.subscription = data as [Subscription];

    await user.save();

    if (!user) {
      return Response.json(
        { success: false, message: "Cannot delete user subscription" },
        { status: 400 }
      );
    }

    if (user.subscription.length <= 0) {
      return Response.json(
        { success: false, message: "No subscription to delete!!" },
        { status: 400 }
      );
    }
    return Response.json(
      {
        data: user.subscription,
        success: true,
        message: "User subscription deleted!!",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error deleting user subscription!!", err);
    return Response.json(
      { success: false, message: "Error deleting user subscription!!" },
      { status: 401 }
    );
  }
}

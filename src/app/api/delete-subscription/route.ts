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
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.subscription || user.subscription.length <= 0) {
      return Response.json(
        { success: false, message: "No subscription to delete!" },
        { status: 400 }
      );
    }

    const subscriptionToRemove = user.subscription.find(
      (sub) => sub.id === subscriptionId
    );

    if (!subscriptionToRemove) {
      return Response.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    const monthlyDivisors = {
      Yearly: 12,
      Half_Yearly: 6,
      Quarterly: 3,
      Monthly: 1,
    };

    const divisor = monthlyDivisors[subscriptionToRemove.planDuration] || 1;
    user.monthlyExpense -= subscriptionToRemove.price / divisor;

    user.subscription = user.subscription.filter(
      (sub) => sub.id !== subscriptionId
    ) as [Subscription];

    await user.save();

    return Response.json(
      {
        data: user.subscription,
        success: true,
        message: "User subscription deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting user subscription:", err);
    return Response.json(
      { success: false, message: "Error deleting user subscription" },
      { status: 500 }
    );
  }
}

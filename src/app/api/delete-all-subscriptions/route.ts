import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      id: searchParams.get("id"),
    };

    if (!queryParam.id) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(queryParam.id);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.subscription.splice(0, user.subscription.length);
    user.monthlyExpense = 0;
    await user.save();

    return Response.json(
      {
        data: user.subscription,
        success: true,
        message: "All user subscriptions deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting user subscriptions:", err);
    return Response.json(
      { success: false, message: "Error deleting user subscriptions" },
      { status: 500 }
    );
  }
}

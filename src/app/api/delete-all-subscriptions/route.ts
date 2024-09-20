import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      id: searchParams.get("id"),
    };

    const user = await UserModel.findById(queryParam.id);

    if (!user) {
      throw new Error("User not found");
    }

    const emptySubs = user.subscription.splice(0, user.subscription.length);

    if (!emptySubs) {
      return Response.json(
        { success: false, message: "Error deleting subscriptions!!" },
        { status: 400 }
      );
    }

    user.monthlyExpense = 0;

    await user.save();

    if (!user) {
      return Response.json(
        { success: false, message: "Cannot delete user subscription" },
        { status: 400 }
      );
    }

    return Response.json(
      {
        data: user.subscription,
        success: true,
        message: "All User subscriptions deleted!!",
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

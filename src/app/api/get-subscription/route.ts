import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const currentUser: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User not logged in!!" },
      { status: 401 }
    );
  }

  if (!currentUser._id) {
    return Response.json(
      { success: false, message: "Invalid user ID" },
      { status: 400 }
    );
  }

  const userId = new mongoose.Types.ObjectId(currentUser._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$subscription" },
      { $sort: { "subscription.price": -1 } },
      { $group: { _id: "$_id", subscription: { $push: "$subscription" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found!!" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, subscription: user[0].subscription },
      { status: 200 }
    );
  } catch (err) {
    console.error("Subscription fetch error:", err);
    return Response.json(
      {
        success: false,
        message: "Error fetching user subscription!!",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

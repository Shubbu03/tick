import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const currentUser = session?.user;

  if (!session || !currentUser) {
    return Response.json(
      { success: false, message: "User not logged in!" },
      { status: 401 }
    );
  }

  if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
    return Response.json(
      { success: false, message: "Invalid subscription ID" },
      { status: 400 }
    );
  }

  const subscriptionId = new mongoose.Types.ObjectId(params.id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(currentUser._id),
          "subscription._id": subscriptionId,
        },
      },
      { $unwind: "$subscription" },
      { $match: { "subscription._id": subscriptionId } },
      {
        $project: {
          subscription: 1,
          _id: 0,
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "Subscription not found!" },
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
        message: "Error fetching subscription!",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

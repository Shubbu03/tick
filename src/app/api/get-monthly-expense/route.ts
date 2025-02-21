import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "@/lib/interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

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

  try {
    const user = await UserModel.findById(currentUser._id);
    const expense = user?.monthlyExpense;

    if (expense === undefined || expense === null) {
      return Response.json(
        {
          success: false,
          message: "Error fetching user's monthly expense!! Please try again",
          data: expense,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        data: expense,
        success: true,
        message:
          expense === 0
            ? "Add subscription to view monthly expense"
            : "User's monthly expense fetched successfully!!",
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { success: false, message: "Error fetching user's monthly expense!!" },
      { status: 400 }
    );
  }
}

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    const validateIdentifier = await UserModel.findOne({ email });

    if (!validateIdentifier) {
      return Response.json(
        {
          success: false,
          message: "User with given email not found!! Please Signup first",
        },
        { status: 404 }
      );
    }

    const correctPassword = await bcrypt.compare(
      password,
      validateIdentifier.password
    );

    if (!correctPassword) {
      return Response.json(
        { success: false, message: "Incorrect password!! Please try again" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "User Logged In!!" },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error occured while login!!", err);
    return Response.json(
      { success: false, message: "Error occured while login!!" },
      { status: 400 }
    );
  }
}

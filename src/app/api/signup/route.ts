import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const validateExistingUsername = await UserModel.findOne({
      username,
    });

    if (validateExistingUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const validateExistingEmail = await UserModel.findOne({ email });

    if (validateExistingEmail) {
      return Response.json(
        {
          success: false,
          message: "Email is already taken",
        },
        { status: 400 }
      );
    }

    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      monthlyExpense: 0,
      subscription: [],
    });

    console.log("User::",user)
    await user.save();

    return Response.json(
      { success: true, message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error signing up user!!", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user!!",
      },
      { status: 500 }
    );
  }
}

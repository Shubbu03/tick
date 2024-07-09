import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(",")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUsername = await UserModel.findOne({
      username,
    });

    if (existingVerifiedUsername) {
      return Response.json(
        { success: false, message: "Username is already taken!!" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available!!" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { success: false, message: "Error verifying unique username!!" },
      { status: 500 }
    );
  }
}

import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import mongoose, { mongo, ObjectId } from "mongoose";

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      id: searchParams.get("id"),
    };

    const { subscriptionId, planSelected, planDuration, price, dueDate } =
      await request.json();

    // const user = await UserModel.findById(queryParam.id);

    // console.log("id::", user);
    // const query = { id: queryParam.id, "subscription._id": subscriptionId };

    // console.log("Query:", query);

    // const user = await UserModel.findOne(query?.id).findOne(query["subscription._id"])

    // console.log(user)

    // const user = await UserModel.findById(queryParam.id);

    // const data = user?.subscription.filter((sub) => sub.id === subscriptionId);

    const userId = new mongoose.Types.ObjectId(queryParam.id as string);

    // const user = await UserModel.updateOne(
    //   // { id: queryParam.id, "subscription._id": subscriptionId },
    //   { id: queryParam.id , "subscription[1]._id": subscriptionId},
    //   {
    //     $set: {
    //       planSelected: planSelected,
    //       planDuration: planDuration,
    //       price: price,
    //       dueDate: dueDate,
    //     },
    //   }
    // );

    const user = await UserModel.findById({
      // id: queryParam.id,
      id: userId,
      "subscription[1]._id": subscriptionId,
    });
    console.log("id::", user);

    // const editField = user?.subscription.filter(
    //   (sub) => sub.id === subscriptionId
    // );

    // console.log("user:", editField);

    if (!user) {
      console.log("Unable to edit user subscription!!");
      return Response.json(
        {
          data: user,
          success: false,
          message: "Unable to edit user subscription!!",
        },
        { status: 401 }
      );
    }

    return Response.json(
      { data: user, success: true, message: "User subscription edited!!" },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error editing subscription details!!", err);
    return Response.json(
      { success: false, message: "Error editing subscription details!!" },
      { status: 400 }
    );
  }
}

import dbConnect from "@/lib/dbConnect";
import UserModel, {
  Subscription,
  PlanType,
  SubscriptionCategory,
} from "@/model/User";
import { z } from "zod";

const subscriptionSchema = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Subscription name is required"),
  planSelected: z.string().min(1, "Plan selection is required"),
  planDuration: z.nativeEnum(PlanType),
  price: z.number().positive("Price must be positive"),
  dueDate: z.string().datetime("Invalid date format"),
  autoRenew: z.boolean().default(false),
  category: z.nativeEnum(SubscriptionCategory),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    const validatedData = subscriptionSchema.parse(body);

    const user = await UserModel.findOne({ username: validatedData.username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const getMonthlyExpense = (price: number, duration: PlanType): number => {
      const durationMap = {
        [PlanType.Yearly]: 12,
        [PlanType.Half_Yearly]: 6,
        [PlanType.Quarterly]: 3,
        [PlanType.Monthly]: 1,
      };
      return price / durationMap[duration];
    };

    const newSubscription = {
      name: validatedData.name,
      planSelected: validatedData.planSelected,
      planDuration: validatedData.planDuration,
      price: validatedData.price,
      startDate: new Date(),
      dueDate: new Date(validatedData.dueDate),
      isActive: true,
      autoRenew: validatedData.autoRenew,
      category: validatedData.category,
      paymentHistory: [
        {
          amount: validatedData.price,
          date: new Date(),
          status: "success" as const,
        },
      ],
    };

    if (newSubscription.dueDate <= newSubscription.startDate) {
      return Response.json(
        { success: false, message: "Due date must be in the future" },
        { status: 400 }
      );
    }

    user.subscription.push(newSubscription as unknown as Subscription);
    user.monthlyExpense += getMonthlyExpense(
      newSubscription.price,
      newSubscription.planDuration as PlanType
    );

    await user.save();

    return Response.json(
      {
        data: {
          subscription: newSubscription,
          monthlyExpense: user.monthlyExpense,
        },
        success: true,
        message: "Subscription added successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Subscription creation error:", err);

    if (err instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          message: "Invalid input data",
          errors: err.errors,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to add subscription",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

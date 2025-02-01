import mongoose, { Schema, Document } from "mongoose";

export enum PlanType {
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  Half_Yearly = "Half_Yearly",
  Yearly = "Yearly",
}

export enum SubscriptionCategory {
  Music = "Music",
  OTT = "OTT",
  Fitness = "Fitness",
  Education = "Education",
  News = "News",
  Gaming = "Gaming",
  CloudStorage = "Cloud Storage",
  Productivity = "Productivity",
  ECommerce = "E-Commerce",
}

export interface Subscription extends Document {
  name: string;
  planSelected: string;
  planDuration: PlanType;
  price: number;
  startDate: Date;
  dueDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  category: SubscriptionCategory;
  paymentHistory: [
    {
      amount: number;
      date: Date;
      status: string;
    }
  ];
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  monthlyExpense: number;
  subscription: [Subscription];
}

const subscriptionSchema: Schema<Subscription> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    planSelected: {
      type: String,
      required: true,
    },
    planDuration: {
      type: String,
      enum: Object.values(PlanType),
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    autoRenew: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: String,
      enum: Object.values(SubscriptionCategory),
      required: true,
    },
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        status: {
          type: String,
          enum: ["success", "failed", "pending"],
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!!"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!!"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address!!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!!"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification Code is required!!"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification Code Expiry is required!!"],
  },
  monthlyExpense: {
    type: Number,
    required: true,
    default: 0,
  },
  subscription: [subscriptionSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;

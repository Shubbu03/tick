import mongoose, { Schema, Document } from "mongoose";

enum planType {
  Monthly = "Monthly",
  Quaterly = "Quaterly",
  Half_Yearly = "Half_Yearly",
  Yearly = "Yearly"
}

export interface Subscription extends Document {
  name: string;
  planSelected: string;
  planDuration : planType
  price: number;
  dueDate: Date;
  isActive: Boolean;
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

const subscriptionSchema: Schema<Subscription> = new Schema({
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
    enum: Object.values(planType),
  },
  price: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    required: false,
    default: false,
  },
});

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
    default: 0
  },
  subscription: [subscriptionSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;

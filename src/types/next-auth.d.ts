import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      monthlyExpense: number;
      username?: string;
      name?: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    monthlyExpense: number;
    username?: string;
    name?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    monthlyExpense: number;
    username?: string;
    name?: string;
    image?: string;
  }
}

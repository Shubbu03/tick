import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email!!");
          }

          const correctPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (correctPassword) {
            return user;
          } else {
            throw new Error("Incorrect password!!");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.monthlyExpense = token.monthlyExpense;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id?.toString();
        token.monthlyExpense = user.monthlyExpense;
        token.username = user.username;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      if (trigger === "update" && session) {
        if (session._id) token._id = session._id;
        if (session.monthlyExpense !== undefined)
          token.monthlyExpense = session.monthlyExpense;
        if (session.username) token.username = session.username;
        if (session.email) token.email = session.email;
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

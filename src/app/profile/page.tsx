"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/userInitials";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";

export default function Profile() {
  const { data: session, update } = useSession();
  const user = session?.user;
  const userID = user?._id;
  const userInitials = getInitials(user?.username);

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const { username, name, email } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "username") {
      setUsernameMessage("");
    }
  };

  const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `/api/check-username?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError;
        setUsernameMessage("Username already exists, try another");
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  useEffect(() => {
    if (username !== user?.username) {
      const timer = setTimeout(() => {
        checkUsernameUnique();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [username, user?.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      usernameMessage === "Username already exists, try another" ||
      isCheckingUsername
    ) {
      toast({
        title: "Invalid username",
        description: "Please choose a unique username.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put("/api/update-profile", formData);

      if (response.data.success) {
        await axios.post("/api/refresh-session");
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          variant: "default",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = "An unexpected error occurred";

      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="space-y-4 p-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            User Profile
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="mt-8 flex items-center">
          <Avatar className="h-48 w-48">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-medium">
              {user?.image ? user.image : userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              className="rounded-xl"
              value={formData.username}
              onChange={handleChange}
            />
            {usernameMessage && (
              <p
                className={`text-sm mt-1 ${
                  usernameMessage.includes("exists")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {usernameMessage}
              </p>
            )}
            {isCheckingUsername && (
              <p className="text-sm text-gray-500 mt-1">Checking username...</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Full name"
              className="rounded-xl"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              className="rounded-xl"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="outline"
              className="gap-2 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-300 dark:bg-teal-800 dark:hover:bg-teal-700 dark:text-teal-100 dark:border-teal-600"
              disabled={isLoading || isCheckingUsername}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

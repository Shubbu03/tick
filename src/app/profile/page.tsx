"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/userInitials";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileImage, setProfileImage] = useState(user?.image || "");
  const [imageError, setImageError] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
      });

      setProfileImage(user.image || "");
      setImageError(false);
    }
  }, [user]);

  const { username, name, email } = formData;
  const { currentPassword, newPassword, confirmPassword } = passwordData;

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
    setPasswordError("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, JPEG or PNG images.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userID as string);

      const response = await axios.post("/api/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        await update({
          image: response.data.imageUrl,
        });

        setProfileImage(response.data.imageUrl || "");
        setImageError(false);

        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

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
      const submissionData = {
        ...formData,
        ...(currentPassword && newPassword
          ? {
              currentPassword,
              newPassword,
            }
          : {}),
      };

      const response = await axios.put("/api/update-profile", submissionData);

      if (response.data.success) {
        await update({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          _id: userID,
          monthlyExpense: user?.monthlyExpense,
          image: profileImage,
        });

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast({
          title: "Profile updated",
          description: response.data.passwordChanged
            ? "Your profile and password have been updated successfully."
            : "Your profile has been updated successfully.",
          variant: "default",
        });
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
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
            onClick={handleAvatarClick}
          >
            <Avatar className="h-48 w-48 cursor-pointer transition-opacity duration-200 hover:opacity-80">
              {profileImage && !imageError ? (
                <AvatarImage
                  src={profileImage}
                  alt={user?.name || "User"}
                  onError={handleImageError}
                />
              ) : null}
              <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            {isHoveringAvatar && (
              <div className="absolute inset-0 flex items-end justify-center rounded-full overflow-hidden">
                <div className="w-full bg-black bg-opacity-60 text-white py-2 text-center text-sm font-medium">
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadingImage}
            />
          </div>

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

          <Accordion type="single" collapsible className="w-full mt-6">
            <AccordionItem value="change-password">
              <AccordionTrigger className="text-gray-900 dark:text-gray-100">
                Change Password
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current password"
                        className="rounded-xl pr-10"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password (8+ characters)"
                        className="rounded-xl pr-10"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="rounded-xl pr-10"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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

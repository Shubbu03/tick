"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  Loader2,
  Edit,
  Trash2,
  IndianRupeeIcon,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

enum PlanDuration {
  Monthly = "Monthly",
  Quaterly = "Quaterly",
  Half_Yearly = "Half_Yearly",
  Yearly = "Yearly",
}

interface Subscription {
  _id: string;
  name: string;
  planSelected: string;
  planDuration: PlanDuration;
  price: number;
  dueDate: string;
  isActive: boolean;
}

const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  planSelected: z.string().min(1, "Plan is required"),
  planDuration: z.nativeEnum(PlanDuration),
  price: z.number().min(0, "Price must be a positive number"),
  dueDate: z.date().optional(),
});

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const [darkMode, setDarkMode] = useState(false);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>(
    []
  );
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<
    string | null
  >(null);

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      planSelected: "",
      planDuration: PlanDuration.Monthly,
      price: 0,
      dueDate: undefined,
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      planSelected: "",
      planDuration: PlanDuration.Monthly,
      price: 0,
      dueDate: undefined,
    });
    setEditingSubscriptionId(null);
  };

  const onSubmit = async (data: z.infer<typeof subscriptionSchema>) => {
    if (editingSubscriptionId) {
      await updateOneSubscription(data);
    } else {
      await addNewSubscription(data);
    }
  };

  const addNewSubscription = async (
    data: z.infer<typeof subscriptionSchema>
  ) => {
    try {
      const response = await axios.post(
        "/api/add-subscription",
        {
          username: user?.username,
          ...data,
          dueDate: data.dueDate?.toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "New Subscription added successfully",
          variant: "default",
        });
        setIsDialogOpen(false);
        viewUserSubscription();
        userMonthlyExpense();
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Error occurred while adding subscription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred!!",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  const viewUserSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-subscription", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setUserSubscriptions(response.data.subscription || []);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setUserSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const userMonthlyExpense = async () => {
    try {
      const response = await axios.get("/api/get-monthly-expense", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMonthlyExpense(response.data.data);
    } catch (error) {
      setMonthlyExpense(0);
    }
  };

  const handleEdit = (subscriptionToEdit: Subscription) => {
    setEditingSubscriptionId(subscriptionToEdit._id);
    form.reset({
      name: subscriptionToEdit.name,
      planSelected: subscriptionToEdit.planSelected,
      planDuration: subscriptionToEdit.planDuration,
      price: subscriptionToEdit.price,
      dueDate: new Date(subscriptionToEdit.dueDate),
    });
    setIsDialogOpen(true);
  };

  const updateOneSubscription = async (
    data: z.infer<typeof subscriptionSchema>
  ) => {
    if (editingSubscriptionId) {
      try {
        const response = await axios.put(
          `/api/edit-subscription?id=${user?._id}`,
          {
            subscriptionId: editingSubscriptionId,
            ...data,
            dueDate: data.dueDate?.toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          toast({
            title: "Success",
            description: response.data.message,
            variant: "default",
          });
          setIsDialogOpen(false);
          viewUserSubscription();
          setMonthlyExpense(parseFloat(response.data.updatedMonthlyExpense));
        } else {
          toast({
            title: "Error",
            description: response.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error occurred!!",
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
    setEditingSubscriptionId(null);
    form.reset();
  };

  const deleteOneSubscription = async (id: string) => {
    try {
      const response = await axios.delete("/api/delete-subscription", {
        params: { id: user?._id },
        data: { subscriptionId: id },
      });

      if (response.data.success) {
        setUserSubscriptions(response.data.data);
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
      userMonthlyExpense();
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  const deleteAllSubscription = async () => {
    try {
      const response = await axios.delete("/api/delete-all-subscriptions", {
        params: { id: user?._id },
      });
      if (response.data.success) {
        setUserSubscriptions(response.data.data);
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
      userMonthlyExpense();
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    viewUserSubscription();
    userMonthlyExpense();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 dark:from-gray-900 dark:to-gray-700">
        <main className="container mx-auto p-4">
          <Card className="mt-8">
            {userSubscriptions.length > 0 ? (
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Subscriptions</CardTitle>
                  <CardDescription>
                    Manage your active subscriptions here.
                  </CardDescription>
                </div>
                <div className="text-right flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-2 transition-colors hover:text-red-500"
                          onClick={deleteAllSubscription}
                          disabled={
                            !userSubscriptions || userSubscriptions.length === 0
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">
                            Delete all subscriptions
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete all subscriptions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div>
                    <CardTitle className="flex items-center">
                      <IndianRupeeIcon className="h-6 w-6 text-muted-foreground mr-2" />
                      Monthly Expense
                    </CardTitle>
                    <p className="text-2xl font-bold">
                      ₹ {monthlyExpense.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>
            ) : (
              <CardHeader>
                <CardTitle>Your Subscriptions</CardTitle>
                <CardDescription>
                  Manage your active subscriptions here.
                </CardDescription>
              </CardHeader>
            )}
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : userSubscriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userSubscriptions.map((subscription) => (
                    <Card key={subscription._id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              subscription.isActive
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <CardTitle className="text-xl font-medium">
                            {subscription.name}
                          </CardTitle>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(subscription)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              deleteOneSubscription(subscription._id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {subscription.planSelected}
                        </CardDescription>
                        <p>Duration: {subscription.planDuration}</p>
                        <p>Price: ₹{subscription.price}</p>
                        {/* <p>
                          Due Date:{" "}
                          {format(new Date(subscription.dueDate), "PPP")}
                        </p> */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Plus className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-xl font-semibold text-gray-600">
                    No Subscriptions present. Add some to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="fixed bottom-8 right-8 rounded-full" size="icon">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubscriptionId
                  ? "Edit Subscription"
                  : "Add New Subscription"}
              </DialogTitle>
              <DialogDescription>
                {editingSubscriptionId
                  ? "Update the details of your subscription here."
                  : "Enter the details of your new subscription here."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="planSelected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="planDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(PlanDuration).map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <Button type="submit">
                  {editingSubscriptionId
                    ? "Update Subscription"
                    : "Add Subscription"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

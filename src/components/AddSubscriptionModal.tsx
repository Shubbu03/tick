import { FC, useState, FormEvent } from "react";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AddSubscriptionModalProps } from "@/lib/interfaces";
import Calendar from "rc-calendar";
import "rc-calendar/assets/index.css";
import { z } from "zod";
import { PlanType, SubscriptionCategory } from "@/lib/enums";

const subscriptionSchema = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Subscription name is required"),
  planSelected: z.string().min(1, "Plan selection is required"),
  planDuration: z.nativeEnum(PlanType, {
    errorMap: () => ({ message: "Plan duration is required" }),
  }),
  price: z.number().positive("Price must be positive"),
  dueDate: z.date(),
  autoRenew: z.boolean().default(false),
  category: z.nativeEnum(SubscriptionCategory, {
    errorMap: () => ({ message: "Category is required" }),
  }),
});

const initialFormState = {
  username: "shubbu03",
  name: "",
  planSelected: "",
  planDuration: "" as keyof typeof PlanType,
  price: "",
  dueDate: "",
  autoRenew: false,
  category: "" as keyof typeof SubscriptionCategory,
};

interface ExtendedAddSubscriptionModalProps extends AddSubscriptionModalProps {
  onAddSubscription: (data: any) => Promise<void>;
}

const AddSubscriptionModal: FC<ExtendedAddSubscriptionModalProps> = ({
  open,
  onOpenChange,
  onAddSubscription,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dueDateOpen, setDueDateOpen] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setDueDateOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.dueDate || !isValid(formData.dueDate)) {
      setErrors((prev) => ({
        ...prev,
        dueDate: "Due date is required and must be a valid date",
      }));
      return;
    }

    const rawData = {
      ...formData,
      price: Number(formData.price),
    };

    const result = subscriptionSchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as string;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const submissionData = {
      ...rawData,
      dueDate: formData.dueDate,
    };

    try {
      await onAddSubscription(submissionData);
      console.log("Subscription added successfully!");
    } catch (err) {
      console.error("Error adding subscription:", err);
    } finally {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add Subscription
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Spotify.."
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="planSelected">Plan Selection</Label>
            <Input
              id="planSelected"
              value={formData.planSelected}
              onChange={(e) =>
                handleInputChange("planSelected", e.target.value)
              }
              placeholder="Premium.."
              className={errors.planSelected ? "border-red-500" : ""}
            />
            {errors.planSelected && (
              <p className="text-red-500 text-sm">{errors.planSelected}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="planDuration">Plan Duration</Label>
            <Select
              onValueChange={(value) =>
                handleInputChange("planDuration", value)
              }
              value={formData.planDuration}
            >
              <SelectTrigger
                className={errors.planDuration ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectItem value={PlanType.Monthly}>Monthly</SelectItem>
                <SelectItem value={PlanType.Quarterly}>Quarterly</SelectItem>
                <SelectItem value={PlanType.Half_Yearly}>
                  Half Yearly
                </SelectItem>
                <SelectItem value={PlanType.Yearly}>Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.planDuration && (
              <p className="text-red-500 text-sm">{errors.planDuration}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                  !formData.dueDate && "text-muted-foreground",
                  errors.dueDate && "border-red-500"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setDueDateOpen(!dueDateOpen);
                }}
              >
                {formData.dueDate && isValid(formData.dueDate) ? (
                  format(formData.dueDate, "PPP")
                ) : (
                  <span>Pick a due date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              {errors.dueDate && (
                <p className="text-red-500 text-sm">{errors.dueDate}</p>
              )}
              {dueDateOpen && (
                <div className="absolute z-50 mt-2">
                  <Calendar
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-lg"
                    showToday
                    showDateInput={false}
                    value={formData.dueDate || null}
                    onChange={(date) => {
                      const jsDate =
                        date && typeof date.toDate === "function"
                          ? date.toDate()
                          : date instanceof Date
                          ? date
                          : null;

                      if (jsDate && isValid(jsDate)) {
                        handleInputChange("dueDate", jsDate);
                        setDueDateOpen(false);
                      }
                    }}
                    onClose={() => setDueDateOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="autoRenew" className="mr-2">
                Auto Renew
              </Label>
              <Switch
                id="autoRenew"
                checked={formData.autoRenew}
                className="relative w-12 h-6 rounded-full transition-colors duration-300 bg-gray-200 dark:bg-gray-400 data-[state=checked]:bg-teal-500 dark:data-[state=checked]:bg-teal-600"
                onCheckedChange={(checked) =>
                  handleInputChange("autoRenew", checked)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
              value={formData.category}
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectItem value={SubscriptionCategory.Music}>
                  Music
                </SelectItem>
                <SelectItem value={SubscriptionCategory.OTT}>OTT</SelectItem>
                <SelectItem value={SubscriptionCategory.Fitness}>
                  Fitness
                </SelectItem>
                <SelectItem value={SubscriptionCategory.Education}>
                  Education
                </SelectItem>
                <SelectItem value={SubscriptionCategory.News}>News</SelectItem>
                <SelectItem value={SubscriptionCategory.Gaming}>
                  Gaming
                </SelectItem>
                <SelectItem value={SubscriptionCategory.CloudStorage}>
                  Cloud Storage
                </SelectItem>
                <SelectItem value={SubscriptionCategory.Productivity}>
                  Productivity
                </SelectItem>
                <SelectItem value={SubscriptionCategory.ECommerce}>
                  E-Commerce
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;

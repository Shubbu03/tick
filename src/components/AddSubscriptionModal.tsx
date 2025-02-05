import { type FC, useState, type FormEvent } from "react";
import { format } from "date-fns";
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

const initialFormState = {
  name: "",
  planSelected: "",
  planDuration: "",
  price: "",
  startDate: undefined as Date | undefined,
  dueDate: undefined as Date | undefined,
  autoRenew: false,
  active: false,
  category: "",
  username: "shubbu03", // Add a default username or get it from your auth context
};

const AddSubscriptionModal: FC<
  AddSubscriptionModalProps & {
    onSubmit?: (formData: any) => void;
  }
> = ({ open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Subscription name is required";
    }
    if (!formData.planSelected) {
      newErrors.planType = "Plan type is required";
    }
    if (!formData.planDuration) {
      newErrors.planDuration = "Plan duration is required";
    }
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a valid number";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setStartDateOpen(false);
    setDueDateOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      price: Number(formData.price),
      startDate: formData.startDate
        ? format(formData.startDate, "yyyy-MM-dd")
        : undefined,
      dueDate: formData.dueDate
        ? format(formData.dueDate, "yyyy-MM-dd")
        : undefined,
    };

    if (onSubmit) {
      console.log("FINAL DATA FROM FROM IS::", submissionData);
      onSubmit(submissionData);
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
            <Label htmlFor="planSelected">Plan Type</Label>
            <Input
              id="planSelected"
              value={formData.planSelected}
              onChange={(e) =>
                handleInputChange("planSelected", e.target.value)
              }
              placeholder="Premium.."
              className={errors.planType ? "border-red-500" : ""}
            />
            {errors.planType && (
              <p className="text-red-500 text-sm">{errors.planType}</p>
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
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Half_Yearly">Half Yearly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
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
            <Label>Start Date</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                  !formData.startDate && "text-muted-foreground",
                  errors.startDate && "border-red-500"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setStartDateOpen(!startDateOpen);
                }}
              >
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a start date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
              {startDateOpen && (
                <div className="absolute z-50 mt-2">
                  <Calendar
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-lg"
                    showToday
                    showDateInput={false}
                    value={formData.startDate}
                    onChange={(date) => {
                      handleInputChange("startDate", date);
                      setStartDateOpen(false);
                    }}
                    onClose={() => setStartDateOpen(false)}
                  />
                </div>
              )}
            </div>
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
                {formData.dueDate ? (
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
                    value={formData.dueDate}
                    onChange={(date) => {
                      handleInputChange("dueDate", date);
                      setDueDateOpen(false);
                    }}
                    onClose={() => setDueDateOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="active" className="mr-2">
                Active
              </Label>
              <Switch
                id="active"
                checked={formData.active}
                className="relative w-12 h-6 rounded-full transition-colors duration-300 bg-gray-200 dark:bg-gray-400 data-[state=checked]:bg-teal-500 dark:data-[state=checked]:bg-teal-600"
                onCheckedChange={(checked) =>
                  handleInputChange("active", checked)
                }
              />
            </div>
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
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="OTT">OTT</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="CloudStorage">Cloud Storage</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="ECommerce">E-Commerce</SelectItem>
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

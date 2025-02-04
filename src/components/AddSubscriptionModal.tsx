import { type FC, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DayPicker, DayPickerProviderProps } from "react-day-picker";
import "react-day-picker/dist/style.css";
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AddSubscriptionModalProps } from "@/lib/interfaces";
import { Calendar } from "./ui/calendar";

const AddSubscriptionModal: FC<
  AddSubscriptionModalProps & {
    onSubmit?: (formData: any) => void;
  }
> = ({ open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    planType: "",
    planDuration: "",
    price: "",
    startDate: undefined as Date | undefined,
    nextPaymentDate: undefined as Date | undefined,
    autoRenew: false,
  });

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onOpenChange(false);
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="planType">Plan Type</Label>
            <Input
              id="planType"
              value={formData.planType}
              onChange={(e) => handleInputChange("planType", e.target.value)}
              placeholder="Premium.."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="planDuration">Plan Duration</Label>
            <Select
              onValueChange={(value) =>
                handleInputChange("planDuration", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Half_Yearly">Half Yearly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  {formData.startDate ? (
                    format(formData.startDate, "PPP")
                  ) : (
                    <span>Pick a start date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => handleInputChange("startDate", date)}
                  showOutsideDays
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                    !formData.nextPaymentDate && "text-muted-foreground"
                  )}
                >
                  {formData.nextPaymentDate ? (
                    format(formData.nextPaymentDate, "PPP")
                  ) : (
                    <span>Pick a due date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.nextPaymentDate}
                  onSelect={(date) =>
                    handleInputChange("nextPaymentDate", date)
                  }
                  showOutsideDays
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="active" className="mr-2">
                Active
              </Label>
              <Switch
                id="active"
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
                className="relative w-12 h-6 rounded-full transition-colors duration-300 bg-gray-200 dark:bg-gray-400 data-[state=checked]:bg-teal-500 dark:data-[state=checked]:bg-teal-600"
                onCheckedChange={(checked) =>
                  handleInputChange("autoRenew", checked)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="planDuration">Category</Label>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
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
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;

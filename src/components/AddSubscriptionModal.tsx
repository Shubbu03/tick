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
          <div className="flex items-center space-x-2">
            <Switch
              id="autoRenew"
              checked={formData.autoRenew}
              onCheckedChange={(checked) =>
                handleInputChange("autoRenew", checked)
              }
            />
            <Label htmlFor="autoRenew">Auto Renew</Label>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Save Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;

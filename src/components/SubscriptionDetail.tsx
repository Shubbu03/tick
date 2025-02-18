import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanType, SubscriptionCategory } from "@/lib/enums";
import { UserSubscription } from "@/lib/interfaces";

interface SubscriptionDetailProps {
  editForm: Partial<UserSubscription>;
  setEditForm: (form: Partial<UserSubscription>) => void;
  onBack: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

export default function SubscriptionDetail({
  editForm,
  setEditForm,
  onBack,
  onDelete,
  onUpdate,
}: SubscriptionDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:scale-105 transition-all duration-200 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={onDelete}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              onClick={onUpdate}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white transition-all duration-200 rounded-xl"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="border-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, category: value })
                    }
                  >
                    <SelectTrigger className="border-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 rounded-2xl">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                      {Object.values(SubscriptionCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Price
                  </label>
                  <Input
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="border-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Subscription Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Plan Duration
                  </label>
                  <Select
                    value={editForm.planDuration}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, planDuration: value })
                    }
                  >
                    <SelectTrigger className="border-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 rounded-2xl">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                      {Object.values(PlanType).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={
                      editForm.dueDate
                        ? new Date(editForm.dueDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        dueDate: new Date(e.target.value).toDateString(),
                      })
                    }
                    className="border-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 rounded-2xl"
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status Settings
                  </h3>
                  <div className="flex gap-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.isActive}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            isActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active
                      </span>
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.autoRenew}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            autoRenew: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto Renew
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

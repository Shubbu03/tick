"use client";

import { useEffect, useId, useState } from "react";
import { ArrowUpDown, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionCategory } from "@/lib/enums";
import axios from "axios";
import SubscriptionCard from "@/components/SubscriptionCard";
import { UserSubscription, SubscriptionCardProps } from "@/lib/interfaces";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import * as XLSX from "xlsx";
import formatLocaleDate from "@/lib/formatToLocaleDate";
import SubscriptionDetail from "@/components/SubscriptionDetail";
import { useSession } from "next-auth/react";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";

type SortOption = "recent" | "price-asc" | "price-desc" | "alpha";
type ViewMode = "list" | "detail";

const ALL_CATEGORIES = "all";

export default function Subscription() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedSubscription, setSelectedSubscription] =
    useState<UserSubscription | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [userSubscription, setUserSubscription] = useState<UserSubscription[]>(
    []
  );
  const [filteredData, setFilteredData] = useState<UserSubscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserSubscription>>({});
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const { data: session } = useSession();
  const user = session?.user;
  const userID = user?._id;

  useEffect(() => {
    fetchUserSubscriptions();
  }, []);

  useEffect(() => {
    filterAndSortSubscriptions();
  }, [userSubscription, searchQuery, selectedCategory, sortBy]);

  const fetchUserSubscriptions = async () => {
    try {
      const response = await axios.get("/api/get-subscription");
      if (response && response.status === 200) {
        const subscriptions = response.data.subscription;
        setUserSubscription(subscriptions);
        setFilteredData(subscriptions);
      }
    } catch (err) {
      console.error("Error occurred while fetching subscriptions:", err);
    }
  };

  const handleAddSubscription = async (data: any) => {
    try {
      const response = await axios.post("/api/add-subscription", data);
      if (response.status === 200) {
        console.log("Subscription added successfully!");
        setIsModalOpen(false);
      }
      await fetchUserSubscriptions();
    } catch (err) {
      console.error("Error adding subscription:", err);
      throw err;
    }
  };

  const filterAndSortSubscriptions = () => {
    let filtered = [...userSubscription];

    if (searchQuery) {
      filtered = filtered.filter((sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== ALL_CATEGORIES) {
      filtered = filtered.filter((sub) => sub.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "alpha":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
        break;
    }

    setFilteredData(filtered);
  };

  const getNoResultsMessage = () => {
    if (searchQuery && selectedCategory !== ALL_CATEGORIES) {
      return `No subscriptions found matching "${searchQuery}" in ${selectedCategory} category`;
    } else if (searchQuery) {
      return `No subscriptions found matching "${searchQuery}"`;
    } else if (selectedCategory !== ALL_CATEGORIES) {
      return `No subscriptions found in ${selectedCategory} category`;
    }
    return "No subscriptions found";
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No subscriptions to export");
      return;
    }

    const exportData = filteredData.map((sub) => ({
      Name: sub.name,
      Category: sub.category,
      Price: sub.price,
      "Active Status": sub.isActive ? "Active" : "Inactive",
      "Auto Renew": sub.autoRenew ? "Yes" : "No",
      "Plan Duration": sub.planDuration,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscriptions");

    XLSX.writeFile(workbook, "Subscriptions_Export.xlsx", {
      bookType: "xlsx",
      type: "buffer",
    });
  };

  const handleSubscriptionClick = async (subscriptionID: any) => {
    try {
      const response = await axios.get(`/api/subscription/${subscriptionID}`);
      if (response && response.status === 200) {
        setSelectedSubscription(response.data.subscription);
        setEditForm(response.data.subscription);
        setViewMode("detail");
      }
    } catch (err) {
      console.error("Error occurred while fetching subscriptions:", err);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedSubscription(null);
    setEditForm({});
  };

  const handleUpdateSubscription = async () => {
    try {
      const response = await axios.put(
        `/api/edit-subscription?id=${userID}`,
        editForm
      );
      if (response.status === 200) {
        await fetchUserSubscriptions();
        handleBackToList();
      }
    } catch (err) {
      console.error("Error updating subscription:", err);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: any) => {
    if (!window.confirm("Are you sure you want to delete this subscription?"))
      return;
    try {
      const response = await axios.delete(
        `/api/delete-subscription/${userID}`,
        {
          data: { subscriptionId },
        }
      );

      const data = response.data;

      if (data.success) {
        const updatedSubscriptions = userSubscription.filter(
          (sub) => sub._id !== subscriptionId
        );
        setUserSubscription(updatedSubscriptions);

        setFilteredData((prev) =>
          prev.filter((sub) => sub._id !== subscriptionId)
        );
        await fetchUserSubscriptions();
        handleBackToList();
      } else {
        alert(data.message || "Failed to delete subscription");
      }
    } catch (err) {
      console.error("Error deleting subscription:", err);
    }
  };

  const handleDeleteAllSubscription = async () => {
    try {
      const resposne = await axios.delete(
        `/api/delete-all-subscriptions?id=${userID}`
      );

      if (resposne.status === 200) {
        setUserSubscription([]);
        setIsDeleteAllModalOpen(false);
        setFilteredData([]);
        await fetchUserSubscriptions();
      }
    } catch (err) {
      console.error("Error deleting subscription:", err);
    }
  };

  return (
    <div className="space-y-4">
      {viewMode === "list" ? (
        <>
          <div className="flex justify-between items-center p-4">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Subscription Details
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
                Manage and track your subscriptions
              </p>
            </div>
            <div className="flex gap-3">
              {userSubscription.length > 0 && (
                <>
                  <Button
                    onClick={() => setIsDeleteAllModalOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 border-red-300 dark:bg-red-800 dark:hover:bg-red-700 dark:text-red-100 dark:border-red-600"
                  >
                    <Trash className="h-4 w-4" />
                    Delete All
                  </Button>
                  <Button
                    onClick={exportToExcel}
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-300 dark:bg-teal-800 dark:hover:bg-teal-700 dark:text-teal-100 dark:border-teal-600"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-300 dark:bg-teal-800 dark:hover:bg-teal-700 dark:text-teal-100 dark:border-teal-600"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="p-4 flex gap-4">
            <Input
              placeholder="Search here..."
              className="w-4/5 rounded-[0.5rem]"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] rounded-[0.5rem] cursor-pointer">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectGroup>
                  <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Categories
                  </SelectLabel>
                  <SelectItem className="cursor-pointer" value="all">
                    All Categories
                  </SelectItem>
                  {Object.values(SubscriptionCategory).map((category) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[180px] rounded-[0.5rem] cursor-pointer">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectGroup>
                  <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Sort By
                  </SelectLabel>
                  {[
                    { value: "recent", label: "Most Recent" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "alpha", label: "A-Z" },
                  ].map((option) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-10 cursor-pointer">
            {filteredData.length > 0 ? (
              filteredData.map((subs: SubscriptionCardProps) => (
                <SubscriptionCard
                  key={subs._id}
                  _id={subs._id}
                  name={subs.name}
                  category={subs.category}
                  price={subs.price}
                  isActive={subs.isActive}
                  autoRenew={subs.autoRenew}
                  planDuration={subs.planDuration}
                  dueDate={formatLocaleDate(subs.dueDate)}
                  onSubscriptionPage={true}
                  onClick={() => handleSubscriptionClick(subs._id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                  {getNoResultsMessage()}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          <AddSubscriptionModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onAddSubscription={handleAddSubscription}
          />

          <Dialog
            open={isDeleteAllModalOpen}
            onOpenChange={setIsDeleteAllModalOpen}
          >
            <DialogContent className="sm:max-w-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="p-4">
                  Delete All Subscriptions
                </DialogTitle>
                <DialogDescription className="p-4">
                  Do you really wanna delete all subscriptions?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  onClick={() => setIsDeleteAllModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={async () => {
                    await handleDeleteAllSubscription();
                  }}
                >
                  Delete All
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <SubscriptionDetail
          editForm={editForm}
          setEditForm={setEditForm}
          onBack={handleBackToList}
          onDelete={() => handleDeleteSubscription(editForm._id)}
          onUpdate={handleUpdateSubscription}
        />
      )}
    </div>
  );
}

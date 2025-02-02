"use client";

import { useState } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
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

type SortOption = "recent" | "price-asc" | "price-desc" | "alpha";

const ALL_CATEGORIES = "all";

export default function Subscription() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "alpha", label: "A-Z" },
  ];

  return (
    <div className="space-y-4">
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
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-300 dark:bg-teal-800 dark:hover:bg-teal-700 dark:text-teal-100 dark:border-teal-600"
          >
            <ArrowUpDown className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-300 dark:bg-teal-800 dark:hover:bg-teal-700 dark:text-teal-100 dark:border-teal-600"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <div className="p-4 flex gap-4">
        <Input
          placeholder="Search here..."
          className="w-4/5 rounded-[0.5rem]"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] rounded-[0.5rem] cursor-pointer">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Categories
              </SelectLabel>
              <SelectItem className="cursor-pointer" value={ALL_CATEGORIES}>
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
              {sortOptions.map((option) => (
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
    </div>
  );
}

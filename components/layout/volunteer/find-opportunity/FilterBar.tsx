"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearch } from "@/contexts/SearchContext";
import { OPPORTUNITY_CATEGORIES } from "@/utils/constants/opportunities";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterBar() {
  const {
    filters,
    setSearchQuery,
    setCategories,
    setCommitmentType,
    setLocation,
    clearAllFilters,
  } = useSearch();

  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery !== filters.searchQuery) {
        setSearchQuery(localSearchQuery);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [localSearchQuery, filters.searchQuery, setSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  const handleWorkBasedChange = (checked: boolean) => {
    if (checked) {
      setCommitmentType("workbased");
    } else if (filters.commitmentType === "workbased") {
      setCommitmentType("all");
    }
  };

  const handleEventBasedChange = (checked: boolean) => {
    if (checked) {
      setCommitmentType("eventbased");
    } else if (filters.commitmentType === "eventbased") {
      setCommitmentType("all");
    }
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    setCategories(newCategories);
  };

  const getCategoryLabel = (value: string) => {
    const category = OPPORTUNITY_CATEGORIES.find((c) => c.value === value);
    return category ? category.label : value;
  };

  const handleLocationChange = (location: string) => {
    setLocation(location);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.commitmentType !== "all" ||
    filters.location ||
    filters.searchQuery;

  return (
    <div className="p-4 md:p-6 bg-blue-500 rounded-lg mb-6 text-white">
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-400 rounded-lg">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Active Filters:</span>
            {filters.searchQuery && (
              <span className="px-2 py-1 bg-white text-blue-600 rounded-full text-xs">
                Search: &ldquo;{filters.searchQuery}&rdquo;
              </span>
            )}
            {filters.commitmentType !== "all" && (
              <span className="px-2 py-1 bg-white text-blue-600 rounded-full text-xs">
                {filters.commitmentType === "workbased" ? "Work Based" : "Event Based"}
              </span>
            )}
            {filters.location && (
              <span className="px-2 py-1 bg-white text-blue-600 rounded-full text-xs">
                Location: {filters.location}
              </span>
            )}
            {filters.categories.map(category => (
              <span key={category} className="px-2 py-1 bg-white text-blue-600 rounded-full text-xs">
                {getCategoryLabel(category)}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-2 lg:col-span-2 flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="work-based"
              checked={filters.commitmentType === "workbased"}
              onCheckedChange={handleWorkBasedChange}
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
            />
            <label htmlFor="work-based" className="font-medium text-white text-sm">
              Work Based
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="event-based"
              checked={filters.commitmentType === "eventbased"}
              onCheckedChange={handleEventBasedChange}
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
            />
            <label htmlFor="event-based" className="font-medium text-white text-sm">
              Event Based
            </label>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <Input
            placeholder="Enter Location"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="bg-white text-gray-800 rounded-md text-sm"
          />
          <p className="text-xs mt-1 text-blue-200">
            Location of the opportunity or organization
          </p>
        </div>

        <div className="md:col-span-2 lg:col-span-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-blue-400 border-none w-full sm:w-auto rounded-full text-white text-sm">
              <SelectValue placeholder={filters.categories.length > 0 ? `${filters.categories.length} selected` : "Cause Areas"} />
            </SelectTrigger>
            <SelectContent>
              {OPPORTUNITY_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.categories.includes(category.value)}
                      className="h-4 w-4"
                    />
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="bg-blue-400 border-none w-full sm:w-auto rounded-full text-white text-sm">
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
              <SelectItem value="teaching">Teaching</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="bg-blue-400 border-none w-full sm:w-auto rounded-full text-white text-sm">
              <SelectValue placeholder="More Filters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good-for-groups">Good for Groups</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="weekend">Weekend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 lg:col-span-3 flex flex-col items-stretch gap-2">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <Input
              placeholder="Search by Keyword"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="bg-blue-50 text-gray-800 placeholder:text-gray-500 rounded-full pr-10 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 bg-transparent text-black hover:bg-blue-500 hover:text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button
            variant="link"
            onClick={clearAllFilters}
            className="text-white hover:text-blue-300 p-0 h-auto justify-end text-xs"
          >
            CLEAR ALL FILTERS
          </Button>
        </div>
      </div>
    </div>
  );
}

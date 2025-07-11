"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { volunteerTypes } from "@/utils/constants/select-options";
import { useState, useEffect } from "react";

interface FilterSidebarProps {
  onFilterChange: (filters: VolunteerFilters) => void;
  currentFilters?: VolunteerFilters;
}

export interface VolunteerFilters {
  categories: string[];
  studentType: "yes" | "no" | "all";
  availability: {
    startDate: string | null;
    endDate: string | null;
  };
}

export default function FilterSidebar({ onFilterChange, currentFilters }: FilterSidebarProps) {
  const [filters, setFilters] = useState<VolunteerFilters>(
    currentFilters || {
      categories: [],
      studentType: "all",
      availability: {
        startDate: null,
        endDate: null,
      },
    }
  );

  // Update internal state when currentFilters prop changes
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStudentTypeChange = (type: "yes" | "no" | "all") => {
    const newFilters = { ...filters, studentType: type };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full md:w-[280px] bg-white rounded-lg shadow-sm p-4 md:h-[800px] flex flex-col">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {volunteerTypes.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.value}
                      checked={filters.categories.includes(category.value)}
                      onCheckedChange={() => handleCategoryChange(category.value)}
                    />
                    <Label htmlFor={category.value} className="text-sm">{category.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Student Type */}
            <div>
              <h4 className="font-medium mb-3">Studentship status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all-students"
                    checked={filters.studentType === "all"}
                    onCheckedChange={() => handleStudentTypeChange("all")}
                  />
                  <Label htmlFor="all-students" className="text-sm">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="student-yes"
                    checked={filters.studentType === "yes"}
                    onCheckedChange={() => handleStudentTypeChange("yes")}
                  />
                  <Label htmlFor="student-yes" className="text-sm">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="student-no"
                    checked={filters.studentType === "no"}
                    onCheckedChange={() => handleStudentTypeChange("no")}
                  />
                  <Label htmlFor="student-no" className="text-sm">Non-Academic</Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 
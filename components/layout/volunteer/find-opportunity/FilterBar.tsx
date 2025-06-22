"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterBar() {
  return (
    <div className="p-4 md:p-6 bg-blue-500 rounded-lg mb-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-2 flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="work-based"
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
            />
            <label htmlFor="work-based" className="font-medium text-white">
              Work Based
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="event-based"
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
            />
            <label htmlFor="event-based" className="font-medium text-white">
              Event Based
            </label>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Input
            placeholder="Enter Location"
            className="bg-white text-gray-800 rounded-md"
          />
          <p className="text-xs mt-1 text-blue-200">
            Location of the opportunity or organization
          </p>
        </div>

        <div className="lg:col-span-4 flex items-center justify-center gap-2">
          <Select>
            <SelectTrigger className="bg-blue-400 border-none w-auto rounded-full text-white">
              <SelectValue placeholder="Cause Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="animals">Animals</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="bg-blue-400 border-none w-auto rounded-full text-white">
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="it">IT</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="bg-blue-400 border-none w-auto rounded-full text-white">
              <SelectValue placeholder="More Filters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good-for-groups">Good for Groups</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-3 flex flex-col items-stretch gap-2">
          <div className="w-full relative">
            <Input
              placeholder="Search by Keyword"
              className="bg-blue-50 text-gray-800 placeholder:text-gray-500 rounded-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <Button
            variant="link"
            className="text-white hover:text-blue-300 p-0 h-auto justify-end text-xs"
          >
            CLEAR ALL FILTERS
          </Button>
        </div>
      </div>
    </div>
  );
} 
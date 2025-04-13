"use client";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image"; // Import the Image component
import { useRouter } from "next/navigation";

interface OpportunityCardProps {
  title: string;
  organization: string;
  postedDate: string;
  applicants: number;
  recruits: number;
}

export default function OpportunityCard({
  title,
  organization,
  postedDate,
  applicants,
  recruits,
}: OpportunityCardProps) {
  const router = useRouter();

  return (
    <div className="flex items-center py-4 px-6 hover:bg-gray-50">
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-start">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Image
                  src="/portrait volunteer.svg"
                  alt="Next.js Logo"
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-sm text-gray-500">{organization}</span>
            </div>
            <span className="text-[10px] text-gray-500">Posted - {postedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex w-[400px] mr-8">
        <div className="w-[200px] text-center pl-16 text-gray-600 text-[14px]">{applicants}</div>
        <div className="w-[200px] text-center pl-16  text-gray-600 text-[14px]">{recruits}</div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push('/organization/opportunity/view')}>
            View Application
          </DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
"use client";

import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { IOpportunity } from "@/server/db/interfaces/opportunity";

interface SidebarProps {
  opportunity: IOpportunity;
}

export function Sidebar({ opportunity }: SidebarProps) {
  return (
    <div className="w-[300px]">
      <div className="py-4 rounded-lg mb-4 space-y-4">
        <Image
          src="/Easy.svg"
          alt="Easy Care"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
          <span>{opportunity.location}</span>
        </div>
      </div>

      <Separator />

      <div className="py-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Requirements</h3>
        <div className="space-y-2">
          {opportunity.required_skills.map((skill) => (
            <div key={skill} className="flex items-center text-sm">
              <span>• {skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";
import Image from "next/image";

export function Sidebar() {
  return (
    <div className="w-[300px]">
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 mr-3">
            <Image
              src="/Easy.svg"
              alt="Easy Care"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold">Easy Care</h3>
            <p className="text-sm text-gray-600">Posted by Easy Care Gardening</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span>Sydney, Australia</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>20/05/2025</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>10:00 AM - 02:00 PM (4 hours)</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Requirements</h3>
        <div className="flex items-center text-sm">
          <span>• Police Check</span>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Apply Now
      </Button>
    </div>
  );
}
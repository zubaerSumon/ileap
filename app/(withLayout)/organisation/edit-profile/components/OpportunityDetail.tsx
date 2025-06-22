'use client';

import { MapPin } from "lucide-react";
import BackButton from "@/components/buttons/BackButton";

export function OpportunityDetail() {
  return (
    <div className="p-6">
      <BackButton />
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Opportunity Details</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Location: Sydney, NSW</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Description</h4>
            <p className="text-gray-600 mt-1">
              This is a sample opportunity description. It would contain details about the volunteer opportunity, requirements, and expectations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
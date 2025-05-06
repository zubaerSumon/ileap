'use client';


import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpportunityDetailProps {
  onBack: () => void;
}

export function OpportunityDetail({ onBack }: OpportunityDetailProps) {
  return (
    <div className="w-full max-w-[800px]">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-semibold mb-4">Save Humanity</h1>
      
      <div className="flex items-center gap-2 text-gray-600 mb-6">
        <MapPin className="w-4 h-4" />
        <span>21 Darling Dr, Sydney, Australia</span>
      </div>

      <div className="flex gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">07/01/2025 - 19/01/2025</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p className="font-medium">04:00 PM - 05:30 PM (1 hour 30 minutes)</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Description</p>
        <p className="text-gray-700">
          Join us for the Green Future Initiative, where volunteers will help plant trees and restore local parks. 
          The project kicks off on March 15th at Riverside Park. Sign up today to make a difference in our community!
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Opportunity type</p>
        <p className="font-medium">Regular</p>
        <p className="text-sm text-gray-500">Max volunteer: 20</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Homeless</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Disaster Relief</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Emergency & Safety</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Health & Medicine</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Education & Literacy</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Required</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked readOnly />
            <span className="text-sm">Driving license</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked readOnly />
            <span className="text-sm">Covid-19 vaccination certificate</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Opportunity link</p>
        <div className="space-y-2">
          <div className="bg-gray-50 p-2 rounded text-sm">http://www.iLEAP.com/jobs/</div>
          <Button variant="outline" className="text-xs">Copy link</Button>
        </div>
      </div>

      <div>
        <a href="www.charity.australia.com" className="text-blue-600 text-sm hover:underline">
          www.charity.australia.com
        </a>
      </div>
    </div>
  );
}
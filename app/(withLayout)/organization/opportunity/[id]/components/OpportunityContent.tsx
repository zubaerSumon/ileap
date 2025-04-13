import { MapPin, Clock, Calendar, Check } from "lucide-react";

export function OpportunityContent() {
  return (
    <div className="max-w-[800px] space-y-6 text-[12px] font-medium">
      <h1 className="text-2xl font-semibold">Save Humanity</h1>

      <div className="space-y-4 border-b pb-4">
        <div className="flex items-center gap-1 text-gray-600">
          <span className="text-gray-500">Posted 7 days ago</span>
          <span>•</span>
          <MapPin className="w-3 h-3" />
          <span>21 Darling Dr, Sydney, Australia</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>07/01/2025 - 19/01/2025</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>04:00 PM - 05:30 PM (1 hour 30 minutes)</span>
          </div>
        </div>
      </div>

      <div className="border-b pb-6">
        <p className="text-gray-700">
          Join us for the Green Future Initiative, where volunteers will help plant trees and restore local parks. 
          The project kicks off on March 15th at Riverside Park. Sign up today to make a difference in our community!
        </p>
      </div>

      <div className="flex gap-20 border-b pb-6">
        <div>
          <p className="text-gray-500">Opportunity type</p>
          <p>Regular</p>
        </div>
        <div>
          <p className="text-gray-500">Max volunteer</p>
          <p>20</p>
        </div>
      </div>

      <div className="border-b pb-6">
        <p className="text-gray-500 mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Homeless</span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Disaster Relief</span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Emergency & Safety</span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Human Rights</span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Health & Medicine</span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Education & Literacy</span>
        </div>
      </div>

      <div className="border-b pb-6">
        <p className="text-gray-500 mb-2">Required</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Driving license</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Covid-19 vaccination certificate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

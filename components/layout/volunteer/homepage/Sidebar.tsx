
import { MapPin, Calendar, Clock, CheckSquare } from "lucide-react";
import Image from "next/image";

export function Sidebar({ opportunityId }: { opportunityId?: string }) {
  if (opportunityId === "2") {
    return (
      <div className="w-[300px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3 mb-2">
            <Image
              src="/Clean.svg"
              alt="Clean Up Australia"
              width={64}
              height={64}
              className="rounded-lg"
            />
            <div className="text-start">
              <div className="flex h-[15px] px-1 justify-center items-center gap-1 rounded-[2px] bg-[#F0F0F0] text-[#4A4A4A] font-inter text-[13px] font-normal">
                Environmental Management
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span>Hyde Park, Sydney</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>21/05/2025</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>01:00 PM - 04:00 PM (3 hours)</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-3 text-gray-900">Requirements</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckSquare className="w-5 h-5 text-blue-500" />
              <span>No specific requirements</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Return original gardening sidebar for id 1 or default
  return (
    <div className="w-[300px]">
      <div className="flex flex-col gap-4">
        {/* Organization Logo and Category */}
        <div className="flex flex-col items-start gap-3 mb-2">
          <Image
            src="/Easy.svg"
            alt="Easy Care"
            width={64}
            height={64}
            className="rounded-lg"
          />
          <div className="text-start">
            <div className="font-medium text-m">Seniors & Aged Care</div>
          </div>
        </div>

        {/* Details with Icons */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span>Sydney, Australia</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>20/05/2025</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>10:00 AM - 02:00 PM (4 hours)</span>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mt-4">
          <h3 className="font-medium mb-3 text-gray-900">Requirements</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            <span>Police Check</span>
          </div>
        </div>

        
      </div>
    </div>
  );
}
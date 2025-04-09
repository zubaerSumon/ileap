import Image from "next/image";
import { MapPin } from "lucide-react";

export function OpportunitySidebar() {
  return (
    <div className="w-[400px] space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Image
            src="/pf.svg"
            alt="Organization Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div>
            <h3 className="font-medium">Charity Organisation</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="w-3 h-3" />
              <span>Sydney, Australia</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[8px] ">Outdoor enthusiast</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[8px]">National Parks</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[8px]">Adventure Travel</span>
        </div>
        <p className="text-sm text-gray-500">20+ Projects posted</p>
        <div className="border-t pt-4">
          
          <p className="text-sm text-gray-500">Member since June 4, 2024</p>
        </div>

        <div className="border-t"></div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Opportunity link</h3>
        <div className="bg-gray-50 p-2 rounded text-sm">
          http://www.iLEAP.com/jobs/
        </div>
        <div className="text-blue-600 text-[12px]"><u>
          Copy link </u>
        </div>
        <a 
          href="www.charity.ausralia.com" 
          className="block text-blue-600 text-sm hover:underline"
        >
          www.charity.ausralia.com
        </a>
      </div>
    </div>
  );
}
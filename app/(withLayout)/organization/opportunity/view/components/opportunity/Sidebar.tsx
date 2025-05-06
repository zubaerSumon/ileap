import { ArrowLeftRight, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { RequirementsList } from "./RequirementsList";
import { SkillsList } from "./SkillsList";

export function Sidebar() {
  return (
    <div className="w-[300px] space-y-6">
      <div>
        <Image
          src="/portrait volunteer.svg"
          width={44}
          height={44}
          alt="Picture of the author"
        />
        <div className="space-y-1">
          <div className="flex gap-2 text-[12px]">
            <span className="bg-gray-100 px-2 py-1 rounded">Emergency & Safety</span>
            <span className="bg-gray-100 px-2 py-1 rounded">Health & Medicine</span>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded text-[12px]">Animal welfare</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#246BFD]" />
          <span className="text-sm">Sydney, Australia</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-[#246BFD]" />
          <span className="text-sm">Regular</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#246BFD]" />
          <span className="text-sm">07/01/2025 - 19/01/2025</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#246BFD]" />
          <span className="text-sm">04:00 PM - 05:30 PM (1 hour 30 minutes)</span>
        </div>
      </div>

      <div className="space-y-6">
        <RequirementsList />
        <SkillsList />
      </div>
    </div>
  );
}
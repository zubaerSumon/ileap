
import { MapPin, Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";

interface OpportunityDetails {
  logo: string;
  logoAlt: string;
  category: string;
  location: string;
  date: string;
  time: string;
  requirements: string;
}

export function Sidebar({ opportunityId }: { opportunityId?: string }) {
  const getOpportunityDetails = (id?: string): OpportunityDetails => {
    if (id === "4") {
      return {
        logo: "/Easy.svg",
        logoAlt: "Easy Care Gardening",
        category: "Seniors & Aged Care",
        location: "Hyde Park, Sydney",
        date: "24/05/2025",
        time: "01:00 PM - 04:00 PM (3 hours)",
        requirements: "No specific requirements"
      };
    }
    if (id === "3") {
      return {
        logo: "/Clean.svg",
        logoAlt: "Clean Up Australia",
        category: "Environmental Management",
        location: "Hyde Park, Sydney",
        date: "24/05/2025",
        time: "01:00 PM - 04:00 PM (3 hours)",
        requirements: "No specific requirements"
      };
    }
    if (id === "2") {
      return {
        logo: "/Clean.svg",
        logoAlt: "Clean Up Australia",
        category: "Environmental Management",
        location: "Hyde Park, Sydney",
        date: "21/05/2025",
        time: "01:00 PM - 04:00 PM (3 hours)",
        requirements: "No specific requirements"
      };
    }
    // Default case (id === "1")
    return {
      logo: "/Easy.svg",
      logoAlt: "Easy Care",
      category: "Seniors & Aged Care",
      location: "Sydney, Australia",
      date: "20/05/2025",
      time: "10:00 AM - 02:00 PM (4 hours)",
      requirements: "Police Check"
    };
  };

  const details = getOpportunityDetails(opportunityId);

  return (
    <div className="hidden lg:block w-[300px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-3 mb-2">
          <Image
            src={details.logo}
            alt={details.logoAlt}
            width={64}
            height={64}
            className="rounded-lg"
          />
          <div className="text-start">
            <div className={`flex ${opportunityId === "2" ? "h-[15px] px-1 justify-center items-center gap-1 rounded-[2px] bg-[#F0F0F0] text-[#4A4A4A] font-inter text-[13px] font-normal" : "font-medium text-m"}`}>
              {details.category}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span>{details.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Tag className="w-5 h-5 text-blue-500" />
            <span>One-off</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>{details.date}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>{details.time}</span>
          </div>
        </div>

        {/* <div className="mt-4">
          <h3 className="font-medium mb-3 text-gray-900">Requirements</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            <span>{details.requirements}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
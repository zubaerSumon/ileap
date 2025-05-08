"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ConfirmationModal } from "../../../modals/ConfirmationModal";
import { trpc } from "@/utils/trpc";
import fileIcon from "../../../../public/icons/file-icon.svg";
import mapPinIcon from "../../../../public/icons/map-pin-icon.svg";
import mapPinGrayIcon from "../../../../public/icons/map-pin-gray-icon.svg";
import { Star, Users } from "lucide-react";

type OpportunityDetails = {
  id: string;
  title: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  logo: string;
};

export default function Categories({
  customizedFor,
}: {
  customizedFor?: string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityDetails | null>(null);
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);

  const { data: profileData } = trpc.users.profileCheckup.useQuery();

  useEffect(() => {
    if (profileData?.volunteerProfile?.applied_events) {
      setAppliedEvents(profileData.volunteerProfile.applied_events);
    }
  }, [profileData]);

  const opportunities = [
    {
      id: "1",
      title: "Easy Care Gardening",
      popup_title: "Gardening Volunteer",
      organization: "Easy Care Gardening",
      location: "Sydney, Australia",
      type: "One off",
      date: "20/05/2025",
      time: "10:00 AM - 02:00 PM",
      matchingAvailability: true,
      matchedSkills: 3,
      categories: ["Seniors & Aged Care"],
      description:
        "Do you have a passion for gardening and a desire to make a real difference in your community?...",
      logoSrc: "/Easy.svg",
    },
    {
      id: "2",
      title: "Clean Up Australia",
      popup_title: "Clean Up volunteer",
      organization: "Clean Up Australia",
      location: "Sydney, Australia",
      type: "One off",
      date: "21/05/2025",
      time: "01:00 PM - 04:00 PM",
      matchingAvailability: true,
      matchedSkills: 2,
      categories: ["Environmental Management"],
      description:
        "Want to help protect Australia's parks, beaches, and waterways from litter and waste?...",
      logoSrc: "/Clean.svg",
    },
    {
      id: "4",
      title: "Easy Care Gardening",
      popup_title: "Tree plantation Volunteer",
      organization: "Easy Care Gardening",
      location: "Sydney, Australia",
      type: "One off",
      date: "24/05/2025",
      time: "01:00 PM - 04:00 PM",
      matchingAvailability: true,
      matchedSkills: 3,
      categories: ["Seniors & Aged Care"],
      description:
        "Do you have a passion for gardening and a desire to make a real difference in your community?...",
      logoSrc: "/Easy.svg",
    },
    {
      id: "3",
      title: "Clean Up Australia",
      popup_title: "Clean Up volunteer",
      organization: "Clean Up Australia",
      location: "Sydney, Australia",
      type: "One off",
      date: "24/05/2025",
      time: "01:00 PM - 04:00 PM",
      matchingAvailability: true,
      matchedSkills: 2,
      categories: ["Environmental Management"],
      description:
        "Want to help protect Australia's parks, beaches, and waterways from litter and waste?...",
      logoSrc: "/Clean.svg",
    },
  ];

  // Filter opportunities based on customizedFor parameter
  const filteredOpportunities = customizedFor
    ? customizedFor.toLowerCase() === "easy care"
      ? opportunities.filter((opp) => ["1", "4"].includes(opp.id))
      : customizedFor.toLowerCase() === "clean up"
      ? opportunities.filter((opp) => ["2", "3"].includes(opp.id))
      : opportunities
    : opportunities;

  return (
    <section className="w-full md:w-[57%] relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity) => (
            <Card 
              key={opportunity.id}
              className="rounded-lg overflow-hidden w-full py-0 h-[340px] cursor-pointer hover:shadow-lg transition-shadow relative"
              onClick={() =>
                router.push(`/volunteer/opportunities/${opportunity.id}`)
              }
            >
              <CardContent className="px-4 pt-4">
                <div className="space-y-3">
                  <Image
                    src={opportunity.logoSrc}
                    alt={opportunity.organization}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />

                  <h3 className="text-lg font-semibold line-clamp-1">
                    {opportunity.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Image
                        src={mapPinIcon}
                        height={16}
                        width={16}
                        className="mr-1"
                        alt="Map pin icon"
                      />
                      <span className="">{opportunity.location}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Image
                        src={fileIcon}
                        height={16}
                        width={16}
                        className="mr-1"
                        alt="File icon"
                      />
                      <span className="">
                        {opportunity.type}; {opportunity.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-2">
                    <div className="flex items-center w-[150px] rounded-[4px] bg-[#EBF8F4] p-1">
                      <Image
                        src={mapPinGrayIcon}
                        height={16}
                        width={16}
                        className="mr-1"
                        alt="Map pin gray icon"
                      />
                      <span className="text-sm text-green-600">
                        Matching location
                      </span>
                    </div>
                    <div className="flex items-center w-[110px] rounded-[4px] bg-[#EBF8F4] p-1">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                         {opportunity.organization === "Clean Up Australia" ? "20" : "10"} persons
                      </span>
                    </div></div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {opportunity.categories.map((category, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-sm bg-[#F0F0F0] rounded-[4px] font-normal"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600">
                    {opportunity.description}
                    <Link
                      href={`/volunteer/opportunities/${opportunity.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm ml-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="absolute bottom-0 left-0 right-0 flex items-center px-4 pb-5">
                <div className="flex items-center gap-2">
                  <Button
                    className={`${
                      appliedEvents.includes(opportunity.id)
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white h-8 px-6 rounded-md text-sm font-medium`}
                    disabled={appliedEvents.includes(opportunity.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOpportunity({
                        id: opportunity.id,
                        title: opportunity.popup_title || opportunity.title,
                        organization: opportunity.organization,
                        date: opportunity.date,
                        time: opportunity.time,
                        location: opportunity.location,
                        logo: opportunity.logoSrc,
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    {appliedEvents.includes(opportunity.id)
                      ? "Applied"
                      : "Apply now"}
                  </Button>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
              </CardFooter>
            </Card>
        ))}
      </div>

      {selectedOpportunity && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opportunityDetails={selectedOpportunity}
        />
      )}
    </section>
  );
}
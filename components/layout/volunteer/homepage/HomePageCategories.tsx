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
import { Star } from "lucide-react";

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
      title: "Gardening Volunteer",
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
      title: "Clean Up Volunteer",
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
  ];

  // Filter opportunities based on customizedFor parameter
  const filteredOpportunities = customizedFor
    ? customizedFor.toLowerCase() === "easy care"
      ? opportunities.filter((opp) => opp.id === "1")
      : customizedFor.toLowerCase() === "clean up"
      ? opportunities.filter((opp) => opp.id === "2")
      : opportunities
    : opportunities;

  return (
    <section className="flex bg-white flex-wrap gap-3 justify-center sm:justify-start ">
      {filteredOpportunities.map((opportunity) => (
        <Card
          key={opportunity.id}
          className="rounded-lg overflow-hidden shadow-none border-[#F0F1F2] w-[266px] py-0 h-[250px] cursor-pointer hover:shadow-lg transition-shadow relative"
          onClick={() =>
            router.push(`/volunteer/opportunities/${opportunity.id}`)
          }
        >
          <CardContent className="p-3">
            <div className="space-y-[10px]">
              <Image
                src={opportunity.logoSrc}
                alt={opportunity.organization}
                width={34}
                height={34}
                className="rounded-full"
              />

              <h3 className="text-sm font-semibold">{opportunity.title}</h3>

              <div className="flex items-center space-x-[10px] text-xs text-gray-500 ">
                <div className="flex items-center">
                  <Image
                    src={mapPinIcon}
                    height={14}
                    width={14}
                    className="mr-1 "
                    alt="Map pin icon"
                  />
                  <span className="text-[10px]">{opportunity.location}</span>
                </div>

                <div className="flex items-center">
                  <Image
                    src={fileIcon}
                    height={14}
                    width={14}
                    className="mr-1 "
                    alt="File icon"
                  />
                  <span className="text-[10px]">
                    {opportunity.type}; {opportunity.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center w-[114px] rounded-[2px] bg-[#EBF8F4]">
                <Image
                  src={mapPinGrayIcon}
                  height={13}
                  width={13}
                  className="mr-1 "
                  alt="Map pin gray icon"
                />
                <span className=" text-[10px] text-green-600 ">
                  Matching location
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {opportunity.categories.map((category, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[11px] bg-[#F0F0F0] rounded-[2px] font-normal py-0"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="text-xs text-gray-600 line-clamp-3 h-[51px]">
                {opportunity.description}
                <Link
                  href={`/volunteer/opportunities/${opportunity.id}`}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read more
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="absolute bottom-0 left-0 right-0 flex  items-center p-3 pt-0 ">
            <Button
              className={`${
                appliedEvents.includes(opportunity.id)
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white h-6 px-5 rounded-[6px] text-[10px] font-medium `}
              disabled={appliedEvents.includes(opportunity.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOpportunity({
                  id: opportunity.id,
                  title: opportunity.title,
                  organization: opportunity.organization,
                  date: opportunity.date,
                  time: opportunity.time,
                  location: opportunity.location,
                  logo: opportunity.logoSrc,
                });
                setIsModalOpen(true);
              }}
            >
              {appliedEvents.includes(opportunity.id) ? "Applied" : "Apply now"}
            </Button>
            <Star className="h-4 w-4 ms-1 text-yellow-400 fill-current" />
          </CardFooter>
        </Card>
      ))}

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

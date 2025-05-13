"use client";


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
  
  // Get volunteers data to calculate available spots
  const { data: volunteersData } = trpc.volunteers.getVolunteersWithAppliedEvents.useQuery(
    { eventId: '' }, // Empty string to get all volunteers with applied events
    { enabled: true }
  );
  
  // Function to calculate available spots based on applied events
  const calculateAvailableSpots = (opportunityId: string, totalSpots: number) => {
    if (!volunteersData) return totalSpots;
    
    // Count how many volunteers have applied to this opportunity
    const appliedCount = volunteersData.filter(volunteer => 
      volunteer.applied_events && volunteer.applied_events.includes(opportunityId)
    ).length;
    
    // Calculate remaining spots
    return Math.max(0, totalSpots - appliedCount);
  };

  const opportunities = [
    // {
    //   id: "1",
    //   title: "Easy Care Gardening",
    //   popup_title: "Gardening Volunteer",
    //   organization: "Easy Care Gardening",
    //   location: "Sydney, Australia",
    //   type: "One off",
    //   date: "20/05/2025",
    //   time: "10:00 AM - 02:00 PM",
    //   matchingAvailability: true,
    //   matchedSkills: 3,
    //   categories: ["Seniors & Aged Care"],
    //   description:
    //     "Do you have a passion for gardening and a desire to make a real difference in your community? We are looking for enthusiastic and friendly volunteers to help senior Australians maintain their gardens and stay in the homes they love. As a volunteer gardener, you'll work in a team to provide essential gardening services such as weeding, pruning, and mulching. Your efforts will directly contribute to creating safe and tidy outdoor spaces for elderly individuals, helping them to live independently for longer.",
    //   logoSrc: "/Easy.svg",
    //   totalSpots: 10,
    //   spotsAvailable: 10
    // },
    {
      id: "4",
      title: "Easy Care Gardening",
       popup_title: "Gardening Volunteer", // Changed from "Tree plantation Volunteer"
        organization: "Easy Care Gardening",
      location: "West Pymble, Sydney", // Different location
      type: "One off",
      date: "20/05/2025", // Changed to match id 1
      time: "10:00 AM - 02:00 PM", // Changed to match id 1
      matchingAvailability: true,
      matchedSkills: 3,
      categories: ["Seniors & Aged Care"],
      description:
      "Do you have a passion for gardening and a desire to make a real difference in your community? We are looking for enthusiastic and friendly volunteers to help senior Australians maintain their gardens and stay in the homes they love. As a volunteer gardener, you'll work in a team to provide essential gardening services such as weeding, pruning, and mulching. Your efforts will directly contribute to creating safe and tidy outdoor spaces for elderly individuals, helping them to live independently for longer.",
      logoSrc: "/Easy.svg",
      totalSpots: 10,
       spotsAvailable: 0 // Will be calculated dynamically
      },
    {
      id: "2",
      title: "Clean Up Australia",
      popup_title: "Clean Up volunteer",
      organization: "Clean Up Australia",
      location: "Hyde Park, Sydney",
      type: "One off",
      date: "21/05/2025",
      time: "01:00 PM - 04:00 PM",
      matchingAvailability: true,
      matchedSkills: 2,
      categories: ["Environmental Management"],
      description:
        "Want to help protect Australia's parks, beaches, and waterways from litter and waste? Clean Up Australia is looking for enthusiastic volunteers to help clean up general waste from our parks, beaches, and other public spaces. As a volunteer, you'll join a nationwide movement of people dedicated to keeping Australia clean and healthy. You'll work together to remove litter, protect our natural environment, and make a positive impact on your local community.",
      logoSrc: "/Clean.svg",
      totalSpots: 20,
       spotsAvailable: 0 // Will be calculated dynamically
 
    },
    // {
    //   id: "3",
    //   title: "Clean Up Australia",
    //   popup_title: "Clean Up volunteer",
    //   organization: "Clean Up Australia",
    //   location: "Sydney, Australia",
    //   type: "One off",
    //   date: "24/05/2025",
    //   time: "01:00 PM - 04:00 PM",
    //   matchingAvailability: true,
    //   matchedSkills: 2,
    //   categories: ["Environmental Management"],
    //   description:
    //     "Want to help protect Australia's parks, beaches, and waterways from litter and waste? Clean Up Australia is looking for enthusiastic volunteers to help clean up general waste from our parks, beaches, and other public spaces. As a volunteer, you'll join a nationwide movement of people dedicated to keeping Australia clean and healthy",
    //   logoSrc: "/Clean.svg",
    //   totalSpots: 20,
    //   spotsAvailable: 20
    // },
  ];

  // Calculate available spots for each opportunity
  const opportunitiesWithSpots = opportunities.map(opportunity => ({
    ...opportunity,
    spotsAvailable: calculateAvailableSpots(opportunity.id, opportunity.totalSpots)
  }));

  // Filter opportunities based on customizedFor parameter
  const filteredOpportunities = customizedFor
    ? customizedFor.toLowerCase() === "easy care"
      ? opportunitiesWithSpots.filter((opp) => ["1", "4"].includes(opp.id))
      : customizedFor.toLowerCase() === "clean up"
      ? opportunitiesWithSpots.filter((opp) => ["2", "3"].includes(opp.id))
      : opportunitiesWithSpots
    : opportunitiesWithSpots;

  return (
    <section className="w-full md:w-[57%] relative">
       <h1 className="text-[#101010] font-inter text-xxl font-bold text-center mt-8 mb-5">
       Volunteering Opportunities during National Volunteer Week 2025 (19 - 25 May)
        </h1>

      <div className="flex flex-col gap-6">
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
                <div className="flex justify-between items-center">
                  <Image
                    src={opportunity.logoSrc}
                    alt={opportunity.organization}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-1" />
                      <span className="text-sm">
                        <span className="font-medium text-green-600">{opportunity.spotsAvailable}</span> of <span className="font-medium">{opportunity.totalSpots}</span> spots left
                      </span>
                    </div>
                  </div>
                </div>

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
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {opportunity.description}
                  </div>
                 
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
                  disabled={appliedEvents.includes(opportunity.id) || opportunity.spotsAvailable <= 0}
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

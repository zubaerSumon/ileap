"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmationModal } from "../../../modals/ConfirmationModal";

// Define a type for the opportunity details
type OpportunityDetails = {
  title: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  logo: string;
};

export default function Categories({ title = "Opportunities by categories" }: { title?: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityDetails | null>(null);

  const opportunities = [
    {
      id: 1,
      title: "Easy Care Gardening",
      organization: "Easy Care",
      location: "Sydney, Australia",
      type: "One off",
      date: "20/05/2025",
      time: "10:00 AM - 02:00 PM",
      matchingAvailability: true,
      matchedSkills: 3,
      categories: ["Seniors & Aged Care"],
      description: "Do you have a passion for gardening and a desire to make a real difference in your community?...",
      logoSrc: "/Easy.svg",
    },
    {
      id: 2,
      title: "Clean Up Australia",
      organization: "Clean Up",
      location: "Sydney, Australia",
      type: "One off",
      date: "21/05/2025",
      time: "01:00 PM - 04:00 PM",
      matchingAvailability: true,
      matchedSkills: 2,
      categories: ["Environmental Management"],
      description: "Want to help protect Australia's parks, beaches, and waterways from litter and waste?...",
      logoSrc: "/Clean.svg",
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex gap-6">
          {opportunities.map((opportunity) => (
            <Card 
              key={opportunity.id}
              className="border rounded-lg overflow-hidden w-full lg:w-[350px] cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/volunteer/opportunities/${opportunity.id}`)}
            >
              <CardContent className="p-0">
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 mr-2">
                      <Image
                        src={opportunity.logoSrc}
                        alt={opportunity.organization}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <h3 className="text-base font-semibold">{opportunity.title}</h3>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                    <span>{opportunity.location}</span>
                    <Badge variant="outline" className="ml-2 px-1.5 py-0.5 text-xs">
                      {opportunity.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="ml-1">Date: {opportunity.date}</span>
                    <span className="ml-4">Time: {opportunity.time}</span>
                  </div>

                  <div className="flex space-x-3 mb-3">
                    <div className="flex items-center text-xs text-green-600">
                      <div className="w-4 h-4 mr-1">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-green-500"
                        >
                          <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span>Matching availability</span>
                    </div>

                    <div className="flex items-center text-xs text-orange-600">
                      <div className="w-4 h-4 mr-1">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-orange-500"
                        >
                          <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span>{opportunity.matchedSkills} matched skills</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {opportunity.categories.map((category, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 h-[48px] line-clamp-2 overflow-hidden">
                    {opportunity.description}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center p-3 pt-0 pb-[10px]">
                <div className="flex justify-between w-full items-center">
                  <Link
                    href={`/volunteer/opportunities/${opportunity.id}`}
                    className="text-blue-600 hover:text-blue-700 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View details
                  </Link>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOpportunity({
                        title: opportunity.title,
                        organization: opportunity.organization,
                        date: opportunity.date,
                        time: opportunity.time,
                        location: opportunity.location,
                        logo: opportunity.logoSrc
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    Apply now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
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
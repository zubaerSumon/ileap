"use client";

import { useRouter } from "next/navigation";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CleanUpAustraliaCard() {
  const router = useRouter();

  const opportunity = {
    id: 2,
    title: "Clean Up Australia",
    organization: "Clean Up",
    location: "Sydney, Australia",
    type: "One off",
    matchingAvailability: true,
    matchedSkills: 2,
    categories: ["Environmental Management"],
    description: "Want to help protect Australia's parks, beaches, and waterways from litter and waste?...",
    logoSrc: "/Clean.svg",
  };

  return (
    <Card
      className="border rounded-lg overflow-hidden w-[350px] cursor-pointer hover:shadow-lg transition-shadow"
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

          <div className="flex space-x-3 mb-3">
            <div className="flex items-center text-xs text-green-600">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mr-1 text-green-500" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Matching availability</span>
            </div>

            <div className="flex items-center text-xs text-orange-600">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mr-1 text-orange-500" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{opportunity.matchedSkills} matched skills</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {opportunity.categories.map((category, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs font-normal">
                {category}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {opportunity.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-3 pt-0">
        <div className="flex gap-2 items-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/volunteer/opportunities/${opportunity.id}`);
            }}
          >
            Apply now
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-yellow-400 h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Star className="h-4 w-4 fill-current" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

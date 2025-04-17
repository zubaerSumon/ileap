"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { PostContent } from "@/app/(withLayout)/organization/opportunity/view/components/opportunity/PostContent";
import { Sidebar } from "@/app/(withLayout)/organization/opportunity/view/components/opportunity/Sidebar";
import { useState } from "react";

export default function Categories({ title = "Opportunities by categories" }: { title?: string }) {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const opportunity = {
    id: 1,
    title: "Seek help",
    organization: "All In",
    location: "Sydney, Australia",
    type: "Regular",
    matchingAvailability: true,
    matchedSkills: 3,
    categories: ["Human Rights", "Health & Medicine", "Education & Literacy"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...",
    logoSrc: "/v1.svg",
  };


  if (showDetails) {
    return (
      <div className="mb-8 pt-20">
        <button 
          onClick={() => setShowDetails(false)} 
          className="flex items-center gap-2 text-gray-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-8">
          <PostContent />
          <div className="w-[1px] bg-gray-200"></div>
          <Sidebar />
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Link
            href="/opportunities"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <Card 
          className="border rounded-lg overflow-hidden w-[350px] cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowDetails(true)}
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
                  e.stopPropagation(); // Prevent card click when clicking the button
                  router.push(`/organization/opportunity/${opportunity.id}`);
                }}
              >
                Apply now
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-yellow-400 h-8 w-8"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the star
              >
                <Star className="h-4 w-4 fill-current" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

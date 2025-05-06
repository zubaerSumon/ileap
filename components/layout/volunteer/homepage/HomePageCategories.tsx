"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// In the component definition, add the title prop
export default function Categories({ title = "Opportunities by categories" }: { title?: string }) {
  const opportunities = [
    {
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
    },
    {
      id: 2,
      title: "Environmental Champions Needed!",
      organization: "Red Cross",
      location: "Sydney, Australia",
      type: "Regular",
      matchingAvailability: true,
      matchedSkills: 3,
      categories: ["Disaster Relief", "Emergency & Safety"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...",
      logoSrc: "/v2.svg",
    },
    {
      id: 3,
      title: "Seek help",
      organization: "All In",
      location: "Sydney, Australia",
      type: "Regular",
      matchingAvailability: true,
      matchedSkills: 3,
      categories: ["Education & Literacy"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...",
      logoSrc: "/v3.svg",
    },
    {
      id: 4,
      title: "Seek help",
      organization: "All In",
      location: "Sydney, Australia",
      type: "Regular",
      matchingAvailability: true,
      matchedSkills: 3,
      categories: ["Human Rights", "Health & Medicine", "Education & Literacy"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...",
      logoSrc: "/v4.svg",
    },
  ];

  const OpportunityCard = ({
    opportunity,
  }: {
    opportunity: (typeof opportunities)[0];
  }) => (
    <Card className="border rounded-lg overflow-hidden">
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
            Apply now
          </Button>
          <Button variant="ghost" size="icon" className="text-yellow-400 h-8 w-8">
            <Star className="h-4 w-4 fill-current" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

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

        <Tabs defaultValue="nearby" className="w-full">
          <TabsList className="mb-6 bg-transparent inline-flex justify-start space-x-4  p-0 h-auto">
            <TabsTrigger
              value="nearby"
              className="px-3 py-1.5 rounded-t-lg data-[state=active]:bg-gray-100 data-[state=active]:border-none text-xs font-medium border-0 h-auto"
            >
              Nearby Opportunities
            </TabsTrigger>
            <TabsTrigger
              value="interests"
              className="px-3 py-1.5 rounded-t-lg data-[state=active]:bg-gray-100 data-[state=active]:border-none text-xs font-medium border-0 h-auto"
            >
              Your interests
            </TabsTrigger>
            <TabsTrigger
              value="newest"
              className="px-3 py-1.5 rounded-t-lg data-[state=active]:bg-gray-100 data-[state=active]:border-none text-xs font-medium border-0 h-auto"
            >
              Newest Opportunities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nearby" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interests" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {opportunities.slice(1, 4).map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="newest" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {opportunities.slice(2).map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

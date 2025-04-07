"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Share,
  Edit,
  ArrowLeftRight,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function OpportunityView() {
  const router = useRouter();

  return (
    <div className="w-[1048px] mx-auto bg-white min-h-screen pt-6">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-semibold">
              Emergency & Safety for earthquake affected area
            </h1>
          
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="post" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-full h-12">
            <TabsTrigger 
              value="post" 
              className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD]"
            >
              Post Details
            </TabsTrigger>
            <TabsTrigger 
              value="recruits" 
              className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD]"
            >
              Recruits
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD]"
            >
              Review Application (Short Listed)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="mt-6">
            <div className="flex gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Posted 7 days ago</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Edit className="h-4 w-4" />
                      Edit post
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-4">Seek help</h2>
                  <p className="text-gray-600 mb-4">
                    Are you passionate about animal welfare and ready to take
                    action? We&apos;re seeking compassionate volunteers to help
                    provide care and support to animals in need. Whether you
                    have a few hours or want to dedicate more time, there&apos;s
                    a role for everyone!
                  </p>

                  <h3 className="font-medium mb-2">
                    Volunteer Roles Available:
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>
                      Animal Care: Help with feeding, bathing, and providing
                      comfort to rescued animals.
                    </li>
                    <li>
                      Transportation: Assist in transporting animals to shelters
                      or veterinary clinics.
                    </li>
                    <li>
                      Fundraising & Awareness: Organize or participate in events
                      to raise awareness and funds for animal care.
                    </li>
                    <li>
                      Fostering: Provide temporary homes for animals until
                      they&apos;re adopted.
                    </li>
                    <li>
                      Social Media & Photography: Share stories and updates
                      online to help find forever homes for animals.
                    </li>
                  </ul>

                  <h3 className="font-medium mb-2">Why Volunteer with Us?</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>Make a positive impact on animal lives.</li>
                    <li>Join a community of animal lovers.</li>
                    <li>
                      Gain new skills and experiences in animal care and
                      welfare.
                    </li>
                    <li>Help spread kindness and compassion.</li>
                  </ul>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Driving license</li>
                        <li>First Aid training</li>
                        <li>Police check</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Skills</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Communication</li>
                        <li>Teamwork</li>
                        <li>Empathy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] bg-gray-200"></div>

              {/* Sidebar */}
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
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Emergency & Safety
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Health & Medicine
                      </span>
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded text-[12px]">
                      Animal welfare
                    </span>
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
                  <div className="space-y-3">
                    <h3 className="font-medium">Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">Driving license</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">First Aid training</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">Police check</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium">Skills</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">Communication</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">Teamwork</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">Empathy</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

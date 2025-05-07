"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ConfirmationModal } from "../../../modals/ConfirmationModal";
import { trpc } from "@/utils/trpc";
import fileIcon from "../../../../public/icons/file-icon.svg";
import mapPinIcon from "../../../../public/icons/map-pin-icon.svg";
import mapPinGrayIcon from "../../../../public/icons/map-pin-gray-icon.svg";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

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
      ? opportunities.filter((opp) => opp.id === "1")
      : customizedFor.toLowerCase() === "clean up"
      ? opportunities.filter((opp) => ["2", "3"].includes(opp.id))
      : opportunities
    : opportunities;

  // Custom pagination handler
  const handlePaginationClick = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  return (
    <section className="w-full md:w-[53%] relative">
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        onSwiper={(swiper) => {
          // Set total number of slides
          setTotalSlides(filteredOpportunities.length);
          
          // Assign swiper instance to the refs for navigation
          if (swiper.params.navigation) {
            // @ts-expect-error - Swiper types are not properly typed for custom navigation
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-expect-error - Swiper types are not properly typed for custom navigation
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        className="relative"
      >
        {filteredOpportunities.map((opportunity) => (
          <SwiperSlide key={opportunity.id}>
            <Card
              className="rounded-lg overflow-hidden w-full max-w-[320px] mx-auto py-0 h-[340px] cursor-pointer hover:shadow-lg transition-shadow relative"
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

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
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
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination - only visible on mobile */}
      <div className="md:hidden flex justify-center items-center w-full mt-6">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePaginationClick(index)}
            className={`mx-1 w-2 h-2 rounded-full pagination-bullet ${
              activeIndex === index ? "bg-blue-600 active" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Custom navigation buttons positioned at the right */}
      <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
        <div
          style={{
            borderRadius: "25px 0px 0px 25px",
            boxShadow: "1px 4px 16px 0px rgba(134, 145, 155, 0.11)",
            background: "rgba(246, 246, 246, 0.82)",
          }}
          className="bg-white border border-[#F3F3F3] p-1.5 flex items-center"
        >
          <div
            ref={prevRef}
            className={`cursor-pointer flex items-center justify-center transition-colors ${
              activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
            }`}
          >
            <ChevronLeft size={20} className="text-blue-600" />
          </div>
          <div className="w-[1px] h-7 bg-gray-200 mx-1.5" />
          <div
            ref={nextRef}
            className={`cursor-pointer flex items-center justify-center transition-colors ${
              activeIndex >= totalSlides - 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
            }`}
          >
            <ChevronRight size={20} className="text-blue-600" />
          </div>
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Opportunity } from "@/types/opportunities";
import { formatDistanceToNow } from "date-fns";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface OpportunityCarouselProps {
  opportunities: Opportunity[];
  isLoading?: boolean;
  title: string;
  viewAllLink?: string;
}

const OpportunityCarousel = ({
  opportunities,
  isLoading,
  title,
  viewAllLink,
}: OpportunityCarouselProps) => {
  const router = useRouter();

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        {viewAllLink && (
          <button
            className="flex cursor-pointer items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors whitespace-nowrap hover:text-blue-800"
            onClick={() => router.push(viewAllLink)}
          >
            View All{" "}
            <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden sm:block">
          <button
            className="border border-blue-600 text-blue-700 bg-white rounded-full p-2 hover:bg-blue-100 flex items-center justify-center transition-colors shadow"
            title="Scroll left"
            id="opp-swiper-prev"
          >
            <ChevronLeft />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden sm:block">
          <button
            className="border border-blue-600 text-blue-700 bg-white rounded-full p-2 hover:bg-blue-100 flex items-center justify-center transition-colors shadow"
            title="Scroll right"
            id="opp-swiper-next"
          >
            <ChevronRight />
          </button>
        </div>

        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          className="pb-12"
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: "#opp-swiper-next",
            prevEl: "#opp-swiper-prev",
          }}
          pagination={{
            el: ".custom-opp-swiper-pagination",
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            356: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 24,
              pagination: false,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
        >
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <SwiperSlide
                  key={`loading-${index}`}
                  className="!flex !justify-center"
                >
                  <div className="w-full">
                    <div className="hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden w-full py-0 cursor-pointer relative bg-white border">
                      <div className="p-4">
                        <div className="flex flex-col h-[280px]">
                          <div className="flex justify-between items-start mb-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                          </div>
                          <Skeleton className="h-6 w-32 mb-2" />
                          <div className="flex items-center gap-3 mb-3">
                            <Skeleton className="h-4 w-24" />
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                          </div>
                          <Skeleton className="h-4 w-full mb-4 flex-1" />
                          <div className="flex gap-2 mt-auto">
                            <Skeleton className="h-9 flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            : opportunities.map((opportunity) => (
                <SwiperSlide 
                  key={opportunity._id} 
                  className="!flex !justify-center"
                >
                  <div className="w-full">
                    <div className="hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden w-full py-0 cursor-pointer relative bg-white border">
                      <div className="p-4">
                        <div className="flex flex-col h-[280px]">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 mr-3">
                                <Image
                                  src={
                                    opportunity?.organization_profile
                                      ?.profile_img || "/default-org-logo.svg"
                                  }
                                  alt={
                                    opportunity?.organization_profile?.title ||
                                    "Organization Logo"
                                  }
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              </div>
                              <h3
                                className="text-lg font-semibold cursor-pointer hover:text-blue-600 line-clamp-2"
                                onClick={() =>
                                  router.push(
                                    `/volunteer/opportunities/${opportunity._id}`
                                  )
                                }
                              >
                                {opportunity.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                            <span>{opportunity.location}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge
                              variant="outline"
                              className="px-2 py-0.5 text-xs"
                            >
                              {opportunity.commitment_type === "workbased"
                                ? "Work based"
                                : "Event based"}
                            </Badge>
                            {opportunity.category.slice(0, 1).map(
                              (cat: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs font-normal"
                                >
                                  {cat}
                                </Badge>
                              )
                            )}
                            {opportunity.category.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs font-normal text-gray-500"
                              >
                                +{opportunity.category.length - 1} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1">
                            <div
                              className="text-sm text-gray-600 line-clamp-3"
                              dangerouslySetInnerHTML={{
                                __html: opportunity.description,
                              }}
                            />
                          </div>

                          <div className="mt-auto pt-4">
                            <div className="text-xs text-gray-500 mb-2">
                              Posted{" "}
                              {formatDistanceToNow(opportunity.createdAt, {
                                addSuffix: true,
                              })}
                            </div>
                            {opportunity.date?.start_date && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(opportunity.date.start_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                                {opportunity.time?.start_time && (
                                  <>
                                    <Clock className="h-3 w-3 ml-2" />
                                    {formatTimeToAMPM(opportunity.time.start_time)}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
        <div>
          <div className="custom-opp-swiper-pagination translate-x-8 mx-auto mt-2 md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default OpportunityCarousel; 
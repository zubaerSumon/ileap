import VolunteerCard from "@/components/layout/organisation/VolunteerCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Volunteer {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
  volunteer_profile?: {
    student_type?: "yes" | "no";
    course?: string;
    availability_date?: {
      start_date?: string;
      end_date?: string;
    };
    interested_on?: string[];
    bio?: string;
  };
}

interface VolunteerCarouselProps {
  volunteers: Volunteer[];
  isLoading?: boolean;
  onConnect: (volunteer: Volunteer) => void;
}

const VolunteerCarousel = ({
  volunteers,
  isLoading,
  onConnect,
}: VolunteerCarouselProps) => (
  <div className="relative ">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden sm:block">
      <button
        className="border border-blue-600 text-blue-700 bg-white rounded-full p-2 hover:bg-blue-100 flex items-center justify-center transition-colors shadow"
        title="Scroll left"
        id="vol-swiper-prev"
      >
        <ChevronLeft />
      </button>
    </div>
    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden sm:block">
      <button
        className="border border-blue-600 text-blue-700 bg-white rounded-full p-2 hover:bg-blue-100 flex items-center justify-center transition-colors shadow"
        title="Scroll right"
        id="vol-swiper-next"
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
        nextEl: "#vol-swiper-next",
        prevEl: "#vol-swiper-prev",
      }}
      pagination={{
        el: ".custom-swiper-pagination",
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
              <div className="w-full flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-4 w-48 mb-3" />
                <Skeleton className="h-8 w-full" />
              </div>
            </SwiperSlide>
          ))
        : volunteers.map((vol) => (
            <SwiperSlide 
              key={vol._id} 
              className="!flex !justify-center"
            >
              <div className="w-full">
                <VolunteerCard volunteer={vol} onConnect={onConnect} />
              </div>
            </SwiperSlide>
          ))}
    </Swiper>
    <div>
      <div className="custom-swiper-pagination translate-x-8 mx-auto  mt-2 md:hidden" />
    </div>
  </div>
);

export default VolunteerCarousel;

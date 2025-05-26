import VolunteerCard from "./VolunteerCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from "lucide-react";
import 'swiper/css/navigation';

interface Volunteer {
  id: string;
  name: string;
  country: string;
  jobs: number;
  rate: string;
  lastContract: string;
  avatar: string;
}

interface VolunteerCarouselProps {
  volunteers: Volunteer[];
}

const VolunteerCarousel = ({ volunteers }: VolunteerCarouselProps) => (
  <div className="relative">
   
 
     <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
      <button
        className="border border-blue-600 text-blue-700 bg-white rounded-full p-2 hover:bg-blue-100 flex items-center justify-center transition-colors shadow"
        title="Scroll left"
        id="vol-swiper-prev"
      >
        <ChevronLeft />
      </button>
    </div>
    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
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
      slidesPerView="auto"
      className="pb-2"
      modules={[Navigation]}
      navigation={{
        nextEl: '#vol-swiper-next',
        prevEl: '#vol-swiper-prev',
      }}
    >
      {volunteers.map((vol) => (
        <SwiperSlide
          key={vol.id}
          className="!flex !justify-center"
          style={{ width: 284 }}
        >
          <VolunteerCard
            avatar={vol.avatar}
            name={vol.name}
            country={vol.country}
            jobs={vol.jobs}
            rate={vol.rate}
            lastContract={vol.lastContract}
            onRehire={() => {}}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default VolunteerCarousel; 
import VolunteerCategories from "@/components/landing-page/VolunteerCategories";
import Hero from "../components/landing-page/Hero";
import VideoTestimonial from "../components/landing-page/VideoTestimonial";
import Volunteers from "@/components/landing-page/Volunteer";
import RegistrationBanner from "@/components/RegistrationBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <VolunteerCategories/>
      <VideoTestimonial />
      <Volunteers/>
      <RegistrationBanner />
    </main>
  );
}

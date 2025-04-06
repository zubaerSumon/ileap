import VolunteerCategories from "@/components/layout/unprotected/landing-page/VolunteerCategories";
import Volunteers from "@/components/layout/unprotected/landing-page/Volunteer";
import RegistrationBanner from "@/components/RegistrationBanner";
import Hero from "@/components/layout/unprotected/landing-page/Hero";
import VideoTestimonial from "@/components/layout/unprotected/landing-page/VideoTestimonial";

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

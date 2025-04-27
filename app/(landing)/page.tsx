// import VolunteerCategories from "@/components/layout/landing/landing-page/VolunteerCategories";
// import Volunteers from "@/components/layout/landing/landing-page/Volunteer";
// import RegistrationBanner from "@/components/RegistrationBanner";
// import Hero from "@/components/layout/landing/landing-page/Hero";
// import VideoTestimonial from "@/components/layout/landing/landing-page/VideoTestimonial";

import HeroSection from "@/components/layout/landing/ausleap/about/HeroSection";
import ProgramBenefits from "@/components/layout/landing/ausleap/about/ProgramBenefits";
import WhatIsAusLEAP from "@/components/layout/landing/ausleap/about/WhatIsAusLEAP";
import RegistrationBanner from "@/components/RegistrationBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <Hero />
      <VolunteerCategories/>
      <VideoTestimonial />
      <Volunteers/>
      <RegistrationBanner />
       */}

      <HeroSection />
      <WhatIsAusLEAP />
      <ProgramBenefits />
      <RegistrationBanner
        title="AusLEAP 2025 registration has just opened!"
        description="We're here to help. If you have any questions about volunteering, donations, or our programs, please feel free to reach out. We look forward to hearing from you!"
        buttonText="Join us now"
      />
    </main>
  );
}

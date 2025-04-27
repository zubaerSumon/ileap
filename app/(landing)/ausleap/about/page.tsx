"use client";

import HeroSection from "../../../../components/layout/landing/ausleap/about/HeroSection";
import WhatIsAusLEAP from "../../../../components/layout/landing/ausleap/about/WhatIsAusLEAP";
import ProgramBenefits from "../../../../components/layout/landing/ausleap/about/ProgramBenefits";
// import WorkshopOverview from "../../../../components/layout/landing/ausleap/about/WorkshopOverview";
import RegistrationBanner from "@/components/RegistrationBanner";

export default function AusLEAPAboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhatIsAusLEAP />
      <ProgramBenefits />
      <RegistrationBanner
        title="AusLEAP 2025 registration has just opened!"
        description="We're here to help. If you have any questions about volunteering, donations, or our programs, please feel free to reach out. We look forward to hearing from you!"
        buttonText="Join us now"
      />
      {/* <WorkshopOverview /> */}
      
    </div>
  );
}

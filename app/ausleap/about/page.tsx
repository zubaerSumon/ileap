'use client';

import HeroSection from '../../../components/ausleap/about/HeroSection';
import WhatIsAusLEAP from '../../../components/ausleap/about/WhatIsAusLEAP';
import ProgramBenefits from '../../../components/ausleap/about/ProgramBenefits';
import WorkshopOverview from '../../../components/ausleap/about/WorkshopOverview';
 import RegistrationBanner from '@/components/RegistrationBanner';

export default function AusLEAPAboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhatIsAusLEAP />
      <ProgramBenefits />
      <WorkshopOverview />
      <RegistrationBanner />
    </div>
  );
}
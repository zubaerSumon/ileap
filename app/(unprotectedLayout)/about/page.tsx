'use client';

import WhyILEAP2 from '@/components/layout/unprotected/about/WhyILEAP2';
import AboutHero from '../../../components/layout/unprotected/about/AboutHero';
import VisionMission from '../../../components/layout/unprotected/about/VisionMission';
import WhyILEAP from '../../../components/layout/unprotected/about/WhyILEAP';
import Categories from '../../../components/Categories';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <VisionMission />
      <WhyILEAP />
      <WhyILEAP2/>
      <Categories />
    </main>
  );
}
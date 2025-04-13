'use client';

import WhyILEAP2 from '@/components/layout/landing/about/WhyILEAP2';
import AboutHero from '../../../components/layout/landing/about/AboutHero';
import VisionMission from '../../../components/layout/landing/about/VisionMission';
import WhyILEAP from '../../../components/layout/landing/about/WhyILEAP';
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
'use client';

import WhyILEAP2 from '@/components/about/WhyILEAP2';
import AboutHero from '../../components/about/AboutHero';
import VisionMission from '../../components/about/VisionMission';
import WhyILEAP from '../../components/about/WhyILEAP';
import Categories from '../../components/Categories';

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
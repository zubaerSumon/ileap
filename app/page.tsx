 
 
 import Hero from '../components/landing-page/Hero';
import VideoTestimonial from '../components/landing-page/VideoTestimonial';
import Benefits from '../components/landing-page/Benefits';
import RegistrationBanner from '@/components/RegistrationBanner';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <VideoTestimonial />
      <Benefits />
      <RegistrationBanner />
    </main>
  );
}

// Ensure this is at the top
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RegistrationBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export default function RegistrationBanner({
  title = "Learn more about AusLEAP",
  description = "Ready to get started? Signing up is easy and free",
  buttonText = "Sign me up",
}: RegistrationBannerProps) {
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/signup?role=volunteer');
  };

  return (
    <div className="bg-[#1649B8] py-16 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-22" 
        style={{ backgroundImage: "url('/raised-hands.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50"></div>

      <div className="container mx-auto px-4 text-left relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-4xl text-white mb-4 font-semibold">
            {title}
          </h2>
          
          <p className="text-blue-100 mb-8">
            {description}
          </p>
          
          <Button 
            className="bg-black hover:bg-gray-900 text-white border-none" 
            size="lg"
            onClick={handleSignUp}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

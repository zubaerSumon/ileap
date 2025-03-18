'use client';

import { Button } from "@/components/ui/button";

export default function RegistrationBanner() {
  return (
    <div className="bg-blue-600 py-16 relative overflow-hidden">
      {/* Background overlay with raised hands image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ 
          backgroundImage: "url('/raised-hands.jpg')" 
        }}
      ></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          AusLEAP 2025 registration has just opened!
        </h2>
        
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          We&apos;re here to help. If you have any questions about volunteering, donations, or our programs, please
          feel free to reach out. We look forward to hearing from you!
        </p>
        
        <Button 
          className="bg-black hover:bg-gray-900 text-white border-none"
          size="lg"
        >
          Join us now
        </Button>
      </div>
    </div>
  );
}
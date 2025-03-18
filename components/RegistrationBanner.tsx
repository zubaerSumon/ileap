'use client';

import { Button } from "@/components/ui/button";

export default function RegistrationBanner() {
  return (
    <div className="bg-[#1649B8] py-16 relative overflow-hidden">
      {/* Background overlay with raised hands image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-22" 
        style={{ 
          backgroundImage: "url('/raised-hands.jpg')" 
        }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50"></div>
      
      <div className="container mx-auto px-4 text-left relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            Learn more about iLEAP
          </h2>
          
          <p className="text-blue-100 mb-8">
            Ready to get started? Signing up is easy and free
          </p>
          
          <Button 
            className="bg-black hover:bg-gray-900 text-white border-none"
            size="lg"
          >
            Sign me up
          </Button>
        </div>
      </div>
    </div>
  );
}
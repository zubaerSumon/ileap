"use client";
import React from "react";

import MiniGallery from "@/components/layout/volunteer/homepage/MiniGallery";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Categories from "@/components/layout/volunteer/homepage/HomePageCategories";
 
const VolunteerPage = () => {
  return (
    <ProtectedLayout>
      <div className="px-4 flex flex-col items-center pb-40">
        <h1 className="text-[#101010] font-inter text-3xl font-bold text-center mt-8 mb-2">
          Welcome 2025 AusLeap Participants
        </h1>
        
        <p className="text-[#8D8D8D] text-lg font-inter text-m font-medium text-center mb-12">
          We have some new volunteering opportunities available for you
        </p>
          
        {/* Update layout to flex-row for horizontal alignment on larger screens */}
        <div className="flex flex-col md:flex-row justify-between space-y-5 w-full gap-10">
          <Categories />
          <MiniGallery />
        </div>
      </div>{" "}
     </ProtectedLayout>
  );
};

export default VolunteerPage;

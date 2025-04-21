"use client";
import React from "react";

import Footer from "@/components/Footer";
import MiniGallery from "@/components/layout/volunteer/homepage/MiniGallery";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Categories from "@/components/layout/volunteer/homepage/HomePageCategories";
 
const VolunteerPage = () => {
  return (
    <ProtectedLayout>
      <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center pb-40">
        <h1 className="text-[#101010] font-inter text-4xl font-bold text-center mt-8 mb-2">
          Welcome 2025 AusLeap Participants
        </h1>
        <p className="text-[#8D8D8D] font-inter text-m font-medium text-center mb-12">
          We have some new volunteering opportunities available for you
        </p>
        {/* Update layout to flex-row for horizontal alignment */}
        <div className="flex flex-row gap-8">
          <Categories />
          <MiniGallery />
        </div>
      </div>
      <Footer />
    </ProtectedLayout>
  );
};

export default VolunteerPage;

"use client";
import React from "react";
 import Categories from "../../../components/layout/volunteer/homepage/HomePageCategories";

import Footer from "@/components/Footer";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
 
const VolunteerPage = () => {
  return (
    <ProtectedLayout>
      <div className="max-w-[1280px] mx-auto px-4 pb-20">
        <Categories title="Opportunities Available for you right now" />
      </div>
      <Footer />
    </ProtectedLayout>
  );
};

export default VolunteerPage;

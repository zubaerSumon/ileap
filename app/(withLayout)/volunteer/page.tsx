"use client";
import React, { useState } from "react";
import HomePageHero from "../../../components/layout/volunteer/homepage/HomePageHero";
import Categories from "../../../components/layout/volunteer/homepage/HomePageCategories";
import HomePageSuggestions from "@/components/layout/volunteer/homepage/HomePageSuggestions";
import Footer from "@/components/Footer";
import RegistrationBanner from "@/components/RegistrationBanner";
import { StudentInfoModal } from "@/components/layout/volunteer/StudentInfoModal";

const Page = () => {
  const [showModal, setShowModal] = useState(true);

  const handleComplete = async (data: unknown) => {
    try {
      console.log("Form data:", data);
      // Add your API call here
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div>
      <StudentInfoModal 
        open={showModal} 
        onOpenChange={setShowModal}
        onComplete={handleComplete}
      />
      <HomePageHero />
      <RegistrationBanner
        title="Are you an International Student?"
        description="Learn more about the AusLEAP program"
        buttonText="Join us now"
      />
      <HomePageSuggestions/>

      <div className="max-w-[1280px] mx-auto px-4 pb-20">
        <Categories title="Opportunities by categories" />
        <Categories title="Most popular opportunities" />
      </div>
      <Footer />
    </div>
  );
};

export default Page;

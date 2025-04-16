"use client";
import React, { useEffect, useState } from "react";
import HomePageHero from "../../../components/layout/volunteer/homepage/HomePageHero";
import Categories from "../../../components/layout/volunteer/homepage/HomePageCategories";
import HomePageSuggestions from "@/components/layout/volunteer/homepage/HomePageSuggestions";
import Footer from "@/components/Footer";
import RegistrationBanner from "@/components/RegistrationBanner";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useHasProfile } from "@/hooks/useHasProfile";
import { CreateVolunteerProfileModal } from "@/components/layout/volunteer/CreateVolunteerProfileModal";
 
const VolunteerPage = () => {
  const { hasProfile, checkProfile } = useHasProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);
 
  useEffect(() => {
    checkProfile();
  }, []);

  useEffect(() => {
    if (hasProfile === false) {
      setShowProfileModal(true);
    }
  }, [hasProfile]);

  return (
    <ProtectedLayout>
      <CreateVolunteerProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <HomePageHero />
      <RegistrationBanner
        title="Are you an International Student?"
        description="Learn more about the AusLEAP program"
        buttonText="Join us now"
      />
      <HomePageSuggestions />

      <div className="max-w-[1280px] mx-auto px-4 pb-20">
        <Categories title="Opportunities by categories" />
        <Categories title="Most popular opportunities" />
      </div>
      <Footer />
    </ProtectedLayout>
  );
};

export default VolunteerPage;

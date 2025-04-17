"use client";
import React, { useEffect, useState } from "react";

import Categories from "../../../components/layout/volunteer/homepage/HomePageCategories";

import Footer from "@/components/Footer";

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

      <div className="max-w-[1280px] mx-auto px-4 pb-20">
        <Categories title="Opportunities Available for you right now" />
       
      </div>
      <Footer />
    </ProtectedLayout>
  );
};

export default VolunteerPage;

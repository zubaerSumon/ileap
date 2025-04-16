import React from "react";
import HomePageHero from "../../../components/layout/volunteer/homepage/HomePageHero";
import Categories from "../../../components/layout/volunteer/homepage/HomePageCategories";
import HomePageSuggestions from "@/components/layout/volunteer/homepage/HomePageSuggestions";
import Footer from "@/components/Footer";
import RegistrationBanner from "@/components/RegistrationBanner";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

const page = () => {
  return (
    <ProtectedLayout>
      <HomePageHero />
      <RegistrationBanner
        title="Are you an International Student?"
        description="Learn more about the AusLEAP program"
        buttonText="Join us now"
      />
      <HomePageSuggestions/>

      <div className="max-w-[1280px] mx-auto px-4 pb-20">
        <Categories title="Opportunities by categories" />
        <Categories  title="Most popular opportunities" />
      </div>
      <Footer />
    </ProtectedLayout>
  );
};

export default page;

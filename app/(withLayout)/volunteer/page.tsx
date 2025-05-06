import React from "react";
import HomePageHero from "../../../components/layout/volunteer/homepage/HomePageHero";
import Categories from "../../../components/layout/volunteer/homepage/HomePageCategories";
import HomePageSuggestions from "@/components/layout/volunteer/homepage/HomePageSuggestions";

const page = () => {
  return (
    <div>
      <HomePageHero />
      <HomePageSuggestions/>

      <div className="max-w-[1280px] mx-auto px-4">
        <Categories title="Volunteer by categories" />
        <Categories title="Most popular volunteers" />
      </div>
    </div>
  );
};

export default page;

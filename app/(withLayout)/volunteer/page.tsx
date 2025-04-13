import React from "react";
import HomePageHero from "../../../components/layout/volunteer/homepage/HomePageHero";
import Categories from "../../../components/layout/volunteer/homepage/HomePageCategories";

const page = () => {
  return (
    <div>
      <HomePageHero />

      <Categories title="Volunteer by categories" />
      <Categories title="Most popular volunteers" />
    </div>
  );
};

export default page;

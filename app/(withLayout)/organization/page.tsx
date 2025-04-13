import React from "react";
import HomePageHero from "../../../components/layout/organization/homepage/HomePageHero";
import Categories from "../../../components/layout/organization/homepage/HomePageCategories";

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

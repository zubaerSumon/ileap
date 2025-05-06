import React from "react";
import HomePageHero from "../../../components/layout/organization/homepage/HomePageHero";
import Categories from "../../../components/layout/organization/homepage/HomePageCategories";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

const page = () => {
  return (
    <ProtectedLayout>
      <HomePageHero />

      <Categories title="Volunteer by categories" />
      <Categories title="Most popular volunteers" />
    </ProtectedLayout>
  );
};

export default page;

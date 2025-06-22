"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import React from "react";
import { useParams } from "next/navigation";
 import OrganisationHomepage from "@/components/layout/organisation/home-page";
import VolunteerHomepage from "@/components/layout/volunteer/home-page";
 
const RoleBasedHomePage = () => {
  const params = useParams();
  const role = params.role as string;

  const renderHomepage = () => {
    if (role === "volunteer") {
      return <VolunteerHomepage />;
    }

    if (role === "organisation") {
      return <OrganisationHomepage />;
    }

    return <div>Invalid role: {role}</div>;
  };

  return <ProtectedLayout>{renderHomepage()}</ProtectedLayout>;
};

export default RoleBasedHomePage;

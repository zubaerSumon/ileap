"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import OrganisationDashboard from "@/components/layout/organisation/dashboard";
import React from "react";
import { useParams } from "next/navigation";
import VolunteerDashboard from "@/components/layout/volunteer/dashboard";

const DashboardPage = () => {
  const params = useParams();
  const role = params.role as string;

  const renderDashboard = () => {
    switch (role) {
      case "organisation":
        return <OrganisationDashboard />;
      case "volunteer":
        return <VolunteerDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <p className="text-gray-600">Invalid role: {role}</p>
          </div>
        );
    }
  };

  return <ProtectedLayout>{renderDashboard()}</ProtectedLayout>;
};

export default DashboardPage;

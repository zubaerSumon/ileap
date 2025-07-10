import FindVolunteer from "@/components/layout/organisation/find-volunteer";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import React from "react";

const FindVolunteerPage = () => {
  return (
    <ProtectedLayout>
      <FindVolunteer />
    </ProtectedLayout>
  );
};

export default FindVolunteerPage;

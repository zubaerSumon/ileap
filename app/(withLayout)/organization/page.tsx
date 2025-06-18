import React from "react";
import OrganizerHomePage from "@/components/layout/organisation/search/BrowseVolunteer";

import ProtectedLayout from "@/components/layout/ProtectedLayout";

const page = () => {
  return (
    <ProtectedLayout>
      <OrganizerHomePage />
    </ProtectedLayout>
  );
};

export default page;

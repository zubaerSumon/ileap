import ProtectedLayout from "@/components/layout/ProtectedLayout";
import OrganizationHomepage from "@/components/layout/organisation/home/OrganizationHomepage";
import React from "react";

export default function page() {
  return (
    <ProtectedLayout>
      <OrganizationHomepage />
    </ProtectedLayout>
  );
}

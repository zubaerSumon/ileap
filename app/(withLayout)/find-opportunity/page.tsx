import ProtectedLayout from "@/components/layout/ProtectedLayout";
import FindOpportunity from "@/components/layout/volunteer/find-opportunity";
import React from "react";

const FindOpportunityPage = () => {
  return (
    <ProtectedLayout>
      <FindOpportunity />
    </ProtectedLayout>
  );
};
export default FindOpportunityPage;
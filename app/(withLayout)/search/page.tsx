"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import FindOpportunity from "@/components/layout/volunteer/find-opportunity";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import OrganizationHomepage from "@/components/layout/organisation/home/OrganizationHomepage";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const query = searchParams.get("q");

  console.log("Search Type:", type);
  console.log("Search Query:", query);

  return (
    <ProtectedLayout> 
      {type === "volunteer" && < OrganizationHomepage />}
      {type === "opportunity" && <FindOpportunity />}
      {!type && (
        <div>Please specify a search type (volunteer or opportunity)</div>
      )}
    </ProtectedLayout>
  );
};

export default SearchPage;

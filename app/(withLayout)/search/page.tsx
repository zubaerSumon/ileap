"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
 import ProtectedLayout from "@/components/layout/ProtectedLayout";
import BrowseVolunteer from "@/components/layout/organisation/find-volunteer";
import FindOpportunity from "@/components/layout/volunteer/find-opportunity";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
 
 

  return (
    <ProtectedLayout> 
      {type === "volunteer" && < BrowseVolunteer />}
      {type === "opportunity" && <FindOpportunity />}
      {!type && (
        <div>Please specify a search type (volunteer or opportunity)</div>
      )}
    </ProtectedLayout>
  );
};

export default SearchPage;

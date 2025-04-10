"use client";

import { Header } from "./opportunity/Header";
import { OpportunityTabs } from "./opportunity/OpportunityTabs";

export default function OpportunityView() {
  return (
    <div className="w-[1048px] mx-auto bg-white min-h-screen mt-8">
      <div className="p-8">
        <Header />
        <OpportunityTabs />
      </div>
    </div>
  );
}

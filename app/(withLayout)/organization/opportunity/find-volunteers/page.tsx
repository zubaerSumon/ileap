import React from "react";
import FindVolunteer from "./components/Findvolunteer";
import Hero from "./components/Hero";

export default function page() {
  return (
    <>
      <Hero />
      <div className="max-w-[1068px] max-h-auto mx-auto px-4 bg-[#F5F7FA] p-12">
        <div className="bg-white rounded-lg p-8">
          <FindVolunteer />
        </div>
      </div>
    </>
  );
}

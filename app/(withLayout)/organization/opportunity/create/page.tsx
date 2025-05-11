"use client";

import { useState } from "react";
import BasicInformation from "./_components/BasicInformation";
import ScheduleRecurrence from "./_components/ScheduleRecurrence";
import CreateFooter from "./_components/CreateFooter";

export default function CreateOpportunityPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {currentStep === 1 ? <BasicInformation /> : <ScheduleRecurrence />}
      <CreateFooter 
        step={currentStep} 
        onNext={handleNext}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import BasicInformation, { OpportunityFormValues } from "./_components/BasicInformation";
import ScheduleRecurrence from "./_components/ScheduleRecurrence";
import CreateFooter from "./_components/CreateFooter";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function CreateOpportunityPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<OpportunityFormValues>({
    defaultValues: {
      // Add all fields needed for both steps here
      title: "",
      description: "",
      category: "",
      skills: "",
      extraCondition: "",
      answerType: "",
      answers: [],
      commitmentType: "regular",
      location: "",
      numberOfVolunteers: "",
      dateStart: "",
      dateEnd: "",
      timeStart: "",
      timeEnd: "",
      email: "",
      phone: "",
    },
  });

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved! (API integration coming soon)");
  };

  const handleCreateOpportunity = () => {
    toast.success("Opportunity created! (API integration coming soon)");
  };

  return (
   <ProtectedLayout>
     <Form {...form}>
      <div className="min-h-screen bg-[#F5F7FA]">
        {currentStep === 1 ? (
          <BasicInformation form={form} />
        ) : (
          <ScheduleRecurrence form={form} onBack={() => setCurrentStep(1)} />
        )}
        <CreateFooter
          step={currentStep}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          onCreate={handleCreateOpportunity}
        />
      </div>
    </Form>
   </ProtectedLayout>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import BasicInformation, {
  OpportunityFormValues,
} from "./_components/BasicInformation";
import ScheduleRecurrence from "./_components/ScheduleRecurrence";
import CreateFooter from "./_components/CreateFooter";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

export default function CreateOpportunityPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const utils = trpc.useUtils();

  const createOpportunity = trpc.opportunities.createOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity created successfully!");
      utils.opportunities.getOrganizationOpportunities.invalidate();
      router.push("/organization");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create opportunity");
    },
  });

  const form = useForm<OpportunityFormValues>({
    defaultValues: {
      title: "",
      description: "",
      category: [],
      required_skills: [],
      extra_conditions: [],
      commitment_type: "regular",
      location: "",
      number_of_volunteers: 1,
      date: {
        start_date: "",
        end_date: "",
      },
      time: {
        start_time: "",
        end_time: "",
      },
      email_contact: "",
      phone_contact: "",
      is_recurring: false,
      recurrence: {
        type: "weekly",
        days: [],
        date_range: { start_date: "", end_date: "" },
        time_range: { start_time: "", end_time: "" },
        occurrences: undefined,
      },
      banner_img: "",
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

  const handleCreateOpportunity = async () => {
    const formData = form.getValues();
    console.log({formData});
    
    await createOpportunity.mutateAsync({
      ...formData,
      number_of_volunteers: Number(formData.number_of_volunteers),
    });
  };
  const description = form.watch("description");
  console.log({description});
  
  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] ">
        <Form {...form}>
          <div className="max-w-[1240px]  pb-16 mx-auto">
            {currentStep === 1 ? (
              <BasicInformation form={form} />
            ) : (
              <ScheduleRecurrence
                form={form}
                onBack={() => setCurrentStep(1)}
              />
            )}
            <CreateFooter
              step={currentStep}
              onNext={handleNext}
              onSaveDraft={handleSaveDraft}
              onCreate={handleCreateOpportunity}
              isLoading={createOpportunity.isPending}
            />
          </div>
        </Form>
      </div>
    </ProtectedLayout>
  );
}

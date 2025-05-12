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

  const { data: profileCheck } = trpc.users.profileCheckup.useQuery();
  const createOpportunity = trpc.opportunities.createOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity created successfully!");
      utils.opportunities.getOrganizationOpportunities.invalidate();
      router.push("/organization/opportunity/list");
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
      recurrence: undefined,
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
    if (!profileCheck?.organizationProfile?._id) {
      toast.error("Organization profile not found");
      return;
    }

    const formData = form.getValues();
    console.log({formData});
    
    await createOpportunity.mutateAsync({
      ...formData,
      number_of_volunteers: Number(formData.number_of_volunteers),
      organization: profileCheck.organizationProfile._id,
    });
  };

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

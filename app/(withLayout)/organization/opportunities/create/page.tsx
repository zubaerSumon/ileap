"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import BasicInformation, {
  OpportunityFormValues,
} from "./_components/BasicInformation";
import CreateFooter from "./_components/CreateFooter";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

export default function CreateOpportunityPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createOpportunity = trpc.opportunities.createOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity created successfully!");
      utils.opportunities.getOrganizationOpportunities.invalidate();
      router.push("/organization/dashboard");
    },
    onError: (error) => {
      // Handle validation errors
      if (error.data?.zodError?.fieldErrors) {
        const fieldErrors = error.data.zodError.fieldErrors;
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          if (errors?.[0]) {
            toast.error(errors[0]);
          }
        });
      } else {
        toast.error(error.message || "Failed to create opportunity");
      }
    },
  });

  const form = useForm<OpportunityFormValues>({
    defaultValues: {
      title: "",
      description: "",
      category: [],
      required_skills: [],
      commitment_type: "workbased",
      location: "",
      number_of_volunteers: 1,
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

  const handleCreateOpportunity = async () => {
    try {
      const formData = form.getValues();
      
      // Basic validation
      if (!formData.title.trim()) {
        toast.error("Please enter a title for the opportunity");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Please provide a description");
        return;
      }
      if (formData.category.length === 0) {
        toast.error("Please select at least one category");
        return;
      }
      if (formData.required_skills.length === 0) {
        toast.error("Please select at least one required skill");
        return;
      }
      if (!formData.location.trim()) {
        toast.error("Please enter a location");
        return;
      }
      if (!formData.email_contact.trim()) {
        toast.error("Please enter a contact email");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_contact)) {
        toast.error("Please enter a valid email address");
        return;
      }
      
      await createOpportunity.mutateAsync({
        ...formData,
        number_of_volunteers: Number(formData.number_of_volunteers),
      });
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };
  
  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] min-h-screen">
        <Form {...form}>
          <div className="max-w-[1240px] mx-auto px-4 py-8">
            <BasicInformation form={form} />
            <CreateFooter
              onCreate={handleCreateOpportunity}
              isLoading={createOpportunity.isPending}
            />
          </div>
        </Form>
      </div>
    </ProtectedLayout>
  );
}

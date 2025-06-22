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
      router.push("/organisation/dashboard");
    },
    onError: (error) => {
      // Handle validation errors
      if (error.data && 'zodError' in error.data) {
        const fieldErrors = (error.data as { zodError: { fieldErrors: Record<string, string[]> } }).zodError.fieldErrors;
        Object.entries(fieldErrors).forEach(([, errors]) => {
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
    mode: "onChange",
  });

  const onSubmit = async (data: OpportunityFormValues) => {
    try {
      await createOpportunity.mutateAsync({
        ...data,
        number_of_volunteers: Number(data.number_of_volunteers),
      });
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };
  
  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] min-h-screen">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[1240px] mx-auto px-4 py-8">
            <BasicInformation form={form} />
            <CreateFooter
              onCreate={form.handleSubmit(onSubmit)}
              isLoading={createOpportunity.isPending}
            />
          </form>
        </Form>
      </div>
    </ProtectedLayout>
  );
}

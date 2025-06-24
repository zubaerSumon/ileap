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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Client-side validation schema
const clientValidationSchema = z.object({
  title: z.string().min(1, "Please enter a title for your opportunity"),
  description: z.string().min(1, "Please provide a description of your opportunity"),
  category: z.array(z.string()).min(1, "Please select at least one category"),
  required_skills: z.array(z.string()).min(1, "Please select at least one required skill"),
  commitment_type: z.string().min(1, "Please select a commitment type"),
  location: z.string().min(1, "Please enter a location"),
  number_of_volunteers: z.coerce.number().min(1, "Number of volunteers must be at least 1"),
  email_contact: z.string().email("Please enter a valid email address"),
  phone_contact: z.string().optional(),
  internal_reference: z.string().optional(),
  start_date: z.string().min(1, "Please select a start date"),
  start_time: z.string().min(1, "Please select a start time"),
  is_recurring: z.boolean().default(false),
  recurrence: z.object({
    type: z.string(),
    days: z.array(z.string()).optional(),
    date_range: z.object({
      start_date: z.string(),
      end_date: z.string().optional()
    }),
    time_range: z.object({
      start_time: z.string(),
      end_time: z.string()
    }),
    occurrences: z.number().optional()
  }).optional(),
  banner_img: z.string().optional()
});

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
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          if (errors?.[0]) {
            toast.error(`${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}: ${errors[0]}`);
          }
        });
      } else {
        toast.error(error.message || "Failed to create opportunity. Please check all required fields and try again.");
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
      start_date: "",
      start_time: "",
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
    resolver: zodResolver(clientValidationSchema),
  });

  const onSubmit = async (data: OpportunityFormValues) => {
    try {
      console.log("Form data being submitted:", data);
      await createOpportunity.mutateAsync(data);
    } catch (error) {
      // Error is already handled by the onError callback in useMutation
      console.error("Error creating opportunity:", error);
    }
  };
  
  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] min-h-screen">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[1240px] mx-auto px-2 sm:px-4 py-4 sm:py-8">
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

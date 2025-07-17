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
import { useState } from "react";
import { opportunityValidationSchema } from "@/utils/validation/opportunity";

export default function CreateOpportunityPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isImageUploading, setIsImageUploading] = useState(false);

  const createOpportunity = trpc.opportunities.createOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity created successfully!");
      utils.opportunities.getOrganizationOpportunities.invalidate();
      router.push("/organisation/dashboard");
    },
    onError: (error) => {
      // Handle validation errors
      if (error.data && "zodError" in error.data) {
        const fieldErrors = (
          error.data as { zodError: { fieldErrors: Record<string, string[]> } }
        ).zodError.fieldErrors;
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          if (errors?.[0]) {
            toast.error(
              `${
                field.charAt(0).toUpperCase() +
                field.slice(1).replace(/_/g, " ")
              }: ${errors[0]}`
            );
          }
        });
      } else {
        toast.error(
          error.message ||
            "Failed to create opportunity. Please check all required fields and try again."
        );
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
      external_event_link: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      is_recurring: false,
      recurrence: {
        type: "weekly",
        days: [],
        date_range: { start_date: "", end_date: "" },
        time_range: { start_time: "", end_time: "" },
        occurrences: undefined,
      },
      banner_img: "",
      requirements: [],
    },
    mode: "onChange",
    resolver: zodResolver(opportunityValidationSchema),
  });

  const onSubmit = async (data: OpportunityFormValues) => {
    try {
      console.log("Form data being submitted:", data);
      
      // Validate email if provided
      if (data.email_contact && data.email_contact.trim() !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email_contact)) {
          toast.error("Please enter a valid email address");
          return;
        }
      }
      
      // Ensure optional fields are properly formatted
      const formattedData = {
        ...data,
        email_contact: data.email_contact || "",
        phone_contact: data.phone_contact || "",
        internal_reference: data.internal_reference || "",
        external_event_link: data.external_event_link || "",
        end_date: data.end_date || "",
        end_time: data.end_time || "",
        banner_img: data.banner_img || "",
      };
      await createOpportunity.mutateAsync(formattedData);
    } catch (error) {
      // Error is already handled by the onError callback in useMutation
      console.error("Error creating opportunity:", error);
    }
  };

  return (
    <ProtectedLayout>
      <div className="  min-h-screen">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[1240px] mx-auto px-2 sm:px-4 py-4 sm:py-8"
          >
            <BasicInformation
              form={form}
              onImageUploadStateChange={setIsImageUploading}
            />
            <CreateFooter
              onCreate={form.handleSubmit(onSubmit)}
              isLoading={createOpportunity.isPending || isImageUploading}
            />
          </form>
        </Form>
      </div>
    </ProtectedLayout>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { OpportunityFormValues } from "../../create/_components/BasicInformation";
import EditBasicInformation from "./_components/EditBasicInformation";
import EditFooter from "./_components/EditFooter";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEditOpportunity } from "@/hooks/useEditOpportunity";
import Loading from "@/app/loading";

// Client-side validation schema (same as create)
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
  external_event_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  start_date: z.string().min(1, "Please select a start date"),
  start_time: z.string().min(1, "Please select a start time"),
  end_date: z.string().optional(),
  end_time: z.string().optional(),
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
}).refine((data) => {
  // For work-based opportunities, end_date is required
  if (data.commitment_type === "workbased") {
    return data.end_date && data.end_date.trim() !== "";
  }
  return true;
}, {
  message: "End date is required for work-based opportunities",
  path: ["end_date"]
}).refine((data) => {
  // If both start_date and end_date are provided, end_date must be after or equal to start_date
  if (data.start_date && data.end_date && data.start_date.trim() !== "" && data.end_date.trim() !== "") {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate >= startDate;
  }
  return true;
}, {
  message: "End date must be on or after start date",
  path: ["end_date"]
});

const EditOpportunityPage = () => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { opportunity, isLoadingOpportunity, handleUpdate, getDefaultValues, isUpdating } = useEditOpportunity();

  const form = useForm<OpportunityFormValues>({
    defaultValues: getDefaultValues(),
    mode: "onChange",
    resolver: zodResolver(clientValidationSchema),
  });

  // Update form values when opportunity data is loaded
  useEffect(() => {
    if (opportunity) {
      const defaultValues = getDefaultValues();
      Object.entries(defaultValues).forEach(([key, value]) => {
        form.setValue(key as keyof OpportunityFormValues, value);
      });
    }
  }, [opportunity, form, getDefaultValues]);

  const onSubmit = async (data: OpportunityFormValues) => {
    try {
      console.log("Form data being submitted:", data);
      await handleUpdate(data);
    } catch (error) {
      console.error("Error updating opportunity:", error);
    }
  };

  if (isLoadingOpportunity) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] min-h-screen flex items-center justify-center">
          <Loading size="large">
            <p className="text-gray-600 mt-4">Loading opportunity...</p>
          </Loading>
        </div>
      </ProtectedLayout>
    );
  }

  if (!opportunity) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Opportunity Not Found</h2>
            <p className="text-gray-600">The opportunity you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] min-h-screen">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[1240px] mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <EditBasicInformation 
              form={form} 
              onImageUploadStateChange={setIsImageUploading}
            />
            <EditFooter
              onUpdate={form.handleSubmit(onSubmit)}
              isLoading={isUpdating || isImageUploading}
            />
          </form>
        </Form>
      </div>
    </ProtectedLayout>
  );
};

export default EditOpportunityPage;

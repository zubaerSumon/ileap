"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { OpportunityFormValues } from "../../create/_components/BasicInformation";
import EditBasicInformation from "./_components/EditBasicInformation";
import EditFooter from "./_components/EditFooter";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEditOpportunity } from "@/hooks/useEditOpportunity";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { opportunityValidationSchema } from "@/utils/validation/opportunity";

const EditOpportunityPage = () => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const {
    opportunity,
    isLoadingOpportunity,
    handleUpdate,
    getDefaultValues,
    isUpdating,
  } = useEditOpportunity();

  const form = useForm<OpportunityFormValues>({
    defaultValues: getDefaultValues(),
    mode: "onChange",
    resolver: zodResolver(opportunityValidationSchema),
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
          <NotFound />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-7xl mx-auto py-4 sm:py-8"
          >
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

"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { OpportunityFormValues } from "./BasicInformation";

interface CreateFooterProps {
  onCreate: () => void;
  isLoading: boolean;
  form: UseFormReturn<OpportunityFormValues>;
  isImageUploading?: boolean;
}

export default function CreateFooter({
  onCreate,
  isLoading,
  form,
  isImageUploading = false,
}: CreateFooterProps) {
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  const watchedValues = form.watch();

  const requiredFieldsFilled =
    watchedValues.title?.trim() !== "" &&
    watchedValues.description?.trim() !== "" &&
    watchedValues.category?.length > 0 &&
    watchedValues.required_skills?.length > 0 &&
    watchedValues.commitment_type?.trim() !== "" &&
    watchedValues.location?.trim() !== "" &&
    watchedValues.number_of_volunteers > 0 &&
    watchedValues.email_contact?.trim() !== "" &&
    watchedValues.start_date?.trim() !== "" &&
    watchedValues.start_time?.trim() !== "";

  const recurringFieldsValid =
    !watchedValues.is_recurring ||
    (watchedValues.recurrence?.type?.trim() !== "" &&
      watchedValues.recurrence?.date_range?.start_date?.trim() !== "" &&
      watchedValues.recurrence?.time_range?.start_time?.trim() !== "" &&
      watchedValues.recurrence?.time_range?.end_time?.trim() !== "");

  const isDisabled =
    isLoading ||
    hasErrors ||
    !requiredFieldsFilled ||
    !recurringFieldsValid ||
    isImageUploading;

  return (
    <div className="flex flex-col items-center sm:items-end mt-6 px-4 sm:px-0">
      <Button
        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto px-6 py-2 sm:py-2"
        onClick={onCreate}
        disabled={isDisabled}
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Creating
          </div>
        ) : isImageUploading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Uploading Image
          </div>
        ) : (
          "Create Opportunity"
        )}
      </Button>

      {isDisabled && !isLoading && (
        <div className="mt-2 text-sm text-gray-500 text-center sm:text-right max-w-sm">
          {isImageUploading && (
            <p>Please wait while the image is being uploaded...</p>
          )}
          {!isImageUploading && !requiredFieldsFilled && (
            <p>
              Please fill in all required fields marked with{" "}
              <span className="text-red-500">*</span>
            </p>
          )}
          {!isImageUploading &&
            requiredFieldsFilled &&
            !recurringFieldsValid &&
            watchedValues.is_recurring && (
              <p>Please complete the recurring schedule information</p>
            )}
          {!isImageUploading &&
            requiredFieldsFilled &&
            recurringFieldsValid &&
            hasErrors && <p>Please fix the validation errors above</p>}
        </div>
      )}
    </div>
  );
}

"use client";

import { UseFormReturn } from "react-hook-form";
import BasicInformation, { OpportunityFormValues } from "../../../create/_components/BasicInformation";

interface EditBasicInformationProps {
  form: UseFormReturn<OpportunityFormValues>;
  onImageUploadStateChange?: (isUploading: boolean) => void;
}

export default function EditBasicInformation({
  form,
  onImageUploadStateChange,
}: EditBasicInformationProps) {
  return (
    <BasicInformation 
      form={form} 
      onImageUploadStateChange={onImageUploadStateChange}
    />
  );
} 
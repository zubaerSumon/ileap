import { FormField } from "@/components/form-input/FormField";
import { MultiSelectField } from "@/components/form-input/MultiSelectField";
import { UseFormReturn } from "react-hook-form";
import { OrgSignupFormData } from "@/types/auth";
import { FormSelect } from "@/components/form-input/FormSelect";
import {
  organizationTypes,
  volunteerTypes,
} from "@/utils/constants/select-options";
import { FormImageInput } from "@/components/form-input/FormImageInput";
import { ProfilePhotoInput } from "@/components/form-input/ProfilePhotoInput";
import { useState } from "react";

interface OrgDetailsStepProps {
  form: UseFormReturn<OrgSignupFormData>;
  onImageUploadStateChange?: (isUploading: boolean) => void;
}

export function OrgDetailsStep({ form, onImageUploadStateChange }: OrgDetailsStepProps) {
  const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);

  const handleProfilePhotoSetValue = (name: string, value: string) => {
    form.setValue(name as keyof OrgSignupFormData, value);
  };

  const handleProfileImageUploadStateChange = (isUploading: boolean) => {
    setIsProfileImageUploading(isUploading);
    onImageUploadStateChange?.(isUploading || isCoverImageUploading);
  };

  const handleCoverImageUploadStateChange = (isUploading: boolean) => {
    setIsCoverImageUploading(isUploading);
    onImageUploadStateChange?.(isUploading || isProfileImageUploading);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Organisation Details
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please provide additional details about your organization
        </p>
      </div>

      <div className="space-y-6">
        <FormSelect
          label="Organisation type"
          id="type"
          placeholder="Select organisation type"
          control={form.control}
          registerName="type"
          error={form.formState.errors.type?.message}
          options={organizationTypes}
          value={form.watch("type")}
          onChange={(value) => {
            console.log("Type change handler called with value:", value);
            // Validate the type before setting it
            const isValidType = organizationTypes.some(opt => opt.value === value);
            if (!isValidType) {
              console.warn("Invalid organisation type selected:", value);
              return;
            }
            form.setValue("type", value);
          }}
        />

        <MultiSelectField
          label="What type of volunteer work you're providing?"
          id="opportunity_types"
          placeholder="Select volunteer work"
          register={form.register}
          registerName="opportunity_types"
          error={form.formState.errors.opportunity_types?.message}
          options={volunteerTypes}
          setValue={form.setValue}
          value={form.watch("opportunity_types")}
        />

        <MultiSelectField
          label="What skills are you looking for?"
          id="required_skills"
          placeholder="Select required skills"
          register={form.register}
          registerName="required_skills"
          error={form.formState.errors.required_skills?.message}
          options={volunteerTypes}
          setValue={form.setValue}
          value={form.watch("required_skills")}
        />

        <FormField
          label="Website"
          id="website"
          placeholder="e.g. www.organization.com"
          register={form.register}
          registerName="website"
          error={form.formState.errors.website?.message}
        />

        <ProfilePhotoInput
          label="Profile Image"
          name="profile_img"
          setValue={handleProfilePhotoSetValue}
          defaultValue={form.watch("profile_img")}
          onUploadStateChange={handleProfileImageUploadStateChange}
        />

        <FormImageInput<OrgSignupFormData>
          label="Cover Image"
          name="cover_img"
          setValue={form.setValue}
          control={form.control}
          defaultValue={form.watch("cover_img")}
          onUploadStateChange={handleCoverImageUploadStateChange}
        />
      </div>
    </>
  );
}

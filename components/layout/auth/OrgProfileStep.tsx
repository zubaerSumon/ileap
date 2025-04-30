import { FormField } from "@/components/forms/FormField";
import { MultiSelectField } from "@/components/forms/MultiSelectField";
import { PhoneField } from "@/components/forms/PhoneField";
import { UseFormReturn } from "react-hook-form";
import { OrgSignupFormData } from "@/types/auth";
import { FormSelect } from "@/components/forms/FormSelect";
import { suburbs } from "@/utils/constants/suburb";
import { locations, organizationTypes, volunteerTypes } from "@/utils/constants/select-options";

interface OrgProfileStepProps {
  form: UseFormReturn<OrgSignupFormData>;
}

export function OrgProfileStep({ form }: OrgProfileStepProps) {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          We&apos;re excited to have you on board!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please provide your organization details so we can keep you updated on
          our efforts and ways you can get involved.
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          label="Motivation"
          id="bio"
          type="textarea"
          placeholder="We are a community-driven volunteer organization dedicated to ....."
          register={form.register}
          registerName="bio"
          error={form.formState.errors.bio?.message}
        />

        <PhoneField
          label="Phone number"
          id="phone_number"
          placeholder="+61 1243 5978"
          register={form.register}
          registerName="phone_number"
          error={form.formState.errors.phone_number?.message}
          value={form.watch("phone_number")}
          setValue={form.setValue}
        />

        <FormSelect
          label="Orgnaization type"
          id="type"
          placeholder="Select organization type"
          control={form.control}
          registerName="type"
          error={form.formState.errors.type?.message}
          options={organizationTypes}
        />

        <MultiSelectField
          label={`What type of volunteer work you’re providing?`}
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
          label={`What are the skills you prefering?`}
          id="required_skills"
          placeholder="Select prefered skills"
          register={form.register}
          registerName="required_skills"
          error={form.formState.errors.required_skills?.message}
          options={volunteerTypes}
          setValue={form.setValue}
          value={form.watch("required_skills")}
        />

        <FormSelect
          label="State"
          id="state"
          placeholder="Select your location"
          control={form.control}
          registerName="state"
          error={form.formState.errors.state?.message}
          options={locations}
        />

        <FormSelect
          label="Suburb"
          id="area"
          placeholder="Select suburb"
          control={form.control}
          registerName="area"
          error={form.formState.errors.area?.message}
          options={suburbs}
        />

        <FormField
          label="ABN"
          id="abn"
          placeholder="e.g. 43 625 460 915"
          register={form.register}
          registerName="abn"
          error={form.formState.errors.abn?.message}
          className="h-12"
        />

        <FormField
          label="Website"
          id="website"
          placeholder="e.g. www.charity.ausralia.com"
          register={form.register}
          registerName="website"
          error={form.formState.errors.website?.message}
          className="h-12"
        />
      </div>
    </>
  );
}

import { FormField } from "@/components/forms/FormField";
import { PhoneField } from "@/components/forms/PhoneField";
import { UseFormReturn } from "react-hook-form";
import { OrgSignupFormData } from "@/types/auth";
import { FormSelect } from "@/components/forms/FormSelect";
import { suburbs } from "@/utils/constants/suburb";
import { locations } from "@/utils/constants/select-options";

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
          label="About us"
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
          label="State"
          id="state"
          placeholder="Select your location"
          control={form.control}
          registerName="state"
          error={form.formState.errors.state?.message}
          options={locations}
          searchEnabled
        />

        <FormSelect
          label="Suburb"
          id="area"
          placeholder="Select suburb"
          control={form.control}
          registerName="area"
          error={form.formState.errors.area?.message}
          options={suburbs}
          searchEnabled
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
      </div>
    </>
  );
}

 

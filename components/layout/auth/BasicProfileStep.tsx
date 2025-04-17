import { FormField } from "@/components/forms/FormField";
import { MultiSelectField } from "@/components/forms/MultiSelectField";
import { PhoneField } from "@/components/forms/PhoneField";
import { SelectField } from "@/components/forms/SelectField";
import { UseFormReturn } from "react-hook-form";
import { VolunteerSignupForm } from "@/types/auth";

interface BasicProfileStepProps {
  form: UseFormReturn<VolunteerSignupForm>;
}

export function BasicProfileStep({ form }: BasicProfileStepProps) {
  const volunteerTypes = [
    { value: "animal_welfare", label: "Animal welfare" },
    { value: "homeless", label: "Homeless" },
    { value: "education", label: "Education & literacy" },
    { value: "environment", label: "Environment" },
    { value: "health", label: "Health & Medicine" },
    { value: "seniors", label: "Seniors" },
  ];

  const locations = [
    { value: "sydney_nsw", label: "Sydney, New South Wales" },
    { value: "melbourne_vic", label: "Melbourne, Victoria" },
    { value: "brisbane_qld", label: "Brisbane, Queensland" },
    { value: "perth_wa", label: "Perth, Western Australia" },
    { value: "adelaide_sa", label: "Adelaide, South Australia" },
    { value: "hobart_tas", label: "Hobart, Tasmania" },
    { value: "darwin_nt", label: "Darwin, Northern Territory" },
    { value: "canberra_act", label: "Canberra, Australian Capital Territory" },
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Setup your profile
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We want to make sure you know exactly how ILEAP can meet your unique needs.
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          label="About you"
          id="bio"
          type="textarea"
          placeholder="Being a student and passionate about protecting our environment, I"
          register={form.register}
          registerName="bio"
          error={form.formState.errors.bio?.message}
        />

        <MultiSelectField
          label="What type of volunteer work you like?"
          id="volunteer_type"
          placeholder="Animal welfare · Homeless · Education & literacy"
          register={form.register}
          registerName="volunteer_type"
          error={form.formState.errors.volunteer_type?.message}
          options={volunteerTypes}
          setValue={form.setValue}
          value={form.watch("volunteer_type")}
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

        <SelectField
          label="Country/State"
          id="country"
          placeholder="Select your location"
          register={form.register}
          registerName="country"
          error={form.formState.errors.country?.message}
          options={locations}
        />

        <FormField
          label="Area"
          id="street_address"
          placeholder="(list of area)"
          register={form.register}
          registerName="street_address"
          error={form.formState.errors.street_address?.message}
        />

        <FormField
          label="Postcode"
          id="postcode"
          placeholder="2146"
          register={form.register}
          registerName="postcode"
          error={form.formState.errors.postcode?.message}
        />
      </div>
    </>
  );
} 
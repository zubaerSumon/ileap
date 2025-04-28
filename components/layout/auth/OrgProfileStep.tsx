import { FormField } from "@/components/forms/FormField";
import { MultiSelectField } from "@/components/forms/MultiSelectField";
import { PhoneField } from "@/components/forms/PhoneField";
import { SelectField } from "@/components/forms/SelectField";
import { UseFormReturn } from "react-hook-form";
import { OrgSignupForm } from "@/types/auth";

interface OrgProfileStepProps {
  form: UseFormReturn<OrgSignupForm>;
}

export function OrgProfileStep({ form }: OrgProfileStepProps) {
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

  const areas = [
    { value: "sydney_cbd", label: "Sydney CBD" },
    { value: "north_sydney", label: "North Sydney" },
    { value: "eastern_suburbs", label: "Eastern Suburbs" },
    { value: "inner_west", label: "Inner West" },
    { value: "northern_beaches", label: "Northern Beaches" },
    { value: "western_sydney", label: "Western Sydney" },
    { value: "south_sydney", label: "South Sydney" },
    { value: "melbourne_cbd", label: "Melbourne CBD" },
    { value: "south_yarra", label: "South Yarra" },
    { value: "st_kilda", label: "St Kilda" },
    { value: "fitzroy", label: "Fitzroy" },
    { value: "richmond", label: "Richmond" },
    { value: "brisbane_cbd", label: "Brisbane CBD" },
    { value: "south_bank", label: "South Bank" },
    { value: "fortitude_valley", label: "Fortitude Valley" },
    { value: "west_end", label: "West End" },
    { value: "perth_cbd", label: "Perth CBD" },
    { value: "northbridge", label: "Northbridge" },
    { value: "subiaco", label: "Subiaco" },
    { value: "fremantle", label: "Fremantle" },
  ];

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
          label="Bio"
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

        <SelectField
          label="Orgnaization type"
          id="type"
          placeholder="Select organization type"
          register={form.register}
          registerName="type"
          error={form.formState.errors.type?.message}
          options={locations}
        />

        <MultiSelectField
          label={`What type of volunteer work you’re providing?`}
          id="opportunity_types"
          placeholder="Animal welfare · Homeless · Education & literacy"
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

        <SelectField
          label="State"
          id="state"
          placeholder="Select your location"
          register={form.register}
          registerName="state"
          error={form.formState.errors.state?.message}
          options={locations}
        />

        <SelectField
          label="Suburb"
          id="area"
          placeholder="Select your area"
          register={form.register}
          registerName="area"
          error={form.formState.errors.area?.message}
          options={areas}
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
          label="website"
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

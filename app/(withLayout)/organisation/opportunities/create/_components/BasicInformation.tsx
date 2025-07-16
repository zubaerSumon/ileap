"use client";

import { Card } from "@/components/ui/card";
import { FormInput } from "@/components/form-input/FormInput";
import { UseFormReturn, Path } from "react-hook-form";
import { MultiSelectField } from "@/components/form-input/MultiSelectField";
import { FormRichTextEditor } from "@/components/form-input/FormRichTextEditor";
import { FormImageInput } from "@/components/form-input/FormImageInput";
import BackButton from "@/components/buttons/BackButton";

// Define the form type to match the useForm defaultValues in page.tsx
export type OpportunityFormValues = {
  title: string;
  description: string;
  category: string[];
  required_skills: string[];
  commitment_type: string;
  location: string;
  number_of_volunteers: number;
  email_contact?: string;
  phone_contact?: string;
  internal_reference?: string;
  external_event_link?: string;
  start_date: string;
  start_time: string;
  end_date?: string;
  end_time?: string;
  is_recurring: boolean;
  recurrence?: {
    type: string;
    days: string[];
    date_range: {
      start_date: string;
      end_date?: string;
    };
    time_range: {
      start_time: string;
      end_time: string;
    };
    occurrences?: number;
  };
  banner_img?: string;
};

export default function BasicInformation({
  form,
  onImageUploadStateChange,
}: {
  form: UseFormReturn<OpportunityFormValues>;
  onImageUploadStateChange?: (isUploading: boolean) => void;
}) {
  const handleImageUploadStateChange = (isUploading: boolean) => {
    onImageUploadStateChange?.(isUploading);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton className="mx-4 sm:mx-6" />
      <Card
        className="bg-transparent shadow-none border-0 "
        role="dialog"
        aria-labelledby="basic-info-title"
      >
        <div className="  px-4 sm:px-6 pb-6">
          <h2 id="basic-info-title" className="sr-only">
            Basic Information Form
          </h2>

          {/* Form Instructions */}
          <div className="mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Note:</strong> Fields marked with{" "}
              <span className="text-red-500">*</span> are required. Please fill
              in all required fields to create your opportunity.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Title & Description */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                Opportunity title & description
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Ensure your role title is succinct and easily understood by the
                volunteer e.g. Retail Assistant, Marketing Support, Driver.
              </p>
              <div className="space-y-4">
                <FormInput
                  name={"title" as Path<OpportunityFormValues>}
                  label="Title"
                  placeholder="Enter opportunity title"
                  control={form.control}
                  className="w-full sm:w-[382px]"
                />
                <FormRichTextEditor
                  name={"description" as Path<OpportunityFormValues>}
                  label="Description"
                  placeholder="Describe the opportunity"
                  control={form.control}
                  className="min-h-[150px] w-full"
                />
              </div>
            </div>

            {/* Categories & Skills */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                Categories & Skills
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Which categories best represent this opportunity? Volunteers use
                this to help find opportunities they are interested in
                supporting.
              </p>
              <div className="space-y-4">
                <MultiSelectField
                  label="Categories"
                  id="category"
                  placeholder="Select categories"
                  register={form.register}
                  registerName="category"
                  error={form.formState.errors.category?.message}
                  options={[
                    {
                      value: "Community & Social Services",
                      label: "Community & Social Services",
                    },
                    {
                      value: "Education & Mentorship",
                      label: "Education & Mentorship",
                    },
                    {
                      value: "Healthcare & Medical Volunteering",
                      label: "Healthcare & Medical Volunteering",
                    },
                    {
                      value: "Corporate & Skilled Volunteering",
                      label: "Corporate & Skilled Volunteering",
                    },
                    {
                      value: "Technology & Digital Volunteering",
                      label: "Technology & Digital Volunteering",
                    },
                    { value: "Animal Welfare", label: "Animal Welfare" },
                    {
                      value: "Arts, Culture & Heritage",
                      label: "Arts, Culture & Heritage",
                    },
                    {
                      value: "Environmental & Conservation",
                      label: "Environmental & Conservation",
                    },
                  ]}
                  setValue={form.setValue}
                  value={form.watch("category")}
                  className="w-full sm:w-[382px]"
                />
                <MultiSelectField
                  label="Required Skills"
                  id="required_skills"
                  placeholder="Select required skills"
                  register={form.register}
                  registerName="required_skills"
                  error={form.formState.errors.required_skills?.message}
                  options={[
                    { value: "Communication", label: "Communication" },
                    { value: "Leadership", label: "Leadership" },
                    { value: "Teamwork", label: "Teamwork" },
                    { value: "Problem Solving", label: "Problem Solving" },
                    { value: "Time Management", label: "Time Management" },
                    { value: "Adaptability", label: "Adaptability" },
                    { value: "Creativity", label: "Creativity" },
                    { value: "Technical Skills", label: "Technical Skills" },
                  ]}
                  setValue={form.setValue}
                  value={form.watch("required_skills")}
                  className="w-full sm:w-[382px]"
                />
              </div>
            </div>

            {/* Commitment Type */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                Commitment type
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                How much time does the volunteer need to commit to? Volunteers
                use this to help find suitable opportunities.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="workbased"
                    {...form.register("commitment_type")}
                    value="workbased"
                    checked={form.watch("commitment_type") === "workbased"}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Work based</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="eventbased"
                    {...form.register("commitment_type")}
                    value="eventbased"
                    checked={form.watch("commitment_type") === "eventbased"}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Event based</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                Location
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Where does the volunteer need to work from? Be specific, but
                flexible if you can. Does the work need to be done in person (at
                a physical location) or could it be done online or remotely?
              </p>
              <FormInput
                name={"location" as Path<OpportunityFormValues>}
                label="Location"
                placeholder="21 Darling Dr, Sydney, Australia"
                control={form.control}
                className="w-full sm:w-[382px]"
              />
            </div>

            {/* Number of Volunteers */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                Number of volunteers
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                How many volunteers do you need for this opportunity?
              </p>
              <FormInput
                name={"number_of_volunteers" as Path<OpportunityFormValues>}
                label="Number of volunteers"
                placeholder="20"
                type="number"
                control={form.control}
                className="w-full sm:w-[382px]"
              />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                Contact Information
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                How can volunteers reach out to you with questions? (Optional)
              </p>
              <div className="space-y-4">
                <FormInput
                  name={"email_contact" as Path<OpportunityFormValues>}
                  label="Email (optional)"
                  placeholder="contact@organization.com"
                  type="email"
                  control={form.control}
                  className="w-full sm:w-[382px]"
                />
                <FormInput
                  name={"phone_contact" as Path<OpportunityFormValues>}
                  label="Phone (optional)"
                  placeholder="+61 123 456 789"
                  control={form.control}
                  className="w-full sm:w-[382px]"
                />
                <FormInput
                  name={"external_event_link" as Path<OpportunityFormValues>}
                  label="External Event Link (optional)"
                  placeholder="https://example.com/event"
                  type="url"
                  control={form.control}
                  className="w-full sm:w-[382px]"
                />
              </div>
            </div>

            {/* Start Date & Time */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                Start Date & Time
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                When does this opportunity start? This helps volunteers plan
                their availability.
              </p>
              <div className="space-y-4">
                <FormInput
                  name={"start_date" as Path<OpportunityFormValues>}
                  label="Start Date"
                  placeholder=""
                  type="date"
                  control={form.control}
                  className="w-full sm:w-[382px]"
                />
                <FormInput
                  name={"start_time" as Path<OpportunityFormValues>}
                  label="Start Time"
                  placeholder=""
                  type="time"
                  control={form.control}
                  className="w-full sm:w-[382px]"
                />
              </div>
            </div>

            {/* End Date & Time */}
            {form.watch("commitment_type") === "workbased" && (
              <div>
                <h2 className="text-base sm:text-lg font-medium mb-1 flex items-center">
                  End Date & Time
                  <span className="text-red-500 ml-1">*</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  When does this opportunity end? This helps volunteers plan
                  their availability.
                </p>
                <div className="space-y-4">
                  <FormInput
                    name={"end_date" as Path<OpportunityFormValues>}
                    label="End Date"
                    placeholder=""
                    type="date"
                    control={form.control}
                    className="w-full sm:w-[382px]"
                  />
                  <FormInput
                    name={"end_time" as Path<OpportunityFormValues>}
                    label="End Time"
                    placeholder=""
                    type="time"
                    control={form.control}
                    className="w-full sm:w-[382px]"
                  />
                </div>
              </div>
            )}

            {/* Banner Image */}
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1">
                Banner Image
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Add a banner image to make your opportunity stand out.
              </p>
              <FormImageInput
                name={"banner_img" as Path<OpportunityFormValues>}
                label="Banner Image"
                control={form.control}
                setValue={form.setValue}
                className="w-full sm:w-[382px]"
                onUploadStateChange={handleImageUploadStateChange}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

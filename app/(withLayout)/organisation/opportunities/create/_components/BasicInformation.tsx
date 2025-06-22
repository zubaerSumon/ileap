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
  email_contact: string;
  phone_contact?: string;
  internal_reference?: string;
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
}: {
  form: UseFormReturn<OpportunityFormValues>;
}) {
  return (
    <div className="max-w-[1240px] mx-auto">
      <BackButton />
      <Card
        className="bg-white rounded-lg shadow-none border-0 relative"
        role="dialog"
        aria-labelledby="basic-info-title"
      >
        <div className="pt-16 px-6 pb-6">
          <h2 id="basic-info-title" className="sr-only">
            Basic Information Form
          </h2>

          <div className="space-y-8">
            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Opportunity title & description
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Ensure your role title is succinct and easily understood by the
                volunteer e.g. Retail Assistant, Marketing Support, Driver.
              </p>
              <div className="space-y-4">
                <FormInput
                  name={"title" as Path<OpportunityFormValues>}
                  label="Title"
                  placeholder="Enter opportunity title"
                  control={form.control}
                  className="w-[382px]"
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
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Categories & Skills
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
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
                  className="w-[382px]"
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
                  className="w-[382px]"
                />
              </div>
            </div>

            {/* Commitment Type */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Commitment type
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                How much time does the volunteer need to commit to? Volunteers
                use this to help find suitable opportunities.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="workbased"
                  {...form.register("commitment_type")}
                  value="workbased"
                  checked={form.watch("commitment_type") === "workbased"}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="workbased" className="text-sm font-medium">
                  <span>Work based</span>
                </label>

                <input
                  type="radio"
                  id="eventbased"
                  {...form.register("commitment_type")}
                  value="eventbased"
                  checked={form.watch("commitment_type") === "eventbased"}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="eventbased" className="text-sm font-medium">
                  <span>Event based</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Location
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Where does the volunteer need to work from? Be specific, but
                flexible if you can. Does the work need to be done in person (at
                a physical location) or could it be done online or remotely?
              </p>
              <FormInput
                name={"location" as Path<OpportunityFormValues>}
                label="Location"
                placeholder="21 Darling Dr, Sydney, Australia"
                control={form.control}
                className="w-[382px]"
              />
            </div>

            {/* Number of Volunteers */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Number of volunteers
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                How many volunteers do you need for this opportunity?
              </p>
              <FormInput
                name={"number_of_volunteers" as Path<OpportunityFormValues>}
                label="Number of volunteers"
                placeholder="20"
                type="number"
                control={form.control}
                className="w-[382px]"
              />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Contact Information
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                How can volunteers reach out to you with questions?
              </p>
              <div className="space-y-4">
                <FormInput
                  name={"email_contact" as Path<OpportunityFormValues>}
                  label="Email"
                  placeholder="contact@organization.com"
                  type="email"
                  control={form.control}
                  className="w-[382px]"
                />
                <FormInput
                  name={"phone_contact" as Path<OpportunityFormValues>}
                  label="Phone (optional)"
                  placeholder="+61 123 456 789"
                  control={form.control}
                  className="w-[382px]"
                />
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <h2 className="text-lg font-medium mb-1">Banner Image</h2>
              <p className="text-sm text-gray-500 mb-4">
                Add a banner image to make your opportunity stand out.
              </p>
              <FormImageInput
                name={"banner_img" as Path<OpportunityFormValues>}
                label="Banner Image"
                control={form.control}
                setValue={form.setValue}
                className="w-[382px]"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

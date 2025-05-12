"use client";

import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormSelect } from "@/components/forms/FormSelect";
import { UseFormReturn, Path } from "react-hook-form";

// Define the form type to match the useForm defaultValues in page.tsx
export type OpportunityFormValues = {
  title: string;
  description: string;
  category: string;
  skills: string;
  extraCondition: string;
  answerType: string;
  answers: string[];
  commitmentType: string;
  location: string;
  numberOfVolunteers: string;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  email: string;
  phone: string;
};

export default function BasicInformation({ form }: { form: UseFormReturn<OpportunityFormValues> }) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </button>
      <h1 className="text-2xl font-bold mb-6 pb-2">Basic Information</h1>
      <h1 className="text-[14px] pb-12 font-normal">
        Fill out the information below so AusLEAP can find you volunteers for
        your organisation.
      </h1>
      <Card className="bg-white rounded-lg shadow-none border-0 relative" role="dialog" aria-labelledby="basic-info-title">
        <div className="absolute top-6 left-6 text-sm text-blue-600 font-medium">
          Step 1 of 2
        </div>
        <div className="pt-16 px-6 pb-6">
          <h2 id="basic-info-title" className="sr-only">Basic Information Form - Step 1</h2>
          <div className="space-y-8">
            {/* Opportunity title & description */}
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
                <FormTextarea
                  name={"description" as Path<OpportunityFormValues>}
                  label="Description"
                  placeholder="Describe the opportunity"
                  control={form.control}
                  className="min-h-[150px] w-[382px]"
                />
              </div>
            </div>
            {/* Category */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Category
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Which category best represents this opportunity? Volunteers use
                this to help find opportunities they are interested in
                supporting.
              </p>
              <FormSelect
                label="Category"
                id="category"
                placeholder="Select category"
                control={form.control}
                registerName={"category" as Path<OpportunityFormValues>}
                options={[
                  { value: "education", label: "Education & Literacy" },
                  { value: "health", label: "Health & Medicine" },
                  { value: "environment", label: "Environment" },
                  { value: "community", label: "Community Development" },
                  { value: "humanRights", label: "Human Rights" },
                ]}
              />
            </div>
            {/* Required skills */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Required skills
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Which skillset might match this opportunity? Volunteers use this
                to help find opportunities they are interested in supporting.
              </p>
              <FormSelect
                label="Required skills"
                id="skills"
                placeholder="Select skills"
                control={form.control}
                registerName={"skills" as Path<OpportunityFormValues>}
                options={[
                  { value: "communication", label: "Communication" },
                  { value: "leadership", label: "Leadership" },
                  { value: "technical", label: "Technical" },
                  { value: "teaching", label: "Teaching" },
                  { value: "language", label: "Language Skills" },
                ]}
              />
            </div>
            {/* Extra conditions/question if required */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Extra conditions/question if required
                <span className="text-gray-400 text-sm ml-2">(optional)</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Provide any extra question if needed to qualify the volunteer
                and also select which pattern of question suits most.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <FormTextarea
                    name={"extraCondition" as Path<OpportunityFormValues>}
                    label="Extra Condition"
                    placeholder="Some special conditions for volunteering include:"
                    control={form.control}
                    className="min-h-[50px] w-[382px]"
                  />
                  <div>
                    <div className="border rounded-md p-3">
                      <label className="text-sm text-gray-500">
                        Answer type
                      </label>
                      <FormSelect
                        label="Answer type"
                        id="answerType"
                        placeholder="Checkbox"
                        control={form.control}
                        registerName={"answerType" as Path<OpportunityFormValues>}
                        options={[
                          { value: "checkbox", label: "Checkbox" },
                          { value: "dropdown", label: "Dropdown" },
                          { value: "multiple", label: "Multiple choice" },
                          { value: "paragraph", label: "Paragraph" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                {/* Example answers UI, not connected to form for now */}
                <div>
                  <label>Select answers</label>
                  <div className="space-y-2 mt-2 w-[382px]">
                    <div className="flex items-start space-x-2 p-3 border rounded-md">
                      <div className="mt-1">1.</div>
                      <div className="flex-1 text-[12px]">
                        Volunteers should receive training that benefits them,
                        such as providing new knowledge or skills.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 p-3 border rounded-md">
                      <div className="mt-1">2.</div>
                      <div className="flex-1 text-[12px]">
                        Some organizations may not cover volunteers under a
                        certain age or over a certain age with their insurance.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

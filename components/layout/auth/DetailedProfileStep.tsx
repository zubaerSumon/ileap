"use client";
import React from "react";
import { FormField } from "@/components/form-input/FormField";
import { UseFormReturn } from "react-hook-form";
import { VolunteerSignupForm } from "@/types/auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import { FormSelect } from "@/components/form-input/FormSelect";
interface DetailedProfileStepProps {
  form: UseFormReturn<VolunteerSignupForm>;
}

export function DetailedProfileStep({
  form,
}: DetailedProfileStepProps) {
  const countryOptions = useMemo(() => countryList().getData(), []);

  const courseOptions = [
    { value: "phd", label: "Doctorate / PhD" },
    { value: "masters", label: "Master's Degree (Postgraduate)" },
    { value: "bachelor", label: "Bachelor's Degree (Undergraduate)" },
    { value: "diploma", label: "Diploma / Certificate" },
    { value: "professional", label: "Professional / Industry Expert" },
    { value: "non-student", label: "Non-Student / Not Currently Studying" },
  ];

  const majorOptions = [
    { value: "business", label: "Business" },
    { value: "engineering", label: "Engineering" },
    { value: "it", label: "Information Technology" },
    { value: "science", label: "Science" },
    { value: "arts", label: "Arts" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
    { value: "other", label: "Other" },
  ];

  const nonStudentTypeOptions = [
    { value: "staff", label: "Staff Member" },
    { value: "alumni", label: "University Alumni" },
    { value: "general_public", label: "General Public Member" },
  ];

  const graduationYearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const referralSources = [
    { value: "instagram", label: "Instagram" },
    { value: "email", label: "Email" },
    { value: "classes", label: "Classes" },
    { value: "friends", label: "Friends" },
    { value: "other", label: "Other" },
  ];

  const isCurrentlyStudying = form.watch("is_currently_studying");
  const isInternational = form.watch("student_type") === "yes";
  const nonStudentType = form.watch("non_student_type");
  const referralSource = form.watch("referral_source");
  const major = form.watch("major");
  const course = form.watch("course");

  // Initialize is_currently_studying if not set
  React.useEffect(() => {
    if (!form.getValues("is_currently_studying")) {
      form.setValue("is_currently_studying", "yes");
    }
  }, [form]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Academic Information
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please provide your academic details
        </p>
      </div>

      <div className="space-y-6">
        {/* Are you currently studying? */}
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Are you currently studying?
            </Label>
            <RadioGroup
              defaultValue={isCurrentlyStudying}
              className="flex space-x-6"
              onValueChange={(value) => {
                form.setValue("is_currently_studying", value);
                // Reset related fields when switching
                if (value === "no") {
                  form.setValue("student_type", undefined);
                  form.setValue("home_country", "");
                  form.setValue("course", "");
                  form.setValue("major", "");
                  form.setValue("major_other", "");
                } else {
                  form.setValue("non_student_type", "");
                  form.setValue("university", "");
                  form.setValue("graduation_year", "");
                  form.setValue("study_area", "");
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="studying_yes" className="" />
                <Label htmlFor="studying_yes" className="text-sm cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="studying_no" className="" />
                <Label htmlFor="studying_no" className="text-sm cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* If currently studying */}
        {isCurrentlyStudying === "yes" && (
          <>
            {/* Are you an international student? */}
            <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Are you an international student?
                </Label>
                <RadioGroup
                  defaultValue={isInternational ? "yes" : "no"}
                  className="flex space-x-6"
                  onValueChange={(value) => form.setValue("student_type", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="international_yes" className="" />
                    <Label htmlFor="international_yes" className="text-sm cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="international_no" className="" />
                    <Label htmlFor="international_no" className="text-sm cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>

                {isInternational && (
                  <div className="mt-2 p-2 rounded-lg">
                    <FormSelect
                      label="What is your home country?"
                      id="home_country"
                      placeholder="Select your country"
                      control={form.control}
                      registerName="home_country"
                      error={form.formState.errors.home_country?.message}
                      options={countryOptions}
                    />
                  </div>
                )}
              </div>
            </div>

            <FormSelect
              label="What course are you studying?"
              id="course"
              placeholder="Select your course"
              control={form.control}
              registerName="course"
              error={form.formState.errors.course?.message}
              options={courseOptions}
            />

            {course !== "non-student" && (
              <FormSelect
                label="What major are you currently studying?"
                id="major"
                placeholder="Select your major"
                control={form.control}
                registerName="major"
                error={form.formState.errors.major?.message}
                options={majorOptions}
              />
            )}

            {major === "other" && (
              <FormField
                label="Please specify your major"
                id="major_other"
                placeholder="Enter your major"
                register={form.register}
                registerName="major_other"
                error={form.formState.errors.major_other?.message}
              />
            )}
          </>
        )}

        {/* If not currently studying */}
        {isCurrentlyStudying === "no" && (
          <>
            <FormSelect
              label="What type of member are you?"
              id="non_student_type"
              placeholder="Select your type"
              control={form.control}
              registerName="non_student_type"
              error={form.formState.errors.non_student_type?.message}
              options={nonStudentTypeOptions}
            />

            {/* If alumni, show additional fields */}
            {nonStudentType === "alumni" && (
              <>
                <FormField
                  label="What university did you attend?"
                  id="university"
                  placeholder="e.g. University of Technology Sydney, University of Sydney, etc."
                  register={form.register}
                  registerName="university"
                  error={form.formState.errors.university?.message}
                />

                <FormSelect
                  label="What year did you graduate?"
                  id="graduation_year"
                  placeholder="Select graduation year"
                  control={form.control}
                  registerName="graduation_year"
                  error={form.formState.errors.graduation_year?.message}
                  options={graduationYearOptions}
                />

                <FormField
                  label="What area did you study in?"
                  id="study_area"
                  placeholder="e.g. Business, Engineering, Arts, etc."
                  register={form.register}
                  registerName="study_area"
                  error={form.formState.errors.study_area?.message}
                />
              </>
            )}
          </>
        )}

        <div className="space-y-4">
          <FormSelect
            label="Where did you hear about this program?"
            id="referral_source"
            placeholder="Select referral source"
            control={form.control}
            registerName="referral_source"
            error={form.formState.errors.referral_source?.message}
            options={referralSources}
          />

          {referralSource === "other" && (
            <FormField
              label="Please specify"
              id="referral_source_other"
              placeholder="How did you hear about us?"
              register={form.register}
              registerName="referral_source_other"
              error={form.formState.errors.referral_source_other?.message}
            />
          )}
        </div>
      </div>
    </>
  );
}

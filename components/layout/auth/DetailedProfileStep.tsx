"use client";
import React from "react";
import { FormField } from "@/components/forms/FormField";
import { UseFormReturn } from "react-hook-form";
import { VolunteerSignupForm } from "@/types/auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import { FormSelect } from "@/components/forms/FormSelect";
interface DetailedProfileStepProps {
  form: UseFormReturn<VolunteerSignupForm>;
  mediaConsent: boolean;
  setMediaConsent: (value: boolean) => void;
  mediaConsentError: string | null;
  setMediaConsentError: (value: string | null) => void;
}

export function DetailedProfileStep({
  form,
  mediaConsent,
  setMediaConsent,
  mediaConsentError,
  setMediaConsentError,
}: DetailedProfileStepProps) {
  const countryOptions = useMemo(() => countryList().getData(), []);

  const courseOptions = [
    { value: "phd", label: "Doctorate / PhD" },
    { value: "masters", label: "Master’s Degree (Postgraduate)" },
    { value: "bachelor", label: "Bachelor’s Degree (Undergraduate)" },
    { value: "diploma", label: "Diploma / Certificate" },
    { value: "professional", label: "Professional / Industry Expert" },
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
    { value: "other", label: "Other" }, // <-- Add this line if not present
  ];

  const referralSources = [
    { value: "instagram", label: "Instagram" },
    { value: "email", label: "Email" },
    { value: "classes", label: "Classes" },
    { value: "friends", label: "Friends" },
    { value: "other", label: "Other" },
  ];

  const isInternational = form.watch("student_type") === "yes";
  const referralSource = form.watch("referral_source");
  const major = form.watch("major");
  const course = form.watch("course");

  // Initialize student_type if not set
  React.useEffect(() => {
    if (!form.getValues("student_type")) {
      form.setValue("student_type", "no");
    }
  }, [form]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Student Information
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please provide your academic details
        </p>
      </div>

      <div className="space-y-6">
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
                <RadioGroupItem value="yes" id="yes" className="" />
                <Label htmlFor="yes" className="text-sm   cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" className="" />
                <Label htmlFor="no" className="text-sm  cursor-pointer">
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="media_consent"
            checked={mediaConsent}
            onChange={(e) => {
              setMediaConsent(e.target.checked);
              setMediaConsentError(null);
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="media_consent" className="text-sm text-gray-600">
            I grant permission for the use of photographs or electronic media
            images in which I may appear
          </label>
        </div>
        {mediaConsentError && (
          <p className="text-sm text-red-600">{mediaConsentError}</p>
        )}
      </div>
    </>
  );
}

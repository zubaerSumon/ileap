import { FormField } from "@/components/forms/FormField";
import { SelectField } from "@/components/forms/SelectField";
import { UseFormReturn } from "react-hook-form";
import { VolunteerSignupForm } from "@/types/auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  setMediaConsentError
}: DetailedProfileStepProps) {
  const countries = [
    { value: "china", label: "China" },
    { value: "india", label: "India" },
    { value: "brazil", label: "Brazil" },
    { value: "malaysia", label: "Malaysia" },
    { value: "singapore", label: "Singapore" },
    { value: "other", label: "Other" },
  ];

  const courseOptions = [
    { value: "phd", label: "PhD" },
    { value: "masters", label: "Masters" },
    { value: "bachelor", label: "Bachelor" },
    { value: "diploma", label: "Diploma" },
    { value: "certificate", label: "Certificate" },
  ];

  const majorOptions = [
    { value: "business", label: "Business" },
    { value: "engineering", label: "Engineering" },
    { value: "it", label: "Information Technology" },
    { value: "science", label: "Science" },
    { value: "arts", label: "Arts" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
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
              defaultValue="no"
              className="flex space-x-6"
              onValueChange={(value) => form.setValue("student_type", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="yes" 
                  id="yes" 
                  className="h-4 w-4 border-gray-300 focus:ring-blue-500 data-[state=checked]:border-blue-600 [&>div>svg]:fill-blue-600"
                />
                <Label htmlFor="yes" className="text-sm text-gray-700 cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="no" 
                  id="no" 
                  className="h-4 w-4 border-gray-300 focus:ring-blue-500 data-[state=checked]:border-blue-600 [&>div>svg]:fill-blue-600"
                />
                <Label htmlFor="no" className="text-sm text-gray-700 cursor-pointer">No</Label>
              </div>
            </RadioGroup>

            {isInternational && (
              <div className="mt-2 p-2 rounded-lg">
                <SelectField
                  label="What is your home country?"
                  id="home_country"
                  placeholder="Select your country"
                  register={form.register}
                  registerName="home_country"
                  error={form.formState.errors.home_country?.message}
                  options={countries}
                />
              </div>
            )}
          </div>
        </div>

        <SelectField
          label="What course are you studying?"
          id="course"
          placeholder="Select your course"
          register={form.register}
          registerName="course"
          error={form.formState.errors.course?.message}
          options={courseOptions}
        />

        <SelectField
          label="What major are you currently studying?"
          id="major"
          placeholder="Select your major"
          register={form.register}
          registerName="major"
          error={form.formState.errors.major?.message}
          options={majorOptions}
        />

        <div className="space-y-4">
          <SelectField
            label="Where did you hear about this program?"
            id="referral_source"
            placeholder="Select referral source"
            register={form.register}
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
            I grant permission for the use of photographs or electronic media images in which I may appear
          </label>
        </div>
        {mediaConsentError && (
          <p className="text-sm text-red-600">{mediaConsentError}</p>
        )}
      </div>
    </>
  );
} 
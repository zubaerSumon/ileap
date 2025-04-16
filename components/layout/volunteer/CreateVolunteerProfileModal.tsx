"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  ImageUpload,
  FormTextarea,
  FormMultiSelect,
  FormCheckbox,
  FormSection,
  FormSelect,
  FormDateTimeRangePicker,
} from "@/components/forms";

// Restructured schemas for better UX flow
const step1Schema = z.object({
  profile_img: z.any().optional(),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  interested_on: z
    .array(z.string())
    .min(1, "Please select at least one area of interest"),
});

const step2Schema = z.object({
  age: z.string().min(1, "Age is required"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  street_address: z.string().min(1, "Street address is required"),
  includeStudentInfo: z.boolean().default(false),
});

const step3Schema = z.object({
  availability_date: z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  }),
  availability_time: z.object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  }),
});

const studentInfoSchema = z.object({
  studentType: z.string().min(1, "Please select your student type"),
  homeCountry: z.string().optional(),
  course: z.string().min(1, "Please enter your course"),
  major: z.string().min(1, "Please enter your major"),
  referralSource: z.string().min(1, "Please select how you heard about us"),
  referralSourceOther: z.string().optional(),
  mediaConsent: z.boolean().default(false),
});

// Combine all schemas with conditional validation
const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...studentInfoSchema.partial().shape,
}).refine(
  (data) => {
    // If includeStudentInfo is true, validate student fields
    if (data.includeStudentInfo) {
      return !!data.studentType && !!data.course && !!data.major && !!data.referralSource;
    }
    return true;
  },
  {
    message: "Please complete all required student information fields",
    path: ["studentType"],
  }
);

type VolunteerProfileForm = z.infer<typeof formSchema>;

// Define options for select fields
const volunteerTypes = [
  { value: "animal-welfare", label: "Animal Welfare" },
  { value: "homeless", label: "Homeless Support" },
  { value: "education", label: "Education & Literacy" },
  { value: "environment", label: "Environmental" },
  { value: "elderly", label: "Senior Care" },
  { value: "health", label: "Healthcare" },
];

const studentTypes = [
  { value: "international", label: "International Student" },
  { value: "domestic", label: "Domestic Student" },
];

const countries = [
  { value: "china", label: "China" },
  { value: "india", label: "India" },
  { value: "brazil", label: "Brazil" },
  { value: "malaysia", label: "Malaysia" },
  { value: "singapore", label: "Singapore" },
  { value: "other", label: "Other" },
];

const referralSources = [
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
  { value: "classes", label: "Classes" },
  { value: "friends", label: "Friends" },
  { value: "other", label: "Other" },
];

interface CreateVolunteerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVolunteerProfileModal({
  isOpen,
  onClose,
}: CreateVolunteerProfileModalProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<VolunteerProfileForm>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      interested_on: [],
      includeStudentInfo: false,
      mediaConsent: false,
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Watch the includeStudentInfo checkbox value
  const includeStudentInfo = watch("includeStudentInfo");
  const studentType = watch("studentType");
  const referralSource = watch("referralSource");
  
  // Calculate total steps based on the watched form value
  const totalSteps = includeStudentInfo ? 4 : 3;

  // Reset step if needed when includeStudentInfo changes
  useEffect(() => {
    // If user unchecks the box while on step 4, move back to step 3
    if (!includeStudentInfo && step === 4) {
      setStep(3);
    }
  }, [includeStudentInfo, step]);

  const onSubmit = async (data: VolunteerProfileForm) => {
    if (isSubmitting) return;
    try {
      setError(null);
      console.log("Form data:", data);
      // TODO: Implement profile creation logic
      onClose();
    } catch (err) {
      console.error("Error during profile creation:", err);
      setError("An error occurred during profile creation");
    }
  };

  const handleNext = async () => {
    const fieldsToValidate =
      step === 1
        ? Object.keys(step1Schema.shape)
        : step === 2
        ? Object.keys(step2Schema.shape)
        : step === 3
        ? Object.keys(step3Schema.shape)
        : Object.keys(studentInfoSchema.shape);

    const isValid = await trigger(
      fieldsToValidate as Array<keyof VolunteerProfileForm>
    );

    if (isValid) {
      if (step === totalSteps) {
        handleSubmit(onSubmit)();
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const progress = (step / totalSteps) * 100;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <FormSection
            title="Personal Information"
            description="Tell us about yourself"
          >
            <div className="w-full flex flex-col items-center mb-6">
              <ImageUpload
                label="Profile photo"
                onChange={(file) => {
                  setValue("profile_img", file);
                }}
                error={errors.profile_img?.message}
                imageType="avatar"
              />
            </div>

            <FormTextarea
              control={control}
              name="bio"
              label="About you"
              placeholder="Tell us about yourself, your skills, and experience..."
              rows={4}
            />

            <FormMultiSelect
              control={control}
              name="interested_on"
              label="What type of volunteer work do you prefer?"
              options={volunteerTypes}
              placeholder="Select volunteer type"
            />
          </FormSection>
        );

      case 2:
        return (
          <FormSection
            title="Contact Information"
            description="We need these details to match you with opportunities"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                control={control}
                name="age"
                label="Age"
                placeholder="Enter your age"
              />

              <FormInput
                control={control}
                name="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
              />
            </div>

            <FormInput
              control={control}
              name="country"
              label="Country"
              placeholder="Enter your country"
            />

            <FormInput
              control={control}
              name="street_address"
              label="Street Address"
              placeholder="Enter your street address"
            />

            {/* Removed the checkbox from here */}
          </FormSection>
        );

      case 3:
        return (
          <FormSection
            title="Availability"
            description="Tell us when you're available to volunteer"
          >
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Date Range</h3>
                <FormDateTimeRangePicker
                  register={form.register}
                  errors={errors}
                  name={{
                    startDate: "availability_date.startDate",
                    endDate: "availability_date.endDate",
                  }}
                  label="When are you available to volunteer?"
                  dateOnly
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Time Preference</h3>
                <FormDateTimeRangePicker
                  register={form.register}
                  errors={errors}
                  name={{
                    startTime: "availability_time.startTime",
                    endTime: "availability_time.endTime",
                  }}
                  label="What time of day works best for you?"
                  timeOnly
                />
              </div>

              {/* Added: visually distinct card for student info checkbox */}
              <div className="mt-8">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 flex items-center gap-4 shadow-sm">
                  <FormCheckbox
                    control={control}
                    name="includeStudentInfo"
                    label={
                      <span className="font-medium text-blue-900">
                        I am a student and want to provide additional academic information
                      </span>
                    }
                  />
                  <span className="text-sm text-blue-700">
                    (Optional: helps us match you with student-specific opportunities)
                  </span>
                </div>
              </div>
            </div>
          </FormSection>
        );

      case 4:
        return (
          <FormSection
            title="Student Information"
            description="Please provide your academic details"
          >
            <div className="grid grid-cols-1 gap-6">
              <FormSelect
                control={control}
                name="studentType"
                label="Are you an international or domestic student?"
                options={studentTypes}
                placeholder="Select student type"
              />

              {studentType === "international" && (
                <FormSelect
                  control={control}
                  name="homeCountry"
                  label="What is your home country?"
                  options={countries}
                  placeholder="Select your country"
                />
              )}

              <FormInput
                control={control}
                name="course"
                label="What course are you studying?"
                placeholder="e.g. PhD, Masters of Education, Bachelor of Business"
              />

              <FormTextarea
                control={control}
                name="major"
                label="What major are you currently studying?"
                placeholder="Enter your major..."
                rows={3}
              />

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <FormSelect
                  control={control}
                  name="referralSource"
                  label="Where did you hear about this program?"
                  options={referralSources}
                  placeholder="Select referral source"
                />

                {referralSource === "other" && (
                  <div className="mt-4">
                    <FormInput
                      control={control}
                      name="referralSourceOther"
                      label="Please specify"
                      placeholder="How did you hear about us?"
                    />
                  </div>
                )}
              </div>

              <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <FormCheckbox
                  control={control}
                  name="mediaConsent"
                  label="I grant permission for the use of photographs or electronic media images in which I may appear"
                />
              </div>
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "Contact Details";
      case 3:
        return "Availability";
      case 4:
        return "Student Information";
      default:
        return "Complete Your Profile";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 1? `You are almost there! create your Volunteer Profile` : `Volunteer Profile`}
          </DialogTitle>
          <DialogDescription className="text-center mt-1">
            Step {step} of {totalSteps}: {getStepTitle()}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-4 border-t border-gray-200 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className={`${step === 1 ? "opacity-0" : ""} px-6`}
              >
                Back
              </Button>

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  {isSubmitting ? "Submitting..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
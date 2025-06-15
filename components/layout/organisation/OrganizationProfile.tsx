"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form-input/FormInput";
import { FormTextarea } from "@/components/form-input/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  organizationTypes,
  volunteerTypes,
} from "@/utils/constants/select-options";
import { userValidation } from "@/server/modules/users/users.validation";
import { MultiSelectField } from "@/components/form-input/MultiSelectField";
import { PhoneField } from "@/components/form-input/PhoneField";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server";
import { SelectField } from "@/components/form-input/SelectField";
import { ProfilePhotoInput } from "@/components/form-input/ProfilePhotoInput";

type OrganizationProfileData = Omit<z.infer<typeof userValidation.organizationProfileSchema>, 'opportunity_types' | 'required_skills'> & {
  opportunity_types: string[];
  required_skills: string[];
  type: string | string[];
};

const defaultValues: OrganizationProfileData = {
  title: "",
  contact_email: "",
  phone_number: "",
  bio: "",
  type: "",
  opportunity_types: [],
  required_skills: [],
  state: "",
  area: "",
  abn: "",
  website: "",
  profile_img: "",
  cover_img: "",
};

export default function OrganizationProfile() {
  const router = useRouter();
  const { data: profileData, isLoading } = trpc.users.profileCheckup.useQuery();
  const utils = trpc.useUtils();
  
  const organizationProfileUpdateMutation = trpc.users.setupOrgProfile.useMutation({
    onSuccess: () => {
      utils.users.profileCheckup.invalidate();
      toast.success("Organization profile updated successfully!");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const form = useForm<OrganizationProfileData>({
    resolver: zodResolver(userValidation.organizationProfileSchema),
    defaultValues,
  });

  // Add form validation state debugging
  useEffect(() => {
    console.log("Form validation state:", {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting
    });
  }, [form.formState]);

  useEffect(() => {
    if (profileData?.organizationProfile && !isLoading) {
      const profile = profileData.organizationProfile;
      console.log("Raw profile data:", profile); // Debug log
      console.log("Organization type from profile:", profile.type); // Debug log
      console.log("Available organization types:", organizationTypes); // Debug log

      // Create form data with explicit type handling
      const formData = {
        title: profile.title || "",
        contact_email: profile.contact_email || "",
        phone_number: profile.phone_number || "",
        bio: profile.bio || "",
        type: profile.type || "", // Use the raw type value from the profile
        opportunity_types: Array.isArray(profile.opportunity_types) ? profile.opportunity_types : [],
        required_skills: Array.isArray(profile.required_skills) ? profile.required_skills : [],
        state: profile.state?.replace(/_/g, ' ') || "",
        area: profile.area?.replace(/_/g, ' ') || "",
        abn: profile.abn || "",
        website: profile.website || "",
        profile_img: profile.profile_img || "",
        cover_img: profile.cover_img || "",
      };

      console.log("Form data being set:", formData); // Debug log
      
      // Reset form with the data and skip validation
      form.reset(formData, {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });
    }
  }, [profileData?.organizationProfile, isLoading, form]);

  // Add form state debugging
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: OrganizationProfileData) => {
    console.log("Form submitted with data:", data); // Debug log
    console.log("Organization type in submitted data:", data.type);

    try {
      // Filter out empty strings from arrays
      const opportunity_types = data.opportunity_types.filter(Boolean);
      const required_skills = data.required_skills.filter(Boolean);
      const type = Array.isArray(data.type) ? data.type[0] : data.type;

      console.log("Filtered arrays:", { opportunity_types, required_skills, type }); // Debug log

      // Validate that arrays are not empty after filtering
      if (opportunity_types.length === 0) {
        toast.error("Please select at least one opportunity type");
        return;
      }
      if (required_skills.length === 0) {
        toast.error("Please select at least one required skill");
        return;
      }

      // Validate organization type
      if (!type) {
        toast.error("Please select an organization type");
        return;
      }

      const formattedData = {
        ...data,
        type,
        opportunity_types,
        required_skills,
        state: data.state?.replace(/\s+/g, '_').toLowerCase(),
        area: data.area?.replace(/\s+/g, '_').toLowerCase(),
        website: data.website || ""
      };

      console.log("Formatted data for submission:", formattedData); // Debug log

      const loadingToast = toast.loading("Updating profile...");

      try {
        console.log("Calling mutation..."); // Debug log
        const result = await organizationProfileUpdateMutation.mutateAsync(formattedData);
        console.log("Mutation result:", result); // Debug log
        toast.dismiss(loadingToast);
        router.refresh();
      } catch (error) {
        console.error("Mutation error:", error); // Debug log
        toast.dismiss(loadingToast);
        if (error instanceof Error) {
          toast.error(error.message || "Failed to update profile");
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error); // Debug log
      toast.error("Failed to process form data");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1046px] mx-auto flex flex-col md:flex-row gap-8 p-6">
        {/* Mobile navigation */}
        <div className="md:hidden bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h2 className="text-lg font-semibold">Edit Organization Profile</h2>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 shrink-0 bg-white rounded-lg p-6 h-fit">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Edit Organization Profile</h2>
        </div>

        <div className="flex-1 bg-white rounded-lg p-6">
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit((data) => {
                console.log("Form submit event triggered");
                return onSubmit(data);
              })} 
              className="space-y-4"
            >
              <FormInput<OrganizationProfileData>
                control={form.control}
                name="title"
                label="Organization Name"
                placeholder="Enter your organization name"
              />

              <FormInput<OrganizationProfileData>
                control={form.control}
                name="contact_email"
                label="Contact Email"
                type="email"
                placeholder="Enter your organization email"
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

              <FormTextarea<OrganizationProfileData>
                control={form.control}
                name="bio"
                label="About Organization"
                placeholder="Tell us about your organization"
              />

              <SelectField<OrganizationProfileData>
                label="Organization Type"
                id="type"
                placeholder="Select organization type"
                register={form.register}
                registerName="type"
                error={form.formState.errors.type?.message}
                options={organizationTypes}
                value={form.watch("type")}
                setValue={form.setValue}
              />

              <MultiSelectField
                label="Opportunity Types"
                id="opportunity_types"
                placeholder="Select opportunity types"
                register={form.register}
                registerName="opportunity_types"
                error={form.formState.errors.opportunity_types?.message}
                options={volunteerTypes}
                setValue={form.setValue}
                value={form.watch("opportunity_types")}
              />

              <MultiSelectField
                label="Required Skills"
                id="required_skills"
                placeholder="Select required skills"
                register={form.register}
                registerName="required_skills"
                error={form.formState.errors.required_skills?.message}
                options={volunteerTypes}
                setValue={form.setValue}
                value={form.watch("required_skills")}
              />

              <FormInput<OrganizationProfileData>
                control={form.control}
                name="state"
                label="State"
                placeholder="Enter your state"
                onChange={(e) => {
                  const value = e.target.value.replace(/_/g, ' ');
                  form.setValue('state', value);
                }}
              />

              <FormInput<OrganizationProfileData>
                control={form.control}
                name="area"
                label="Area"
                placeholder="Enter your Area"
                onChange={(e) => {
                  const value = e.target.value.replace(/_/g, ' ');
                  form.setValue('area', value);
                }}
              />

              <FormInput<OrganizationProfileData>
                control={form.control}
                name="abn"
                label="ABN"
                placeholder="Enter your ABN"
              />

              <ProfilePhotoInput
                label="Profile Image"
                name="profile_img"
                setValue={(name: string, value: string) => {
                  form.setValue(name as keyof OrganizationProfileData, value);
                }}
                defaultValue={form.watch("profile_img")}
              />

              <FormInput<OrganizationProfileData>
                control={form.control}
                name="website"
                label="Website"
                placeholder="Enter your website URL"
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={organizationProfileUpdateMutation.isPending}
                onClick={() => {
                  console.log("Submit button clicked");
                  console.log("Form state:", form.formState);
                  console.log("Form values:", form.getValues());
                }}
              >
                {organizationProfileUpdateMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

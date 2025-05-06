"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  VolunteerProfileUpdateData,
  VolunteerProfileUpdateSchema,
} from "@/utils/constants";
import { MultiSelectField } from "@/components/forms/MultiSelectField";
import { PhoneField } from "@/components/forms/PhoneField";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import toast from "react-hot-toast";
const volunteerTypes = [
  { value: "animal_welfare", label: "Animal welfare" },
  { value: "homeless", label: "Homelessness" },
  { value: "education", label: "Education & literacy" },
  { value: "environment", label: "Environment" },
  { value: "health", label: "Health & Medicine" },
  { value: "seniors", label: "Seniors" },
];
export function VolunteerProfileForm() {
  const { data: volunteerProfile } = trpc.volunteers.getVolunteerProfile.useQuery();
  const utils = trpc.useUtils();
  
  const volunteerProfileUpdateMutation = trpc.volunteers.updateVolunteerProfile.useMutation({
    onSuccess: () => {
      utils.volunteers.getVolunteerProfile.invalidate();
      toast.success("Volunteer profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  console.log({volunteerProfile});


  const form = useForm<VolunteerProfileUpdateData>({
    resolver: zodResolver(VolunteerProfileUpdateSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      bio: "",
      interested_on: [],
      state: "",
      area: "",
    },
  });

  useEffect(() => {
    if (volunteerProfile) {
      form.reset({
        name: volunteerProfile.name,
        phone_number: volunteerProfile.phone_number,
        bio: volunteerProfile.bio,
        interested_on: volunteerProfile.interested_on,
        state: volunteerProfile.state?.replace(/_/g, ' '),
        area: volunteerProfile.area?.replace(/_/g, ' '),
      });
    }
  }, [volunteerProfile, form]);

  const onSubmit = async (data: VolunteerProfileUpdateData) => {
    try {
      const formattedData = {
        ...data,
        state: data.state?.replace(/_/g, ' '),
        area: data.area?.replace(/_/g, ' ')
      };
      await volunteerProfileUpdateMutation.mutateAsync(formattedData);
      console.log({ formattedData });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error handling is already done in the mutation's onError
    }
  };

  return (
    <div className=" min-h-screen">
      <div className="max-w-[1046px] mx-auto flex flex-col md:flex-row gap-8 p-6">
        {/* Mobile navigation */}
        <div className="md:hidden bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/volunteer"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h2 className="text-lg font-semibold">Edit profile</h2>
          </div>
         
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 shrink-0 bg-white rounded-lg p-6 h-fit">
          <div className="mb-6">
            <Link
              href="/volunteer"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>

          <h2 className="text-xl font-semibold mb-4 ">Edit profile</h2>

          <div className="space-y-2">
           
           
            
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="name"
                label="Volunteer Name"
                placeholder="Enter your full name"
              
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

              <FormTextarea
                control={form.control}
                name="bio"
                label="About You"
                placeholder="Tell us about yourself"
              />

              <MultiSelectField
                label="What type of volunteer work you like?"
                id="interested_on"
                placeholder="Select volunteer work"
                register={form.register}
                registerName="interested_on"
                error={form.formState.errors.interested_on?.message}
                options={volunteerTypes}
                setValue={form.setValue}
                value={form.watch("interested_on")}
              />

              <FormInput
                control={form.control}
                name="state"
                label="State"
                placeholder="Enter your state"
                onChange={(e) => {
                  const value = e.target.value.replace(/_/g, ' ');
                  form.setValue('state', value);
                }}
              />

              <FormInput
                control={form.control}
                name="area"
                label="Area"
                placeholder="Enter your Area"
                onChange={(e) => {
                  const value = e.target.value.replace(/_/g, ' ');
                  form.setValue('area', value);
                }}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={volunteerProfileUpdateMutation.isPending}
              >
                {volunteerProfileUpdateMutation.isPending ? (
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

"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";

const volunteerProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  bio: z.string().min(1, "About you is required"),
  work_type: z.string().min(1, "Work type is required"),
  country: z.string().min(1, "Country is required"),
  street_address: z.string().min(1, "Street address is required"),
  abn: z.string().min(1, "ABN is required"),
});

type VolunteerProfileData = z.infer<typeof volunteerProfileSchema>;

export function VolunteerProfileForm() {
  const form = useForm<VolunteerProfileData>({
    resolver: zodResolver(volunteerProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      bio: "",
      work_type: "",
      country: "",
      street_address: "",
      abn: "",
    },
  });

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-[1046px] mx-auto flex flex-col md:flex-row gap-8 p-6">
        {/* Mobile navigation */}
        <div className="md:hidden bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/volunteer" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h2 className="text-lg font-semibold">Edit profile</h2>
          </div>
          <div className="flex justify-between items-center">
            <Link 
              href="/volunteer/profile/edit" 
              className="text-blue-600 text-sm font-medium"
            >
              Account
            </Link>
            <Link 
              href="/volunteer/profile/social" 
              className="text-gray-600 text-sm hover:text-gray-900"
            >
              Social
            </Link>
            <Link 
              href="/volunteer/profile/delete" 
              className="text-gray-600 text-sm hover:text-gray-900"
            >
              Delete
            </Link>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 shrink-0 bg-white rounded-lg p-6 h-fit">
          <div className="mb-6">
            <Link href="/volunteer" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 ">Edit profile</h2>
          
          <div className="space-y-2">
            <Link 
              href="/volunteer/profile/edit" 
              className="block text-blue-600 font-medium"
            >
              Account information
            </Link>
            <Link 
              href="/volunteer/profile/social" 
              className="block text-gray-600 hover:text-gray-900"
            >
              Social accounts
            </Link>
            <Link 
              href="/volunteer/profile/delete" 
              className="block text-gray-600 hover:text-gray-900"
            >
              Delete account
            </Link>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-4">
              <FormInput
                control={form.control}
                name="name"
                label="Volunteer Name"
                placeholder="Enter your full name"
              />
  
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
  
              <FormInput
                control={form.control}
                name="phone_number"
                label="Phone Number"
                placeholder="Enter your phone number"
              />
  
              <FormTextarea
                control={form.control}
                name="bio"
                label="About You"
                placeholder="Tell us about yourself"
              />
  
              <FormInput
                control={form.control}
                name="work_type"
                label="Type of Work"
                placeholder="Enter type of work"
              />
  
              <FormInput
                control={form.control}
                name="country"
                label="Country"
                placeholder="Enter your country"
              />
  
              <FormInput
                control={form.control}
                name="street_address"
                label="Street Address"
                placeholder="Enter your street address"
              />
  
              <FormInput
                control={form.control}
                name="abn"
                label="ABN"
                placeholder="Enter your ABN"
              />
  
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
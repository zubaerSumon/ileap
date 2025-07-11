"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form-input/FormInput";
import { FormTextarea } from "@/components/form-input/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  VolunteerProfileUpdateData,
  VolunteerProfileUpdateSchema,
} from "@/utils/constants";
import { MultiSelectField } from "@/components/form-input/MultiSelectField";
import { PhoneField } from "@/components/form-input/PhoneField";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VolunteerProfileFormData } from "@/types/volunteers";
import BackButton from "@/components/buttons/BackButton";
import { Edit, User, Phone, MapPin, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const volunteerTypes = [
  { value: "animal_welfare", label: "Animal welfare" },
  { value: "homeless", label: "Homelessness" },
  { value: "education", label: "Education & literacy" },
  { value: "environment", label: "Environment" },
  { value: "health", label: "Health & Medicine" },
  { value: "seniors", label: "Seniors" },
];

export function VolunteerProfileForm() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: volunteerProfile, isLoading } = trpc.volunteers.getVolunteerProfile.useQuery();
  const utils = trpc.useUtils();
  
  const volunteerProfileUpdateMutation = trpc.volunteers.updateVolunteerProfile.useMutation({
    onSuccess: () => {
      utils.volunteers.getVolunteerProfile.invalidate();
      toast.success("Volunteer profile updated successfully!");
      setIsEditMode(false); // Exit edit mode after successful update
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const form = useForm<VolunteerProfileFormData>({
    resolver: zodResolver(VolunteerProfileUpdateSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      bio: "",
      interested_on: [],
      state: "",
      area: "",
      availability_date: {
        start_date: "",
        end_date: ""
      }
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
        availability_date: volunteerProfile.availability_date
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
    } catch {
      // Error handling is already done in the mutation's onError
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form to current profile data
    if (volunteerProfile) {
      form.reset({
        name: volunteerProfile.name,
        phone_number: volunteerProfile.phone_number,
        bio: volunteerProfile.bio,
        interested_on: volunteerProfile.interested_on,
        state: volunteerProfile.state?.replace(/_/g, ' '),
        area: volunteerProfile.area?.replace(/_/g, ' '),
        availability_date: volunteerProfile.availability_date
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <BackButton />
              <h1 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Profile" : "Profile"}
              </h1>
            </div>
            {!isEditMode && (
              <Button
                onClick={handleEditClick}
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Profile
                  </CardTitle>
                  <BackButton />
                </div>
              </CardHeader>
              <CardContent>
                {!isEditMode && (
                  <Button
                    onClick={handleEditClick}
                    className="w-full flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Update Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {isEditMode ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          control={form.control}
                          name="name"
                          label="Full Name"
                          placeholder="Enter your full name"
                        />

                        <PhoneField
                          label="Phone Number"
                          id="phone_number"
                          placeholder="+61 1243 5978"
                          register={form.register}
                          registerName="phone_number"
                          error={form.formState.errors.phone_number?.message}
                          value={form.watch("phone_number")}
                          setValue={form.setValue}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          placeholder="Enter your area"
                          onChange={(e) => {
                            const value = e.target.value.replace(/_/g, ' ');
                            form.setValue('area', value);
                          }}
                        />
                      </div>

                      <FormTextarea
                        control={form.control}
                        name="bio"
                        label="About You"
                        placeholder="Tell us about yourself, your interests, and why you want to volunteer..."
                      />

                      <MultiSelectField
                        label="Volunteer Interests"
                        id="interested_on"
                        placeholder="Select volunteer work types"
                        register={form.register}
                        registerName="interested_on"
                        error={form.formState.errors.interested_on?.message}
                        options={volunteerTypes}
                        setValue={form.setValue}
                        value={form.watch("interested_on")}
                      />

                      <div className="flex gap-4 pt-4">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={volunteerProfileUpdateMutation.isPending}
                        >
                          {volunteerProfileUpdateMutation.isPending ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              // View Mode
              <div className="space-y-6">
                {/* Profile Header */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                          {volunteerProfile?.name?.charAt(0)?.toUpperCase() || "V"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          {volunteerProfile?.name || "Volunteer Profile"}
                        </h1>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>
                            {volunteerProfile?.area && volunteerProfile?.state 
                              ? `${volunteerProfile.area}, ${volunteerProfile.state.replace(/_/g, ' ')}`
                              : "Location not specified"
                            }
                          </span>
                        </div>
                        {volunteerProfile?.phone_number && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>{volunteerProfile.phone_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About Section */}
                {volunteerProfile?.bio && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        About
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {volunteerProfile.bio}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Interests Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Volunteer Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {volunteerProfile?.interested_on && volunteerProfile.interested_on.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {volunteerProfile.interested_on.map((interest: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 text-sm"
                          >
                            {volunteerTypes.find(type => type.value === interest)?.label || interest}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No interests specified yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

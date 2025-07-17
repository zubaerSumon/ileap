"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form-input/FormInput";
import { FormTextarea } from "@/components/form-input/FormTextarea";
import { FormSelect } from "@/components/form-input/FormSelect";
import {
  organizationTypes,
  volunteerTypes,
} from "@/utils/constants/select-options";
import { locations } from "@/utils/constants/select-options";
import { suburbs } from "@/utils/constants/suburb";
import { userValidation } from "@/server/modules/users/users.validation";

import { PhoneField } from "@/components/form-input/PhoneField";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server";
import { SelectField } from "@/components/form-input/SelectField";
import BackButton from "@/components/buttons/BackButton";
import { useSession } from "next-auth/react";
import { MultiSelectField } from "@/components/form-input/MultiSelectField";
import { formatText } from "@/utils/helpers/formatText";
import { 
  ProfilePictureCard, 
  OrganizationImagesCard, 
  InformationCard, 
  InfoField, 
  InfoGrid, 
  BadgeList, 
  SubmitButton 
} from "@/components/layout/shared";

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
  const [editMode, setEditMode] = useState<"none" | "admin" | "organization" | "images">("none");
  const { data: profileData, isLoading } = trpc.users.profileCheckup.useQuery();
  const { data: session, update: updateSession } = useSession();
  const utils = trpc.useUtils();
  
  // Admin profile picture mutation
  const updateUserMutation = trpc.users.updateUser.useMutation({
    onSuccess: async () => {
      utils.users.profileCheckup.invalidate();
      toast.success("Admin profile picture updated successfully!");
      
      try {
        await updateSession();
      } catch (error) {
        console.error('Session update failed:', error);
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update admin profile picture");
    },
  });
  
  // Organization profile mutation
  const organizationProfileUpdateMutation = trpc.users.setupOrgProfile.useMutation({
    onSuccess: (data, variables) => {
      utils.users.profileCheckup.invalidate();
      if (variables.title && variables.contact_email) {
        toast.success("Organization profile updated successfully!");
        setEditMode("none");
      } else {
        toast.success("Organization images updated successfully!");
      }
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const form = useForm<OrganizationProfileData>({
    resolver: zodResolver(userValidation.organizationProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (profileData?.organizationProfile && !isLoading) {
      const profile = profileData.organizationProfile;
      
      const formData = {
        title: profile.title || "",
        contact_email: profile.contact_email || "",
        phone_number: profile.phone_number || "",
        bio: profile.bio || "",
        type: profile.type || "",
        opportunity_types: Array.isArray(profile.opportunity_types) ? profile.opportunity_types : [],
        required_skills: Array.isArray(profile.required_skills) ? profile.required_skills : [],
        state: profile.state || "",
        area: profile.area?.replace(/_/g, ' ') || "",
        abn: profile.abn || "",
        website: profile.website || "",
        profile_img: profile.profile_img || "",
        cover_img: profile.cover_img || "",
      };
      
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

  const onSubmit = async (data: OrganizationProfileData) => {
    try {
      const opportunity_types = data.opportunity_types.filter(Boolean);
      const required_skills = data.required_skills.filter(Boolean);
      const type = Array.isArray(data.type) ? data.type[0] : data.type;

      if (opportunity_types.length === 0) {
        toast.error("Please select at least one opportunity type");
        return;
      }
      if (required_skills.length === 0) {
        toast.error("Please select at least one required skill");
        return;
      }
      if (!type) {
        toast.error("Please select an organization type");
        return;
      }

      const formattedData = {
        ...data,
        type,
        opportunity_types,
        required_skills,
        website: data.website || ""
      };

      await organizationProfileUpdateMutation.mutateAsync(formattedData);
      router.refresh();
    } catch {
      toast.error("Failed to process form data");
    }
  };

  // Helper to close all edit modes
  const handleCancelEdit = () => setEditMode("none");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profile = profileData?.organizationProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-3 md:p-6">
        <BackButton className="mb-4" />
        
        <div className="space-y-6">
          {/* Admin Profile Picture Card */}
          <ProfilePictureCard
            editMode={editMode === "admin" ? "active" : "inactive"}
            onEditClick={() => setEditMode("admin")}
            onCancelClick={handleCancelEdit}
            onImageChange={(imageUrl) => {
              updateUserMutation.mutate({ image: imageUrl });
            }}
            userName={session?.user?.name || "Admin"}
            userRole="Organization Administrator"
            userEmail={session?.user?.email || undefined}
          />

          {/* Organization Images Card */}
          <OrganizationImagesCard
            editMode={editMode === "images" ? "active" : "inactive"}
            onEditClick={() => setEditMode("images")}
            onCancelClick={handleCancelEdit}
            profileImage={profile?.profile_img}
            coverImage={profile?.cover_img}
            organizationName={profile?.title || "Organization"}
            onProfileImageChange={(imageUrl) => {
              form.setValue("profile_img", imageUrl);
              if (profileData?.organizationProfile) {
                const currentData = {
                  title: profileData.organizationProfile.title || "",
                  contact_email: profileData.organizationProfile.contact_email || "",
                  phone_number: profileData.organizationProfile.phone_number || "",
                  bio: profileData.organizationProfile.bio || "",
                  type: profileData.organizationProfile.type || "",
                  opportunity_types: Array.isArray(profileData.organizationProfile.opportunity_types) ? profileData.organizationProfile.opportunity_types : [],
                  required_skills: Array.isArray(profileData.organizationProfile.required_skills) ? profileData.organizationProfile.required_skills : [],
                  state: profileData.organizationProfile.state || "",
                  area: profileData.organizationProfile.area || "",
                  abn: profileData.organizationProfile.abn || "",
                  website: profileData.organizationProfile.website || "",
                  profile_img: imageUrl,
                  cover_img: form.getValues("cover_img") || profileData.organizationProfile.cover_img || "",
                };
                organizationProfileUpdateMutation.mutate(currentData);
              }
            }}
            onCoverImageChange={(imageUrl) => {
              form.setValue("cover_img", imageUrl);
              if (profileData?.organizationProfile) {
                const currentData = {
                  title: profileData.organizationProfile.title || "",
                  contact_email: profileData.organizationProfile.contact_email || "",
                  phone_number: profileData.organizationProfile.phone_number || "",
                  bio: profileData.organizationProfile.bio || "",
                  type: profileData.organizationProfile.type || "",
                  opportunity_types: Array.isArray(profileData.organizationProfile.opportunity_types) ? profileData.organizationProfile.opportunity_types : [],
                  required_skills: Array.isArray(profileData.organizationProfile.required_skills) ? profileData.organizationProfile.required_skills : [],
                  state: profileData.organizationProfile.state || "",
                  area: profileData.organizationProfile.area || "",
                  abn: profileData.organizationProfile.abn || "",
                  website: profileData.organizationProfile.website || "",
                  profile_img: form.getValues("profile_img") || profileData.organizationProfile.profile_img || "",
                  cover_img: imageUrl,
                };
                organizationProfileUpdateMutation.mutate(currentData);
              }
            }}
          />

          {/* Organization Information Card */}
          <InformationCard
            title="Organization Information"
            editMode={editMode === "organization" ? "active" : "inactive"}
            onEditClick={() => setEditMode("organization")}
            onCancelClick={handleCancelEdit}
          >
            {editMode === "organization" ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <InfoGrid>
                    <FormInput<OrganizationProfileData>
                      control={form.control}
                      name="title"
                      label="Organisation Name"
                      placeholder="Enter your organisation name"
                    />

                    <FormInput<OrganizationProfileData>
                      control={form.control}
                      name="contact_email"
                      label="Contact Email"
                      type="email"
                      placeholder="Enter your organisation email"
                    />
                  </InfoGrid>

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

                  <FormTextarea<OrganizationProfileData>
                    control={form.control}
                    name="bio"
                    label="About Organisation"
                    placeholder="Tell us about your organisation, mission, and values..."
                  />

                  <InfoGrid>
                    <SelectField<OrganizationProfileData>
                      label="Organisation Type"
                      id="type"
                      placeholder="Select organisation type"
                      register={form.register}
                      registerName="type"
                      error={form.formState.errors.type?.message}
                      options={organizationTypes}
                      value={form.watch("type")}
                      setValue={form.setValue}
                    />

                    <FormInput<OrganizationProfileData>
                      control={form.control}
                      name="abn"
                      label="ABN"
                      placeholder="Enter your ABN"
                    />
                  </InfoGrid>

                  <InfoGrid>
                    <FormSelect<OrganizationProfileData>
                      label="State"
                      id="state"
                      placeholder="Select your state"
                      control={form.control}
                      registerName="state"
                      error={form.formState.errors.state?.message}
                      options={locations}
                      searchEnabled
                    />

                    <FormSelect<OrganizationProfileData>
                      label="Area"
                      id="area"
                      placeholder="Select your suburb"
                      control={form.control}
                      registerName="area"
                      error={form.formState.errors.area?.message}
                      options={suburbs}
                      searchEnabled
                    />
                  </InfoGrid>

                  <FormInput<OrganizationProfileData>
                    control={form.control}
                    name="website"
                    label="Website"
                    placeholder="Enter your website URL"
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
                    value={form.watch("opportunity_types") || []}
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
                    value={form.watch("required_skills") || []}
                  />

                  <SubmitButton isPending={organizationProfileUpdateMutation.isPending} />
                </form>
              </Form>
            ) : (
              <div className="space-y-3">
                <InfoGrid>
                  <InfoField label="Organization Name" value={profile?.title} />
                  <InfoField label="Contact Email" value={profile?.contact_email} />
                </InfoGrid>
                
                {profile?.phone_number && (
                  <InfoField label="Phone Number" value={profile.phone_number} />
                )}
                
                {profile?.website && (
                  <InfoField label="Website" value={profile.website} />
                )}
                
                {profile?.state && (
                  <InfoField 
                    label="Location" 
                    value={profile?.area && profile?.state
                      ? formatText(profile.area, profile.state)
                      : profile.state} 
                  />
                )}
                
                {profile?.type && (
                  <InfoField 
                    label="Organization Type" 
                    value={organizationTypes.find(type => type.value === profile.type)?.label || profile.type} 
                  />
                )}
                
                {profile?.abn && (
                  <InfoField label="ABN" value={profile.abn} />
                )}
                
                {profile?.bio && (
                  <InfoField label="About" value={profile.bio} />
                )}
                
                <BadgeList
                  label="Opportunity Types"
                  items={profile?.opportunity_types}
                  badgeColor="blue"
                  emptyMessage="No opportunity types specified"
                />
                
                <BadgeList
                  label="Required Skills"
                  items={profile?.required_skills}
                  badgeColor="green"
                  emptyMessage="No required skills specified"
                />
              </div>
            )}
          </InformationCard>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form-input/FormInput";
import { FormTextarea } from "@/components/form-input/FormTextarea";
import { FormSelect } from "@/components/form-input/FormSelect";
import { Button } from "@/components/ui/button";
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
import { ProfilePictureUpload } from "@/components/form-input/ProfilePictureUpload";
import BackButton from "@/components/buttons/BackButton";
import { Edit, Building2, Phone, MapPin, Mail, Globe, Hash, Heart, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { MultiSelectField } from "@/components/form-input/MultiSelectField";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: profileData, isLoading } = trpc.users.profileCheckup.useQuery();
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  
  const updateUserMutation = trpc.users.updateUser.useMutation({
    onSuccess: async () => {
      utils.users.profileCheckup.invalidate();
      toast.success("Profile picture updated successfully!");
      // Force a page refresh to ensure the session is updated
      console.log('Profile picture updated, refreshing page...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile picture");
    },
  });
  
  const organizationProfileUpdateMutation = trpc.users.setupOrgProfile.useMutation({
    onSuccess: (data, variables) => {
      utils.users.profileCheckup.invalidate();
      // Only show success message and exit edit mode if it's a full form submission
      // For profile image updates, just invalidate the cache
      if (variables.title && variables.contact_email) {
        toast.success("Organization profile updated successfully!");
        setIsEditMode(false); // Exit edit mode after successful update
      } else {
        toast.success("Organization profile picture updated successfully!");
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

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form to current profile data
    if (profileData?.organizationProfile) {
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
      form.reset(formData);
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

  const profile = profileData?.organizationProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <BackButton />
              <h1 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Profile" : "Organization Profile"}
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
                    <Building2 className="h-5 w-5" />
                    Organisation
                  </CardTitle>
                  <div className="hidden lg:block">
                    <BackButton />
                  </div>
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
              <div className="space-y-6">
                {/* Admin Profile Picture Upload - Separate from Organization Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Your Profile Picture</CardTitle>
                    <CardDescription>Your personal profile picture for the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <ProfilePictureUpload
                        currentImage={session?.user?.image || undefined}
                        onImageChange={(imageUrl) => {
                          // Update only the admin's profile image
                          updateUserMutation.mutate({ image: imageUrl });
                        }}
                        userName={session?.user?.name || "Admin"}
                        size="lg"
                        uniqueId="admin"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Organization Profile Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Edit Organisation Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Organization Profile Picture Upload */}
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Profile Picture</h3>
                            <p className="text-sm text-gray-500 mb-4">This will be displayed as your organization&apos;s logo</p>
                          </div>
                          <div className="flex justify-center">
                            <ProfilePictureUpload
                              currentImage={profile?.profile_img || undefined}
                              onImageChange={(imageUrl) => {
                                // Update the form field
                                form.setValue("profile_img", imageUrl);
                                // Also update immediately to the server
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
                                    cover_img: profileData.organizationProfile.cover_img || "",
                                  };
                                  organizationProfileUpdateMutation.mutate(currentData);
                                }
                              }}
                              userName={profile?.title || "Organization"}
                              size="lg"
                              uniqueId="organization"
                            />
                          </div>
                        </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      </div>

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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      </div>

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



                      <div className="flex gap-4 pt-4">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={organizationProfileUpdateMutation.isPending}
                        >
                          {organizationProfileUpdateMutation.isPending ? (
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
            </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                {/* Profile Header */}
                <Card>
                  <CardContent className="pt-6">
                    {/* Organization Information */}
                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                      {/* Organization Profile Picture */}
                      <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                        <Avatar className="h-20 w-20">
                          {profile?.profile_img ? (
                            <AvatarImage src={profile.profile_img} alt={profile.title || "Organisation"} />
                          ) : (
                            <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-600">
                              {profile?.title?.charAt(0)?.toUpperCase() || "O"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="text-xs text-gray-500 text-center font-medium">
                          Organisation Logo
                        </div>
                      </div>

                      {/* Organization Details */}
                      <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 break-words">
                          {profile?.title || "Organisation Profile"}
                        </h1>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="break-words">
                            {profile?.area && profile?.state 
                              ? `${profile.area}, ${profile.state.replace(/_/g, ' ')}`
                              : "Location not specified"
                            }
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm text-gray-600">
                          {profile?.contact_email && (
                            <div className="flex items-center min-w-0">
                              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="break-all">{profile.contact_email}</span>
                            </div>
                          )}
                          {profile?.phone_number && (
                            <div className="flex items-center min-w-0">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="break-all">{profile.phone_number}</span>
                            </div>
                          )}
                          {profile?.website && (
                            <div className="flex items-center min-w-0">
                              <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="break-all">{profile.website}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Admin Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 flex-shrink-0">
                        {session?.user?.image ? (
                          <AvatarImage src={session.user.image!} alt={session?.user?.name || "Admin"} />
                        ) : (
                          <AvatarFallback className="text-lg font-semibold bg-green-100 text-green-600">
                            {session?.user?.name?.charAt(0)?.toUpperCase() || "A"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 break-words">
                          {session?.user?.name || "Admin"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1 break-all">
                          {session?.user?.email}
                        </p>
                        <div className="flex items-center">
                          <Badge variant="secondary" className="text-xs">
                            Organisation Administrator
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Organization Details */}
                <div className="space-y-6">
                  {profile?.type && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Organisation Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary" className="px-3 py-1 text-sm break-words max-w-full">
                          <span className="break-words">
                            {organizationTypes.find(type => type.value === profile.type)?.label || profile.type}
                          </span>
                        </Badge>
                      </CardContent>
                    </Card>
                  )}

                  {profile?.abn && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Hash className="h-5 w-5" />
                          ABN
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 font-mono">{profile.abn}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* About Section */}
                {profile?.bio && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        About
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {profile.bio}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Opportunity Types Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Opportunity Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.opportunity_types && profile.opportunity_types.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.opportunity_types.map((type: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 text-sm break-words max-w-full"
                          >
                            <span className="break-words">
                              {volunteerTypes.find(t => t.value === type)?.label || type}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No opportunity types specified yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Required Skills Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Required Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.required_skills && profile.required_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.required_skills.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="px-3 py-1 text-sm break-words max-w-full"
                          >
                            <span className="break-words">
                              {volunteerTypes.find(s => s.value === skill)?.label || skill}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No required skills specified yet</p>
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

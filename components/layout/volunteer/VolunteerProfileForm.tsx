"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form-input/FormInput";
import { FormTextarea } from "@/components/form-input/FormTextarea";
import { FormSelect } from "@/components/form-input/FormSelect";
import { Button } from "@/components/ui/button";
import {
  VolunteerProfileUpdateData,
  VolunteerProfileUpdateSchema,
} from "@/utils/constants";
import { MultiSelectField } from "@/components/form-input/MultiSelectField";
import { PhoneField } from "@/components/form-input/PhoneField";
import { locations } from "@/utils/constants/select-options";
import { suburbs } from "@/utils/constants/suburb";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BackButton from "@/components/buttons/BackButton";
import { Edit, User, Phone, MapPin, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfilePictureUpload } from "@/components/form-input/ProfilePictureUpload";
import { useSession } from "next-auth/react";
import { formatText } from "@/utils/helpers/formatText";
import countryList from "react-select-country-list";
import { useMemo } from "react";



export function VolunteerProfileForm() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: volunteerProfile, isLoading } = trpc.volunteers.getVolunteerProfile.useQuery();
  const { data: session, update: updateSession } = useSession();
  const utils = trpc.useUtils();
  
  const countryOptions = useMemo(() => countryList().getData(), []);
  
  // Function to get country name from ISO code
  const getCountryName = (isoCode: string) => {
    const country = countryOptions.find(option => option.value === isoCode);
    return country ? country.label : isoCode;
  };
  
  const updateUserMutation = trpc.users.updateUser.useMutation({
    onSuccess: async () => {
      utils.users.profileCheckup.invalidate();
      toast.success("Profile picture updated successfully!");
      
      // Try to update the session first
      try {
        await updateSession();
      } catch (error) {
        console.error('Session update failed:', error);
      }
      
      // Force a page refresh to show the updated profile picture
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile picture");
    },
  });
  
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

  const form = useForm<VolunteerProfileUpdateData>({
    resolver: zodResolver(VolunteerProfileUpdateSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      bio: "",
      interested_on: [],
      interested_categories: [],
      state: "",
      area: "",
      postcode: "",
      // Academic fields
      student_type: "",
      home_country: "",
      course: "",
      major: "",
      major_other: "",
      is_currently_studying: "",
      non_student_type: "",
      university: "",
      graduation_year: "",
      study_area: "",
      availability_date: {
        start_date: "",
        end_date: ""
      },
      is_available: false,
    },
  });

  useEffect(() => {
    if (volunteerProfile) {
      // Handle old users who don't have is_currently_studying field
      // If they have student_type, assume they are currently studying
      // If they have course, assume they are currently studying
      // Otherwise, default to "no"
      let defaultIsCurrentlyStudying = volunteerProfile.is_currently_studying;
      if (!defaultIsCurrentlyStudying) {
        if (volunteerProfile.student_type || volunteerProfile.course) {
          defaultIsCurrentlyStudying = "yes";
        } else {
          defaultIsCurrentlyStudying = "no";
        }
      }

      form.reset({
        name: volunteerProfile.name,
        phone_number: volunteerProfile.phone_number,
        bio: volunteerProfile.bio,
        interested_on: volunteerProfile.interested_on,
        interested_categories: volunteerProfile.interested_categories || [],
        state: volunteerProfile.state,
        area: volunteerProfile.area?.replace(/_/g, ' '),
        availability_date: volunteerProfile.availability_date,
        // Academic fields
        student_type: volunteerProfile.student_type,
        home_country: volunteerProfile.home_country,
        course: volunteerProfile.course,
        major: volunteerProfile.major,
        major_other: volunteerProfile.major_other,
        is_currently_studying: defaultIsCurrentlyStudying,
        non_student_type: volunteerProfile.non_student_type,
        university: volunteerProfile.university,
        graduation_year: volunteerProfile.graduation_year,
        study_area: volunteerProfile.study_area,
      });
    }
  }, [volunteerProfile, form]);

  const onSubmit = async (data: VolunteerProfileUpdateData) => {
    try {
      const formattedData = {
        ...data,
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
      // Handle old users who don't have is_currently_studying field
      let defaultIsCurrentlyStudying = volunteerProfile.is_currently_studying;
      if (!defaultIsCurrentlyStudying) {
        if (volunteerProfile.student_type || volunteerProfile.course) {
          defaultIsCurrentlyStudying = "yes";
        } else {
          defaultIsCurrentlyStudying = "no";
        }
      }

      form.reset({
        name: volunteerProfile.name,
        phone_number: volunteerProfile.phone_number,
        bio: volunteerProfile.bio,
        interested_on: volunteerProfile.interested_on,
        interested_categories: volunteerProfile.interested_categories || [],
        state: volunteerProfile.state,
        area: volunteerProfile.area?.replace(/_/g, ' '),
        availability_date: volunteerProfile.availability_date,
        // Academic fields
        student_type: volunteerProfile.student_type,
        home_country: volunteerProfile.home_country,
        course: volunteerProfile.course,
        major: volunteerProfile.major,
        major_other: volunteerProfile.major_other,
        is_currently_studying: defaultIsCurrentlyStudying,
        non_student_type: volunteerProfile.non_student_type,
        university: volunteerProfile.university,
        graduation_year: volunteerProfile.graduation_year,
        study_area: volunteerProfile.study_area,
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
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-xl">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Profile Picture Upload */}
                      <div className="flex justify-center">
                        <ProfilePictureUpload
                          currentImage={session?.user?.image || undefined}
                          onImageChange={(imageUrl) => {
                            updateUserMutation.mutate({ image: imageUrl });
                          }}
                          userName={volunteerProfile?.name || session?.user?.name || "User"}
                          size="lg"
                        />
                      </div>

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
                        <FormSelect
                          label="State"
                          id="state"
                          placeholder="Select your state"
                          control={form.control}
                          registerName="state"
                          error={form.formState.errors.state?.message}
                          options={locations}
                          searchEnabled
                        />

                        <FormSelect
                          label="Area"
                          id="area"
                          placeholder="Select your area"
                          control={form.control}
                          registerName="area"
                          error={form.formState.errors.area?.message}
                          options={suburbs}
                          searchEnabled
                        />
                      </div>

                      <FormTextarea
                        control={form.control}
                        name="bio"
                        label="About You (optional)"
                        placeholder="Tell us about yourself, your interests, and why you want to volunteer..."
                      />

                      <MultiSelectField
                        label="Volunteer Skills"
                        id="interested_on"
                        placeholder="Select your skills"
                        register={form.register}
                        registerName="interested_on"
                        error={form.formState.errors.interested_on?.message}
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
                        value={form.watch("interested_on")}
                        manualInputEnabled 
                      />

                      <MultiSelectField
                        label="Interested In"
                        id="interested_categories"
                        placeholder="Select opportunity categories you're interested in"
                        register={form.register}
                        registerName="interested_categories"
                        error={form.formState.errors.interested_categories?.message}
                        options={[
                          { value: "Community & Social Services", label: "Community & Social Services" },
                          { value: "Education & Mentorship", label: "Education & Mentorship" },
                          { value: "Healthcare & Medical Volunteering", label: "Healthcare & Medical Volunteering" },
                          { value: "Corporate & Skilled Volunteering", label: "Corporate & Skilled Volunteering" },
                          { value: "Technology & Digital Volunteering", label: "Technology & Digital Volunteering" },
                          { value: "Animal Welfare", label: "Animal Welfare" },
                          { value: "Arts, Culture & Heritage", label: "Arts, Culture & Heritage" },
                          { value: "Environmental & Conservation", label: "Environmental & Conservation" },
                        ]}
                        setValue={form.setValue}
                        value={form.watch("interested_categories")}
                        manualInputEnabled={true}
                      />

                      {/* Academic Information Section */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                        
                        <div className="space-y-4">
                          <FormSelect
                            label="Are you currently studying?"
                            id="is_currently_studying"
                            placeholder="Select your status"
                            control={form.control}
                            registerName="is_currently_studying"
                            error={form.formState.errors.is_currently_studying?.message}
                            options={[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ]}
                            onChange={(value) => {
                              if (value === "yes") {
                                // Reset alumni-related fields when switching to "currently studying"
                                form.setValue("non_student_type", "");
                                form.setValue("university", "");
                                form.setValue("graduation_year", "");
                                form.setValue("study_area", "");
                              } else if (value === "no") {
                                // Reset student-related fields when switching to "not currently studying"
                                form.setValue("student_type", "");
                                form.setValue("home_country", "");
                                form.setValue("course", "");
                                form.setValue("major", "");
                                form.setValue("major_other", "");
                              }
                            }}
                          />

                          {form.watch("is_currently_studying") === "yes" && (
                            <>
                              <FormSelect
                                label="Are you an international student?"
                                id="student_type"
                                placeholder="Select your type"
                                control={form.control}
                                registerName="student_type"
                                error={form.formState.errors.student_type?.message}
                                options={[
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" },
                                ]}
                              />

                              {form.watch("student_type") === "yes" && (
                                <FormSelect
                                  label="Home Country"
                                  id="home_country"
                                  placeholder="Select your country"
                                  control={form.control}
                                  registerName="home_country"
                                  error={form.formState.errors.home_country?.message}
                                  options={countryOptions}
                                />
                              )}

                              <FormSelect
                                label="Course"
                                id="course"
                                placeholder="Select your course"
                                control={form.control}
                                registerName="course"
                                error={form.formState.errors.course?.message}
                                options={[
                                  { value: "phd", label: "Doctorate / PhD" },
                                  { value: "masters", label: "Master's Degree (Postgraduate)" },
                                  { value: "bachelor", label: "Bachelor's Degree (Undergraduate)" },
                                  { value: "diploma", label: "Diploma / Certificate" },
                                  { value: "professional", label: "Professional / Industry Expert" },
                                ]}
                              />

                              <FormSelect
                                label="Major"
                                id="major"
                                placeholder="Select your major"
                                control={form.control}
                                registerName="major"
                                error={form.formState.errors.major?.message}
                                options={[
                                  { value: "business", label: "Business" },
                                  { value: "engineering", label: "Engineering" },
                                  { value: "it", label: "Information Technology" },
                                  { value: "science", label: "Science" },
                                  { value: "arts", label: "Arts" },
                                  { value: "education", label: "Education" },
                                  { value: "health", label: "Health" },
                                  { value: "other", label: "Other" },
                                ]}
                              />

                              {form.watch("major") === "other" && (
                                <FormInput
                                  control={form.control}
                                  name="major_other"
                                  label="Please specify your major"
                                  placeholder="Enter your major"
                                />
                              )}
                            </>
                          )}

                          {form.watch("is_currently_studying") === "no" && (
                            <>
                              <FormSelect
                                label="What type of member are you?"
                                id="non_student_type"
                                placeholder="Select your type"
                                control={form.control}
                                registerName="non_student_type"
                                error={form.formState.errors.non_student_type?.message}
                                options={[
                                  { value: "staff", label: "Staff Member" },
                                  { value: "alumni", label: "University Alumni" },
                                  { value: "general_public", label: "General Public Member" },
                                ]}
                              />

                              {form.watch("non_student_type") === "alumni" && (
                                <>
                                  <FormInput
                                    control={form.control}
                                    name="university"
                                    label="University"
                                    placeholder="e.g. University of Technology Sydney, University of Sydney, etc."
                                  />

                                  <FormSelect
                                    label="Graduation Year"
                                    id="graduation_year"
                                    placeholder="Select graduation year"
                                    control={form.control}
                                    registerName="graduation_year"
                                    error={form.formState.errors.graduation_year?.message}
                                    options={Array.from({ length: 30 }, (_, i) => {
                                      const year = new Date().getFullYear() - i;
                                      return { value: year.toString(), label: year.toString() };
                                    })}
                                  />

                                  <FormInput
                                    control={form.control}
                                    name="study_area"
                                    label="Study Area"
                                    placeholder="e.g. Business, Engineering, Arts, etc."
                                  />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      


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
                        {session?.user?.image ? (
                          <AvatarImage
                            src={session.user.image!}
                            alt={volunteerProfile?.name || "Profile"}
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                            {volunteerProfile?.name?.charAt(0)?.toUpperCase() || "V"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          {volunteerProfile?.name || "Volunteer Profile"}
                        </h1>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>
                            {volunteerProfile?.area && volunteerProfile?.state 
                              ? formatText(volunteerProfile.area, volunteerProfile.state)
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

                {/* Skills Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Volunteer Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {volunteerProfile?.interested_on && volunteerProfile.interested_on.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {volunteerProfile.interested_on.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 text-sm"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No skills specified yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Interested In Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Interested In
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {volunteerProfile?.interested_categories && volunteerProfile.interested_categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {volunteerProfile.interested_categories.map((category: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 text-sm"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No interests specified yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Academic Information Section */}
                {(volunteerProfile?.is_currently_studying || volunteerProfile?.student_type || volunteerProfile?.course || volunteerProfile?.non_student_type || volunteerProfile?.home_country || volunteerProfile?.major) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Academic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Show a note for old users who need to update their information */}
                        {!volunteerProfile?.is_currently_studying && (volunteerProfile?.student_type || volunteerProfile?.course) && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-yellow-800">
                              <strong>Update needed:</strong> Please update your academic information to use the new format.
                            </p>
                          </div>
                        )}

                        {volunteerProfile?.is_currently_studying && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Currently Studying</p>
                            <p className="text-gray-700 text-sm">
                              {volunteerProfile.is_currently_studying === "yes" ? "Yes" : "No"}
                            </p>
                          </div>
                        )}

                        {(volunteerProfile?.is_currently_studying === "yes" || (!volunteerProfile?.is_currently_studying && volunteerProfile?.student_type)) && volunteerProfile?.student_type && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Student Type</p>
                            <p className="text-gray-700 text-sm">
                              {volunteerProfile.student_type === "yes" ? "International Student" : "Domestic Student"}
                            </p>
                          </div>
                        )}

                        {(volunteerProfile?.is_currently_studying === "yes" || (!volunteerProfile?.is_currently_studying && volunteerProfile?.student_type === "yes")) && volunteerProfile?.home_country && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Home Country</p>
                            <p className="text-gray-700 text-sm">{getCountryName(volunteerProfile.home_country)}</p>
                          </div>
                        )}

                        {(volunteerProfile?.is_currently_studying === "yes" || (!volunteerProfile?.is_currently_studying && volunteerProfile?.course)) && volunteerProfile?.course && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Course</p>
                            <p className="text-gray-700 text-sm">{volunteerProfile.course}</p>
                          </div>
                        )}

                        {(volunteerProfile?.is_currently_studying === "yes" || (!volunteerProfile?.is_currently_studying && volunteerProfile?.major)) && volunteerProfile?.major && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Major</p>
                            <p className="text-gray-700 text-sm">
                              {volunteerProfile.major === "other" ? volunteerProfile.major_other : volunteerProfile.major}
                            </p>
                          </div>
                        )}

                        {volunteerProfile?.is_currently_studying === "no" && volunteerProfile?.non_student_type && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Member Type</p>
                            <p className="text-gray-700 text-sm">
                              {volunteerProfile.non_student_type === "staff" ? "Staff Member" :
                               volunteerProfile.non_student_type === "alumni" ? "University Alumni" :
                               "General Public Member"}
                            </p>
                          </div>
                        )}

                        {volunteerProfile?.non_student_type === "alumni" && volunteerProfile?.university && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">University</p>
                            <p className="text-gray-700 text-sm">{volunteerProfile.university}</p>
                          </div>
                        )}

                        {volunteerProfile?.non_student_type === "alumni" && volunteerProfile?.graduation_year && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                            <p className="text-gray-700 text-sm">{volunteerProfile.graduation_year}</p>
                          </div>
                        )}

                        {volunteerProfile?.non_student_type === "alumni" && volunteerProfile?.study_area && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Study Area</p>
                            <p className="text-gray-700 text-sm">{volunteerProfile.study_area}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

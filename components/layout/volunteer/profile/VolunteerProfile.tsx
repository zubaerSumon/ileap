"use client";

 import Image from "next/image";
import { trpc } from "@/utils/trpc";
import { Key, useState, useMemo } from "react";
import BackButton from "@/components/buttons/BackButton";
import UserAvatar from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/button";
import MessageDialog from "@/components/layout/organisation/MessageDialog";
import Loading from "@/app/loading";
import { MessageCircle } from "lucide-react";
import countryList from "react-select-country-list";
import { formatText } from "@/utils/helpers/formatText";

interface VolunteerProfileProps {
  volunteerId: string;
}

interface Application {
  _id: string;
  status: "pending" | "approved" | "rejected";
  opportunity: {
    _id: string;
    title: string;
    description: string;
    category: string[];
    location: string;
    commitment_type: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function VolunteerProfile({ volunteerId }: VolunteerProfileProps) {
  const { data: volunteer, isLoading } =
    trpc.volunteers.getVolunteerById.useQuery(volunteerId);
  const { data: applications, isLoading: isLoadingApplications } =
    trpc.applications.getVolunteerApplications.useQuery(volunteerId);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const countryOptions = useMemo(() => countryList().getData(), []);
  
  // Function to get country name from ISO code
  const getCountryName = (isoCode: string) => {
    const country = countryOptions.find(option => option.value === isoCode);
    return country ? country.label : isoCode;
  };

  if (isLoading || isLoadingApplications) {
    return (
      <Loading size="medium">
        <p className="text-gray-600 mt-2">Wait a sec...</p>
      </Loading>
    );
  }

  if (!volunteer) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-600">Volunteer not found.</p>
      </div>
    );
  }

  // Helper function to get display text for student status
  const getStudentStatusDisplay = () => {
    if (volunteer.is_currently_studying) {
      if (volunteer.is_currently_studying === "yes") {
        return "Currently Studying";
      } else if (volunteer.is_currently_studying === "no") {
        if (volunteer.non_student_type === "staff") {
          return "Staff Member";
        } else if (volunteer.non_student_type === "alumni") {
          return "Alumni";
        } else if (volunteer.non_student_type === "general") {
          return "General Public";
        }
        return "Not Currently Studying";
      }
    }
    
    // Fallback for old users
    if (volunteer.student_type) {
      return volunteer.student_type === "yes" ? "Student" : "Non-Student";
    }
    
    return "Not specified";
  };

  // Helper function to get course/study area display
  const getCourseDisplay = () => {
    if (volunteer.is_currently_studying === "yes" && volunteer.course) {
      return volunteer.course;
    }
    if (volunteer.is_currently_studying === "no" && volunteer.study_area) {
      return volunteer.study_area;
    }
    // Fallback for old users
    if (volunteer.course) {
      return volunteer.course;
    }
    return null;
  };

  // Helper function to get university display
  const getUniversityDisplay = () => {
    if (volunteer.is_currently_studying === "yes" && volunteer.university) {
      return volunteer.university;
    }
    if (volunteer.is_currently_studying === "no" && volunteer.non_student_type === "alumni" && volunteer.university) {
      return volunteer.university;
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Header with background */}
      <div className="relative h-32 sm:h-40 md:h-48 rounded-lg sm:rounded-xl overflow-hidden">
        <Image
          src="/pfbg.png"
          alt="Profile background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl">
            <UserAvatar
              user={volunteer}
              size={48}
              className="rounded-lg sm:rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* Basic Info */}
        <div className=" ">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
                {volunteer.name}
              </h2>

              {volunteer.bio && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    About
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {volunteer.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {volunteer.interested_on &&
                volunteer.interested_on.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.interested_on.map(
                        (skill: string, index: Key | null | undefined) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex-shrink-0">
              <Button
                onClick={() => setIsMessageModalOpen(true)}
                className="w-full cursor-pointer h-10 sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 min-w-[140px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Message</span>
              </Button>
            </div>
          </div>

          {/* Availability */}
          {/* {volunteer.availability_date && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Availability</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-700 text-sm">
                <span>From: {new Date(volunteer.availability_date.start_date || '').toLocaleDateString()}</span>
                <span className="hidden sm:inline">-</span>
                <span>To: {new Date(volunteer.availability_date.end_date || '').toLocaleDateString()}</span>
              </div>
            </div>
          )} */}
        </div>

        {/* Additional Info */}
        <div className=" ">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            Additional Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Member Type */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Member Type
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                {getStudentStatusDisplay()}
              </p>
            </div>

            {/* Location */}
            {(volunteer.state || volunteer.area) && (
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {volunteer.area && volunteer.state 
                    ? formatText(volunteer.area, volunteer.state)
                    : volunteer.state || formatText(volunteer.area)
                  }
                </p>
              </div>
            )}



            {/* Home Country (for all students) */}
            {(volunteer.is_currently_studying === "yes" || (!volunteer.is_currently_studying && volunteer.student_type)) && (
              <div>
                <p className="text-sm font-medium text-gray-500">Home Country</p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {volunteer.student_type === "yes" ? (volunteer.home_country ? getCountryName(volunteer.home_country) : "Australia") : "Australia"}
                </p>
              </div>
            )}

            {/* Course/Study Area */}
            {getCourseDisplay() && (
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {volunteer.is_currently_studying === "yes" ? "Course" : "Study Area"}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {getCourseDisplay()}
                </p>
              </div>
            )}

            {/* Major */}
            {volunteer.major && (
              <div>
                <p className="text-sm font-medium text-gray-500">Major</p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {volunteer.major === "other" ? volunteer.major_other : volunteer.major}
                </p>
              </div>
            )}

            {/* University */}
            {getUniversityDisplay() && (
              <div>
                <p className="text-sm font-medium text-gray-500">University</p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {getUniversityDisplay()}
                </p>
              </div>
            )}

            {/* Graduation Year (for alumni) */}
            {volunteer.is_currently_studying === "no" && 
             volunteer.non_student_type === "alumni" && 
             volunteer.graduation_year && (
              <div>
                <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {volunteer.graduation_year}
                </p>
              </div>
            )}

            {/* Postcode */}
            {volunteer.postcode && (
              <div>
                <p className="text-sm font-medium text-gray-500">Postcode</p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {volunteer.postcode}
                </p>
              </div>
            )}
          </div>

          {/* Interested Categories */}
          {volunteer.interested_categories && volunteer.interested_categories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Interested Categories</p>
              <div className="flex flex-wrap gap-2">
                {volunteer.interested_categories.map((category: string, index: number) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Experience/Applications Section */}
        {applications && applications.length > 0 && (
          <div className=" ">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Experience & Applications
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {(applications as Application[])
                .filter(
                  (
                    application
                  ): application is Application & {
                    opportunity: NonNullable<Application["opportunity"]>;
                  } => Boolean(application.opportunity?.title)
                )
                .map((application) => (
                  <div
                    key={application._id}
                    className="border rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                          {application.opportunity.title}
                        </h4>

                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {application.opportunity.category?.map(
                            (category: string, index: number) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {category}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs sm:text-sm text-gray-500 space-y-1">
                      <p>
                        Location:{" "}
                        {application.opportunity.location || "Not specified"}
                      </p>
                      <p>
                        Commitment:{" "}
                        {application.opportunity.commitment_type ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        volunteer={volunteer}
      />
    </div>
  );
}

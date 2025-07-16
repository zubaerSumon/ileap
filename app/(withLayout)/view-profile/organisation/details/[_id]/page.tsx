"use client";

import { useParams } from "next/navigation";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Link from "next/link";
import Image from "next/image";
import OrganizationOpportunities from "@/components/layout/volunteer/home-page/OrganizationOpportunities";
import { trpc } from "@/utils/trpc";
import BackButton from "@/components/buttons/BackButton";
import Loading from "@/app/loading";
import OrganizationAvatar from "@/components/ui/OrganizationAvatar";
import { formatText } from "@/utils/helpers/formatText";

export default function OrganizerDetailPage() {
  const params = useParams();
  const organizerId = params?._id;

  const { data, isLoading, error } =
    trpc.organizations.getOrganizationProfile.useQuery(organizerId as string, {
      enabled: !!organizerId,
    });

  if (!organizerId) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-2xl font-bold">Organizer not found</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Loading size="medium">
        <p className="text-gray-600 mt-2">Wait a sec...</p>
      </Loading>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-2xl font-bold text-red-600">
          Error loading organizer profile
        </h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-2xl font-bold">No data available</h1>
      </div>
    );
  }

  const { organizationProfile } = data;

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Cover Image */}
          <div className="relative mb-8 pt-4">
            <div className="w-full h-[200px] relative rounded-lg overflow-hidden">
              <Image
                src={organizationProfile.cover_img || "/pfbg2.svg"}
                alt={`${organizationProfile.title} Cover`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Organization Header with Avatar */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <OrganizationAvatar
                organization={{
                  title: organizationProfile.title,
                  profile_img: organizationProfile.profile_img
                }}
                size={120}
                className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg"
              />
            </div>

            {/* Organization Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {organizationProfile?.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="mr-1">📍</span>
                    <span>
                      {formatText(organizationProfile.area, organizationProfile.state)}
                    </span>
                  </div>
                  {organizationProfile.website && (
                    <div className="flex items-center mb-2">
                      <Link
                        href={organizationProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                      >
                        <span className="mr-1">🌐</span>
                        {organizationProfile.website}
                      </Link>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {organizationProfile.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact and Location Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center text-center sm:text-left mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <p className="text-gray-600">{formatText(organizationProfile.area)}</p>
              <p className="text-gray-600">
                {formatText(organizationProfile.state)}, <br />
                Australia
              </p>
            </div>
            <div>
              {/* <h2 className="text-lg font-semibold mb-2">Contact Us</h2> */}
              {/* {user.email && (
                <p className="text-gray-700">
                  Mail-{" "}
                  <a
                    href={`mailto:${user.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {organizationProfile.contact_email}
                  </a>
                </p>
              )}
              {organizationProfile.phone_number && (
                <p className="text-gray-700">
                  Phone -{" "}
                  <a
                    href={`tel:${organizationProfile.phone_number}`}
                    className="text-blue-600 hover:underline"
                  >
                    {organizationProfile.phone_number}
                  </a>
                </p>
              )} */}
            </div>
          </div>

          {organizationProfile.bio && (
            <div className="mt-8 text-center md:text-left">
              <h2 className="text-lg font-semibold mb-2">About us</h2>
              <p className="text-gray-700 text-justify">
                {organizationProfile.bio}
              </p>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">All Opportunities</h2>
            <OrganizationOpportunities organizationId={organizerId as string} />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

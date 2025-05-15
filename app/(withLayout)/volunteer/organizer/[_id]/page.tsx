"use client";

import { useParams } from "next/navigation";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Categories from "@/components/layout/volunteer/homepage/HomePageCategories";
import { trpc } from "@/utils/trpc";
import { Loader2 } from "lucide-react";

export default function OrganizerDetailPage() {
  const params = useParams();
  const organizerId = params?._id;

  const { data, isLoading, error } = trpc.organizationProfile.getOrganizationProfile.useQuery(
    organizerId as string,
    {
      enabled: !!organizerId,
    }
  );

  if (!organizerId) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-2xl font-bold">Organizer not found</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mb-8 pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-2xl font-bold text-red-600">Error loading organizer profile</h1>
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

  const { organizationProfile, user } = data;

  return (
    <ProtectedLayout>
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-4">
          <Link
            href="/volunteer"
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 bg-white/80 px-3 py-1.5 rounded-lg w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>

        <div className=" ">
          <div className="px-4 mb-8">
            <div className="relative mb-6 pt-4">
              <div className="w-full h-[200px] relative rounded-lg overflow-hidden">
                <Image
                  src={organizationProfile.cover_img || "/pfbg2.svg"}
                  alt={`${user.name} Cover`}
                  fill
                  className="object-cover"
                />

                <div className="absolute bottom-4 left-4 w-[80px] h-[80px] rounded-lg overflow-hidden border-4 border-white bg-white">
                  <Image
                    src={organizationProfile.profile_img || "/Easy.svg"}
                    alt={`${user.name} Logo`}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-start items-center text-center md:text-left gap-6 md:gap-0">
              <div className="flex flex-col items-center md:items-start gap-1 md:w-1/3">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center text-gray-600">
                  <span className="mr-1">📍</span>
                  <span>{organizationProfile.area}, {organizationProfile.state}</span>
                </div>
                {organizationProfile.website && (
                  <div className="flex items-center text-blue-600 underline">
                    <Link
                      href={organizationProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline"
                    >
                      {organizationProfile.website}
                    </Link>
                  </div>
                )}
                <div className="mt-1 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {organizationProfile.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center text-center sm:text-left md:w-2/3">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Location</h2>
                  <p className="text-gray-600">{organizationProfile.area}</p>
                  <p className="text-gray-600">
                    {organizationProfile.state}, <br />
                    Australia
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
                  {user.email && (
                    <p className="text-gray-700">
                      Mail-{" "}
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {user.email}
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
                  )}
                </div>
              </div>
            </div>

            {organizationProfile.bio && (
              <div className="mt-8 text-center md:text-left">
                <h2 className="text-lg font-semibold mb-2">About us</h2>
                <p className="text-gray-700">{organizationProfile.bio}</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">All Opportunities</h2>
              <Categories />
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

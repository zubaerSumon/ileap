"use client";

import Link from "next/link";
import Image from "next/image";
import OrganizationOpportunities from "@/components/layout/volunteer/home-page/OrganizationOpportunities";
import { trpc } from "@/utils/trpc";
import BackButton from "@/components/buttons/BackButton";
import Loading from "@/app/loading";
import OrganizationAvatar from "@/components/ui/OrganizationAvatar";
import { formatText } from "@/utils/helpers/formatText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Building2, Heart } from "lucide-react";

interface OrganizationProfileViewProps {
  organizerId: string;
}

export default function OrganizationProfileView({ organizerId }: OrganizationProfileViewProps) {
  const { data, isLoading, error } =
    trpc.organizations.getOrganizationProfile.useQuery(organizerId, {
      enabled: !!organizerId,
    });

  if (!organizerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Organizer not found</h1>
          <p className="text-gray-600">The organization you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="medium">
          <p className="text-gray-600 mt-2">Loading organization profile...</p>
        </Loading>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error loading organizer profile
          </h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No data available</h1>
          <p className="text-gray-600">This organization profile is empty.</p>
        </div>
      </div>
    );
  }

  const { organizationProfile } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Header with Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Hero Section with Cover Image */}
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <div className="w-full h-[300px] md:h-[400px] relative">
              <Image
                src={organizationProfile.cover_img || "/pfbg2.svg"}
                alt={`${organizationProfile.title} Cover`}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            
            {/* Organization Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-end gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <OrganizationAvatar
                    organization={{
                      title: organizationProfile.title,
                      profile_img: organizationProfile.profile_img
                    }}
                    size={120}
                    className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-xl"
                  />
                </div>
                
                {/* Organization Details */}
                <div className="flex-1 min-w-0 text-white">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                    {organizationProfile?.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center text-white/90">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm md:text-base">
                        {formatText(organizationProfile.area, organizationProfile.state)}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {organizationProfile.type}
                    </Badge>
                  </div>
                  {organizationProfile.website && (
                    <Link
                      href={organizationProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-white/90 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      <span className="text-sm md:text-base underline">Visit Website</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* About Section */}
            {organizationProfile.bio && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    About Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {organizationProfile.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Location & Details */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location & Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <div className="space-y-1 text-gray-600">
                      <p>{formatText(organizationProfile.area)}</p>
                      <p>{formatText(organizationProfile.state)}, Australia</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800">Organization Type</h3>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      {organizationProfile.type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Width Opportunities Section */}
          <div className="mt-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Heart className="w-5 h-5 text-red-600" />
                  Volunteer Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrganizationOpportunities organizationId={organizerId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
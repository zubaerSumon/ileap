'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { trpc } from '@/utils/trpc';
import { Key } from 'react';
import BackButton from '@/components/buttons/BackButton';
import RandomAvatar from '@/components/ui/random-avatar';

interface VolunteerProfileProps {
  volunteerId: string;
}

interface Application {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
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
  const { data: volunteer, isLoading } = trpc.volunteers.getVolunteerById.useQuery(volunteerId);
  const { data: applications, isLoading: isLoadingApplications } = trpc.applications.getVolunteerApplications.useQuery(volunteerId);

  if (isLoading || isLoadingApplications) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-600">Volunteer not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <RandomAvatar
              name={volunteer.name}
              size={48}
              className="rounded-lg sm:rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">{volunteer.name}</h2>
          
          {volunteer.bio && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{volunteer.bio}</p>
            </div>
          )}

          {/* Interests */}
          {volunteer.interested_on && volunteer.interested_on.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {volunteer.interested_on.map((interest: string, index: Key | null | undefined) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                  >
                    {interest.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

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
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Additional Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {volunteer.student_type && (
              <div>
                <p className="text-sm font-medium text-gray-500">Student Status</p>
                <p className="text-gray-700 text-sm sm:text-base">{volunteer.student_type === 'yes' ? 'Student' : 'Non-Student'}</p>
              </div>
            )}
            
            {volunteer.course && (
              <div>
                <p className="text-sm font-medium text-gray-500">Course</p>
                <p className="text-gray-700 text-sm sm:text-base">{volunteer.course}</p>
              </div>
            )}
          </div>
        </div>

        {/* Experience/Applications Section */}
        {applications && applications.length > 0 && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Experience & Applications</h3>
            <div className="space-y-3 sm:space-y-4">
              {(applications as Application[])
                .filter((application): application is Application & { opportunity: NonNullable<Application['opportunity']> } => 
                  Boolean(application.opportunity?.title)
                )
                .map((application) => (
                <div key={application._id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        {application.opportunity.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                        {application.opportunity.category?.map((category: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-gray-500 space-y-1">
                    <p>Location: {application.opportunity.location || 'Not specified'}</p>
                    <p>Commitment: {application.opportunity.commitment_type || 'Not specified'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
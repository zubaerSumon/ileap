'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { trpc } from '@/utils/trpc';
import { Key } from 'react';
import BackButton from '@/components/buttons/BackButton';

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
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Volunteer not found.</p>
      </div>
    );
  }

  return (
    <div className="w-[964px] mx-auto">
      {/* Back Button */}
      <BackButton />
      
      {/* Header with background */}
      <div className="relative h-48 rounded-[12px] overflow-hidden">
        <Image
          src="/pfbg.png"
          alt="Profile background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-6 left-6">
          <div className="relative w-14 h-14 rounded-[12px]">
            <Image
              src={volunteer.avatar || '/vp.svg'}
              alt={volunteer.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{volunteer.name}</h2>
          
          {volunteer.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
              <p className="text-gray-700">{volunteer.bio}</p>
            </div>
          )}

          {/* Interests */}
          {volunteer.interested_on && volunteer.interested_on.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {volunteer.interested_on.map((interest: string, index: Key | null | undefined) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
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
              <div className="flex items-center gap-2 text-gray-700">
                <span>From: {new Date(volunteer.availability_date.start_date || '').toLocaleDateString()}</span>
                <span>-</span>
                <span>To: {new Date(volunteer.availability_date.end_date || '').toLocaleDateString()}</span>
              </div>
            </div>
          )} */}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {volunteer.student_type && (
              <div>
                <p className="text-sm font-medium text-gray-500">Student Status</p>
                <p className="text-gray-700">{volunteer.student_type === 'yes' ? 'Student' : 'Non-Student'}</p>
              </div>
            )}
            
            {volunteer.course && (
              <div>
                <p className="text-sm font-medium text-gray-500">Course</p>
                <p className="text-gray-700">{volunteer.course}</p>
              </div>
            )}
          </div>
        </div>

        {/* Experience/Applications Section */}
        {applications && applications.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Experience & Applications</h3>
            <div className="space-y-4">
              {(applications as Application[])
                .filter((application): application is Application & { opportunity: NonNullable<Application['opportunity']> } => 
                  Boolean(application.opportunity?.title)
                )
                .map((application) => (
                <div key={application._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.opportunity.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
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
                  <div className="mt-3 text-sm text-gray-500">
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
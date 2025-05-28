'use client';

import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { Key } from 'react';

interface VolunteerProfileProps {
  volunteerId: string;
}

export function VolunteerProfile({ volunteerId }: VolunteerProfileProps) {
  const router = useRouter();
  const { data: volunteer, isLoading } = trpc.volunteers.getVolunteerById.useQuery(volunteerId);

  if (isLoading) {
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
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
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
          {volunteer.availability_date && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Availability</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <span>From: {new Date(volunteer.availability_date.start_date || '').toLocaleDateString()}</span>
                <span>-</span>
                <span>To: {new Date(volunteer.availability_date.end_date || '').toLocaleDateString()}</span>
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
}
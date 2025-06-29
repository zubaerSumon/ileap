'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { VolunteerProfile } from '@/components/layout/volunteer/profile/VolunteerProfile';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function VolunteerProfilePage() {
  const params = useParams();
  const volunteerId = params.id as string;

  return (
    <ProtectedLayout>
      <div className="bg-gray-50 min-h-screen pt-10">
        <div className="bg-white rounded-lg max-w-[1100px] mx-auto py-10">
          <VolunteerProfile volunteerId={volunteerId} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
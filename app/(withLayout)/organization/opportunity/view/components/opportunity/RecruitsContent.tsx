'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import Image from "next/image";
import VolunteerModal from './VolunteerModal';
import { trpc } from "@/utils/trpc";
import { useParams, useRouter } from "next/navigation";

interface Volunteer {
  _id: string;
  name: string;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  email: string;
}

export function RecruitsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id as string;

  const { data: volunteers, isLoading } = trpc.applications.getVolunteersByOpportunity.useQuery<Volunteer[]>(
    { opportunityId },
    { enabled: !!opportunityId }
  );

  const handleSendMessage = (volunteer: Volunteer) => {
    // Navigate to messaging page with the volunteer's ID
    router.push(`/messaging?userId=${volunteer._id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!volunteers?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No volunteers have applied to this opportunity yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {volunteers.map((volunteer) => (
        <div key={volunteer._id} className="bg-white rounded-lg p-6 border space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="relative w-[34px] h-[34px] shrink-0">
                  <Image
                    src={volunteer.avatar || "/avatar.svg"}
                    alt={volunteer.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="font-medium">{volunteer.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  volunteer.status === 'approved' 
                    ? 'bg-green-50 text-green-600' 
                    : volunteer.status === 'rejected'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <p>Applied on {new Date(volunteer.appliedAt).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-3 min-w-[56px]"
                  >
                    <Star className="w-6 h-6 text-yellow-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-6 font-normal"
                    onClick={() => {
                      setSelectedVolunteer(volunteer);
                      setIsModalOpen(true);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="bg-[#246BFD] hover:bg-[#246BFD]/90 text-white px-6 rounded-[6px]"
                  onClick={() => handleSendMessage(volunteer)}
                >
                  Send message
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <VolunteerModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVolunteer(null);
        }}
        volunteer={selectedVolunteer}
      />
    </div>
  );
}
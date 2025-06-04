"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import VolunteerCard from "@/components/layout/organisation/VolunteerCard";
import MessageDialog from "@/components/layout/organisation/MessageDialog";
 
interface Volunteer {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
  volunteer_profile?: {
    student_type?: "yes" | "no";
    course?: string;
    availability_date?: {
      start_date?: string;
      end_date?: string;
    };
    interested_on?: string[];
    bio?: string;
  };
}

export default function OrganizationHomepage() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Fetch all available volunteers
  const { data: volunteers, isLoading: isLoadingVolunteers } =
    trpc.users.getAvailableUsers.useQuery();

  const handleSendMessage = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsMessageModalOpen(true);
  };

  return (
    <section className="container mx-auto px-4 py-8">
  
       <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Volunteers</h2>

      <div className="flex flex-col gap-4">
        {isLoadingVolunteers ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        ) : volunteers?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              No volunteers available at the moment.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {volunteers?.map((volunteer) => (
              <VolunteerCard
                key={volunteer._id}
                volunteer={volunteer}
                onConnect={handleSendMessage}
              />
            ))}
          </div>
        )}
      </div>

      <MessageDialog
        isOpen={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        volunteer={selectedVolunteer}
      />
    </section>
  );
}
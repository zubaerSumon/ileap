"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import VolunteerCard from "@/components/layout/organisation/VolunteerCard";
import MessageDialog from "@/components/layout/organisation/MessageDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
 
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
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all available volunteers
  const { data: volunteers, isLoading: isLoadingVolunteers } =
    trpc.users.getAvailableUsers.useQuery();

  // Filter volunteers based on search query (name or interests)
  const filteredVolunteers = volunteers?.filter((volunteer) => {
    const searchLower = searchQuery.toLowerCase();
    
    // Check if name matches
    const nameMatches = volunteer.name.toLowerCase().includes(searchLower);
    
    // Check if any interests match
    const interestsMatch = volunteer.volunteer_profile?.interested_on?.some(
      (interest: string) => interest.toLowerCase().includes(searchLower)
    );
    
    // Return true if either name or interests match
    return nameMatches || interestsMatch;
  });

  const handleSendMessage = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsMessageModalOpen(true);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Volunteers</h2>
        
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by name or interests..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoadingVolunteers ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        ) : filteredVolunteers?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              {searchQuery ? "No volunteers match your search." : "No volunteers available at the moment."}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery ? "Try a different search term." : "Please check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVolunteers?.map((volunteer) => (
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
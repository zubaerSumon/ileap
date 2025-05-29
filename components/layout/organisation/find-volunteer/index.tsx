import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";
import { ApplicantsCard, type Applicant } from "@/components/layout/organisation/opportunities/ApplicantsCard";
import VolunteerModal from "@/components/layout/organisation/opportunities/VolunteerModal";
import MessageApplicantModal from "@/components/layout/organisation/opportunities/MessageApplicantModal";

interface VolunteerProfile {
  location?: string;
  bio?: string;
  skills?: string[];
  availability_date?: string;
  completed_projects?: number;
}

interface User {
  _id: string;
  name: string;
  avatar?: string;
  is_verified?: boolean;
  createdAt?: string;
  volunteer_profile?: VolunteerProfile;
}

const FindVolunteer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recently-added");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>("");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Fetch available users
  const { data: users, isLoading } = trpc.users.getAvailableUsers.useQuery<User[]>();

  // Filter users based on search query
  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users based on selected option
  const sortedUsers = filteredUsers?.sort((a, b) => {
    switch (sortBy) {
      case "recently-active":
        return new Date(b.volunteer_profile?.availability_date || 0).getTime() - 
               new Date(a.volunteer_profile?.availability_date || 0).getTime();
      case "responsiveness":
        // You might want to implement a different sorting logic here
        return 0;
      default: // recently-added
        return new Date(b.createdAt || 0).getTime() - 
               new Date(a.createdAt || 0).getTime();
    }
  });

  const handleOpenMessageModal = (user: User) => {
    const applicant: Applicant = {
      id: user._id,
      name: user.name,
      profileImg: user.avatar || "/avatar.svg",
      location: user.volunteer_profile?.location || "",
      bio: user.volunteer_profile?.bio || "",
      skills: user.volunteer_profile?.skills || [],
      completedProjects: user.volunteer_profile?.completed_projects || 0,
      availability: user.volunteer_profile?.availability_date || "",
      applicationId: user._id, // Using user ID as application ID since this is a general search
    };
    setSelectedApplicant(applicant);
    setIsMessageModalOpen(true);
  };

  return (
    <div className="w-full bg-white">
      <div className="container max-w-[1240px] max-h-auto mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Search Volunteers</h1>
              <p className="text-[11px] text-gray-500">
                {isLoading ? "Loading..." : `${filteredUsers?.length || 0} volunteers found`}
              </p>
            </div>
            <div className="relative max-w-[333px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input 
                placeholder="Search volunteers" 
                className="pl-10 bg-gray-50 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-8">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recently-added">Recently added</SelectItem>
                <SelectItem value="recently-active">Recently active</SelectItem>
                <SelectItem value="responsiveness">Responsiveness</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : !sortedUsers?.length ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No volunteers found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedUsers.map((user) => {
              const applicant: Applicant = {
                id: user._id,
                name: user.name,
                profileImg: user.avatar || "/avatar.svg",
                location: user.volunteer_profile?.location || "",
                bio: user.volunteer_profile?.bio || "",
                skills: user.volunteer_profile?.skills || [],
                completedProjects: user.volunteer_profile?.completed_projects || 0,
                availability: user.volunteer_profile?.availability_date || "",
                applicationId: user._id, // Using user ID as application ID since this is a general search
              };

              return (
                <ApplicantsCard
                  key={user._id}
                  setIsModalOpen={setIsModalOpen}
                  applicant={applicant}
                  setSelectedApplicantId={setSelectedApplicantId}
                  onMessageClick={() => handleOpenMessageModal(user)}
                />
              );
            })}
          </div>
        )}
      </div>

      <VolunteerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicantId={selectedApplicantId}
      />

      <MessageApplicantModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        applicant={selectedApplicant}
      />
    </div>
  );
};

export default FindVolunteer;

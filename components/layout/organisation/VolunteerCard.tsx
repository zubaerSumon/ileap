import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/ui/UserAvatar";
import { formatText } from "@/utils/helpers/formatText";

interface Volunteer {
  _id: string;
  name: string;
  image?: string;
  role: string;
  area?: string;
  state?: string;
  volunteer_profile?: {
    student_type?: "yes" | "no";
    course?: string;
    availability_date?: {
      start_date?: string;
      end_date?: string;
    };
    interested_on?: string[];
    bio?: string;
    is_available?: boolean;
  };
}

interface VolunteerCardProps {
  volunteer: Volunteer;
  onConnect: (volunteer: Volunteer) => void;
}

export default function VolunteerCard({
  volunteer,
  onConnect,
}: VolunteerCardProps) {
  const router = useRouter();

  return (
    <Card
      className="hover:shadow-lg transition-all  duration-300 rounded-lg overflow-hidden w-full py-0 relative bg-white cursor-pointer"
      onClick={() =>
        router.push(`/find-volunteer/volunteer/details/${volunteer._id}`)
      }
    >
      <CardContent className="p-4 ">
        <div className="flex flex-col min-h-[280px] max-h-[280px]">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-12 h-12">
              <UserAvatar user={volunteer} size={48} className="rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              {volunteer.volunteer_profile?.is_available ? (
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  ✓ Available
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  ⏸️ Unavailable
                </span>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {volunteer.name}
          </h3>

          <div className="flex items-center gap-3 mb-3 text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-gray-600 text-sm">📍</span>
              <span className="text-sm">
                {volunteer.area && volunteer.state 
                  ? `${formatText(volunteer.area)}, ${formatText(volunteer.state)}`
                  : volunteer.state 
                    ? formatText(volunteer.state)
                    : volunteer.area 
                      ? formatText(volunteer.area)
                      : "Location not specified"
                }
              </span>
            </div>
            {/* <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🏆</span>
              <span className="text-sm">10 projects</span>
            </div> */}
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {volunteer.volunteer_profile?.interested_on?.map(
              (interest: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {interest.replace(/_/g, " ")}
                </span>
              )
            )}
          </div>

          {volunteer.volunteer_profile?.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {volunteer.volunteer_profile.bio}
            </p>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex gap-2 mt-auto "
          >
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1 text-sm h-9 border-gray-200 cursor-pointer"
              onClick={() =>
                router.push(
                  `/find-volunteer/volunteer/details/${volunteer._id}`
                )
              }
            >
              View Profile
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 text-[12px] h-9 cursor-pointer"
              onClick={() => onConnect(volunteer)}
            >
              <MessageCircle className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

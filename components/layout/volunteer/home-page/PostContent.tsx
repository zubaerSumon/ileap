import Link from "next/link";
import Image from "next/image";
import { ApplyButton } from "@/components/buttons/ApplyButton";
import { FavoriteButton } from "@/components/buttons/FavoriteButton";
import { useSession } from "next-auth/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BackButton from "@/components/buttons/BackButton";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";
import { MapPin, Users, Calendar, Clock, ExternalLink, Target } from "lucide-react";

type Opportunity = {
  _id: string;
  title: string;
  description: string;
  category: string[];
  required_skills: string[];
  commitment_type: string;
  location: string;
  number_of_volunteers: number;
  date: {
    start_date: Date;
    end_date?: Date;
  };
  time: {
    start_time: string;
    end_time?: string;
  };
  organization_profile: {
    _id: string;
    title: string;
    profile_img?: string;
    contact_email?: string;
    phone_number?: string;
    website?: string;
    area?: string;
    state?: string;
    bio?: string;
  };
  created_by?: {
    _id: string;
    name: string;
  };
  banner_img?: string;
  external_event_link?: string;
};
interface PostContentProps {
  opportunity: Opportunity;
  isMentor?: boolean;
}

export function PostContent({ opportunity, isMentor }: PostContentProps) {
  const { data: session } = useSession();
  const isOrganization = session?.user?.role === "organization";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-disc pl-5 space-y-1.5",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-decimal pl-5 space-y-1.5",
          },
        },
      }),
      Underline,
    ],
    content: opportunity.description,
    editable: false,
  });

  const opportunityDetails = {
    id: opportunity._id,
    title: opportunity.title,
    organization: {
      title: opportunity.organization_profile.title,
      id: opportunity.organization_profile._id,
    },
    location: opportunity.location,
  };

  return (
    <div className="flex-1 w-full lg:max-w-3xl">
      {!isMentor && <BackButton />}

      {!isMentor && (
        <>
          <div className="w-full h-[150px] md:h-[200px] relative mb-4 md:mb-6">
            <Image
              src={opportunity.banner_img || "/fallbackbanner.png"}
              alt={`${opportunity.title} Banner`}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 w-full">
            {opportunity.title}
          </h1>
        </>
      )}

      <div className="text-sm text-gray-600 mb-3 w-full">
        Posted by
        <Link
          href={`/volunteer/organizer/${opportunity.organization_profile._id}`}
        >
          <span className="text-blue-600 hover:underline cursor-pointer">
            {" "}
            {opportunity?.organization_profile?.title || "Organization name"}
          </span>
        </Link>
      </div>

            {/* Opportunity Details */}
      <div className="mb-6 space-y-4">
                {/* Key Details Card */}
        <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-start gap-2 sm:items-center">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-800 break-words">{opportunity.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:items-center">
              <Users className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Available Spots</p>
                <p className="text-sm font-medium text-gray-800">{opportunity.number_of_volunteers} spots</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:items-center">
              <Target className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Commitment</p>
                <p className="text-sm font-medium text-gray-800 break-words">{opportunity.commitment_type}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:items-center">
              <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(opportunity.date.start_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:items-center">
              <Clock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatTimeToAMPM(opportunity.time.start_time)}
                </p>
              </div>
            </div>

            {opportunity.external_event_link && (
              <div className="flex items-start gap-2 sm:items-center">
                <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">External Link</p>
                  <a
                    href={opportunity.external_event_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    View Event
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories and Skills */}
        {(opportunity.category.length > 0 || opportunity.required_skills.length > 0) && (
          <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
            {opportunity.category.length > 0 && (
              <div className="mb-4 md:mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2 md:mb-2">Categories</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {opportunity.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs md:text-sm rounded border border-blue-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {opportunity.required_skills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {opportunity.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs md:text-sm rounded border"
                    >
                      {skill}
                  </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="prose w-full max-w-none text-gray-700 space-y-4">
        <div className="text-sm md:text-base leading-relaxed w-full text-justify">
          <EditorContent editor={editor} />
        </div>

        {!isOrganization && (
          <div className="flex items-center gap-2 w-full">
            <ApplyButton
              opportunityId={opportunity._id}
              opportunityDetails={opportunityDetails}
              className="bg-blue-600 hover:bg-blue-700 h-8 px-4 md:px-5 font-normal text-sm text-white"
            />
            <FavoriteButton opportunityId={opportunity._id} />
          </div>
        )}
      </div>
    </div>
  );
}

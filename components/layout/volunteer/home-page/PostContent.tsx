 
import { ApplyButton } from "@/components/buttons/ApplyButton";
import { FavoriteButton } from "@/components/buttons/FavoriteButton";
import { useSession } from "next-auth/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
 import { formatTimeToAMPM } from "@/utils/helpers/formatTime";
import { MapPin, Users, Calendar, Clock, ExternalLink, Target, Mail, Phone } from "lucide-react";

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
  email_contact?: string;
  phone_contact?: string;
};

interface PostContentProps {
  opportunity: Opportunity;
 }

export function PostContent({ opportunity,   }: PostContentProps) {
  const { data: session } = useSession();
   const isOrganisation = session?.user?.role === "admin";
  const isCreator = session?.user?.id === opportunity.created_by?._id;

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
    <div className="flex-1 w-full lg:max-w-3xl space-y-8">
      

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
            <p className="text-sm font-medium text-gray-900">{opportunity.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(opportunity.date.start_date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTimeToAMPM(opportunity.time.start_time)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Available Spots</p>
            <p className="text-sm font-medium text-gray-900">{opportunity.number_of_volunteers} spots</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Commitment</p>
            <p className="text-sm font-medium text-gray-900">{opportunity.commitment_type}</p>
          </div>
        </div>

        {opportunity.external_event_link && (
          <div className="flex items-center gap-3">
            <ExternalLink className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">External Link</p>
              <a
                href={opportunity.external_event_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                View Event
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {(opportunity.email_contact || opportunity.phone_contact) && (
        <div className="flex flex-col sm:flex-row gap-6">
          {opportunity.email_contact && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <a
                  href={`mailto:${opportunity.email_contact}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {opportunity.email_contact}
                </a>
              </div>
            </div>
          )}

          {opportunity.phone_contact && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <a
                  href={`tel:${opportunity.phone_contact}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {opportunity.phone_contact}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories and Skills */}
      {(opportunity.category.length > 0 || opportunity.required_skills.length > 0) && (
        <div className="space-y-4">
          {opportunity.category.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Categories</p>
              <div className="flex flex-wrap gap-2">
                {opportunity.category.map((cat, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {opportunity.required_skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {opportunity.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
        <EditorContent editor={editor} />
      </div>

      {/* Action Buttons */}
      { !isOrganisation &&   !isCreator && (
        <div className="flex items-center gap-3 pt-4">
          <ApplyButton
            opportunityId={opportunity._id}
            opportunityDetails={opportunityDetails}
            className="bg-blue-600 h-10 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
          />
          <FavoriteButton opportunityId={opportunity._id} />
        </div>
      )}
    </div>
  );
}

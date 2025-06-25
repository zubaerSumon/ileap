import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ApplyButton } from "@/components/buttons/ApplyButton";
import { useSession } from "next-auth/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BackButton from "@/components/buttons/BackButton";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";

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
  };
  created_by?: {
    _id: string;
    name: string;
  };
  banner_img?: string;
};

export function PostContent({ opportunity }: { opportunity: Opportunity }) {
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
      <BackButton />

      <div className="w-full h-[150px] md:h-[200px] relative mb-4 md:mb-6">
        <Image
          src={opportunity.banner_img || "/default-banner.svg"}
          alt={`${opportunity.title} Banner`}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 w-full">{opportunity.title}</h1>

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

      {/* Start Date & Time */}
      <div className="mb-4 p-3 md:p-4 bg-gray-50 rounded-lg w-full">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Start Date & Time</h3>
        <div className="text-sm text-gray-600">
          <p>
            <span className="font-medium">Date:</span>{" "}
            {new Date(opportunity.date.start_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p>
            <span className="font-medium">Time:</span>{" "}
            {formatTimeToAMPM(opportunity.time.start_time)}
          </p>
        </div>
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
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
        )}
      </div>
    </div>
  );
}

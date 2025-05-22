import { Star, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ApplyButton } from "@/components/buttons/ApplyButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

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
    end_time: string;
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
  const router = useRouter();

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
    date: new Date(opportunity.date.start_date).toLocaleDateString("en-GB"),
    time: `${opportunity.time.start_time} - ${opportunity.time.end_time}`,
    location: opportunity.location,
  };

  return (
    <div className="flex-1 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <div className="w-full h-[200px] relative mb-6">
        <Image
          src={opportunity.banner_img || "/default-banner.svg"}
          alt={`${opportunity.title} Banner`}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">{opportunity.title}</h1>

      <div className="text-sm text-gray-600 mb-3">
        Posted by
        <Link
          href={`/volunteer/organizer/${opportunity.organization_profile._id}`}
        >
          <span className="text-blue-600 hover:underline cursor-pointer">
            {" "}
            {opportunity?.created_by?.name || "Organization name"}
          </span>
        </Link>
      </div>

      <div className="prose max-w-none text-gray-700 space-y-4">
        <div className="text-base leading-relaxed">
          <EditorContent editor={editor} />
          
        </div>

        {!isOrganization && (
          <div className="flex items-center gap-2">
            <ApplyButton
              opportunityId={opportunity._id}
              opportunityDetails={opportunityDetails}
              className="bg-blue-600 hover:bg-blue-700 h-8 px-5 font-normal text-sm text-white"
            />
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
        )}
      </div>
    </div>
  );
}

// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import { Edit, Share } from "lucide-react";
import Underline from "@tiptap/extension-underline";
import { IOpportunity } from "@/server/db/interfaces/opportunity";
import { MapPin } from "lucide-react";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";

interface PostContentProps {
  opportunity: IOpportunity;
}

export function PostContent({ opportunity }: PostContentProps) {
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

  return (
    <div className="flex-1 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <p className="text-sm text-gray-500">Posted {new Date(opportunity.createdAt).toLocaleDateString()}</p>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm" className="flex gap-2">
            <Edit className="h-4 w-4" />
            Edit post
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button> */}
        </div>
      </div>
      <Separator />
      
      {/* Start Date & Time */}
      {opportunity.date?.start_date && (
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Start Date & Time</h3>
          <div className="text-sm text-blue-800">
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
              {opportunity.time?.start_time ? formatTimeToAMPM(opportunity.time.start_time) : 'Not set'}
            </p>
          </div>
        </div>
      )}

      {/* Opportunity Location */}
      <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Opportunity Location</h3>
        <div className="text-sm text-gray-800">
          <p className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="break-words">{opportunity.location}</span>
          </p>
        </div>
      </div>
      
      <div>
        <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{opportunity.title}</h2>
        <div className="prose prose-sm sm:prose max-w-none">
          <EditorContent editor={editor} />
        </div>
      </div>

      <Separator />

      {/* Requirements Section */}
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Requirements</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.category.map((cat) => (
                <span
                  key={cat}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Opportunity Details Section */}
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Opportunity Details</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
            <span className="text-gray-600 text-sm">Commitment Type:</span>
            <span className="font-medium text-sm">
              {opportunity.commitment_type === "workbased" ? "Work based" : "Event based"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
            <span className="text-gray-600 text-sm">Volunteers Needed:</span>
            <span className="font-medium text-sm">{opportunity.number_of_volunteers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Edit, Share } from "lucide-react";
import Underline from "@tiptap/extension-underline";
import { IOpportunity } from "@/server/db/interfaces/opportunity";

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
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between ">
        <p className="text-sm text-gray-500">Posted {new Date(opportunity.createdAt).toLocaleDateString()}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex gap-2">
            <Edit className="h-4 w-4" />
            Edit post
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <h2 className="text-lg font-medium mb-4">{opportunity.title}</h2>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

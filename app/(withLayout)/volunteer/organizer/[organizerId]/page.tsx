"use client";

import { useParams } from "next/navigation";
import Organizer from "@/components/layout/volunteer/organizer/Organizer";

export default function OrganizerDetailPage() {
  const params = useParams();
  const organizerId = Array.isArray(params?.organizerId) ? params.organizerId[0] : params?.organizerId;

  if (!organizerId) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-2xl font-bold">Organizer not found</h1>
      </div>
    );
  }

  return (
    <Organizer organizerId={organizerId} />  // Pass organizerId to Organizer component
  );
}
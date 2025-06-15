'use client'
import MessageUI from "@/components/layout/messages/MessageUI";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <ProtectedLayout><div className="py-2"> </div>
      <div className="max-w-[1440px] mx-auto w-full p-6 md:p-6 h-[800px] overflow-hidden border border-gray-200 rounded-lg space-y-4">
        <MessageUI initialUserId={userId} />
      </div>
    </ProtectedLayout>
  );
}

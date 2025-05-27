'use client'
import MessageUI from "@/components/layout/messages/MessageUI";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <ProtectedLayout>
      <div className="max-w-[1440px] mx-auto w-full">
        <MessageUI initialUserId={userId} />
      </div>
    </ProtectedLayout>
  );
}

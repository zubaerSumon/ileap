import MessageUI from "@/components/layout/messaging/MessageUI";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import React from "react";

 
  
export default function page() {
  return (
    <ProtectedLayout>
      <div className="max-w-[1440px] mx-auto w-full">
        <MessageUI />
      </div>
    </ProtectedLayout>
  );
}

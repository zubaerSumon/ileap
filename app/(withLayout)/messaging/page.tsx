import MessageUI from "@/components/layout/messaging/MessageUI";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import React from "react";

const currentUser = {
    name: "Tiago Leitao",
    avatar: "/volunteerportrait.svg",
    location: "Sydney, Australia"
};
  
export default function page() {
  return (
    <ProtectedLayout>
      <div className="max-w-[1440px] mx-auto w-full">
        <MessageUI currentUser={currentUser} />
      </div>
    </ProtectedLayout>
  );
}

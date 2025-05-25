"use client";


import TopNavigationBar from "@/components/navbar/TopNavigationBar";
import UpdatedFooter from "@/components/UpdatedFooter";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavigationBar />
      {children}
     <UpdatedFooter/>
    </>
  );
} 
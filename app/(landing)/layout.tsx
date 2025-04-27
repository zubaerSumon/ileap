"use client";


import TopNavigationBar from "@/components/TopNavigationBar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavigationBar />
      {children}
     
    </>
  );
} 
"use client";

import TopNavigationBar from "@/components/layout/protected/TopNavigationBar";
import "../globals.css";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavigationBar />
      <main className="min-h-screen bg-[#F5F7FA]">{children}</main>
      
    </>
  );
}

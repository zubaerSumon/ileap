"use client";

import TopNavigationBar from "@/components/TopNavigationBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavigationBar />
      <div className="px-4 md:px-0">
        {children}
      </div>
    </>
  );
}
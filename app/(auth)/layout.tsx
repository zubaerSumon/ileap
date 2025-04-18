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
      {children}
    </>
  );
} 
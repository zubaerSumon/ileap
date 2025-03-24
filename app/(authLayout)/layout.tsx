"use client";

import "../globals.css";

import TopNavigationBar from "@/components/layout/auth/TopNavigationBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavigationBar />
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}

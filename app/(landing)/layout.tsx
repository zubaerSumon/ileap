"use client";

import Footer from "@/components/Footer";
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
      <Footer/>
    </>
  );
} 
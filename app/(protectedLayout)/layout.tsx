"use client";

import TopNavigationBar from "@/components/layout/protected/TopNavigationBar";
 import "../globals.css";
import Footer from "@/components/Footer";

 
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavigationBar />
      <main className="min-h-screen bg-background">{children}</main>
      <Footer />
    </>
  );
}

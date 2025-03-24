"use client";

 import "../globals.css";
 import TopNavigationBar from "@/components/layout/unprotected/TopNavigationBar";
import Footer from "@/components/Footer";

 
export default function unprotectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavigationBar />
      <main className="min-h-screen bg-background">{children}</main>
      <Footer />
    </>
  );
}

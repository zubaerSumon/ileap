"use client";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import TopNavigationBar from "@/components/TopNavigationBar";
import UpdatedFooter from "../UpdatedFooter";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, profileCheck } = useAuthCheck();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const hasRole = Boolean(
        profileCheck?.hasVolunteerProfile ||
          profileCheck?.hasOrganizationProfile
      );
      if (hasRole) {
        router.push("/signup");
      } else {
        router.push("/signin");
      }
    }
  }, [isLoading, isAuthenticated, router, profileCheck]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <TopNavigationBar />
      <div className="min-h-screen mx-auto ">{children}</div>
      <UpdatedFooter />
    </Fragment>
  );
}

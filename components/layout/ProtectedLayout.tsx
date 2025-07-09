"use client";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import TopNavigationBar from "@/components/navbar/TopNavigationBar";
import UpdatedFooter from "../UpdatedFooter";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, profileCheck, session } = useAuthCheck();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const hasRole = Boolean(
        profileCheck?.hasVolunteerProfile ||
          profileCheck?.hasOrganizationProfile
      );
      if (hasRole) {
        const role =
          session?.user?.role?.toLowerCase() !== "volunteer"
            ? "organisation"
            : "volunteer";
        router.push(`/signup?role=${role}`);
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router, profileCheck, session]);

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
      <div className="flex flex-col min-h-screen overflow-hidden">
        <TopNavigationBar />
        <main className="flex-1 relative overflow-hidden">{children}</main>
        <UpdatedFooter />
      </div>
    </Fragment>
  );
}

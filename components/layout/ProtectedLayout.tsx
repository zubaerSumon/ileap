"use client";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import TopNavigationBar from "@/components/navbar/TopNavigationBar";
import UpdatedFooter from "../UpdatedFooter";
import Loading from "@/app/loading";

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
      <Loading size="medium">
        <p className="text-gray-600 mt-2">Wait a sec...</p>
      </Loading>
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

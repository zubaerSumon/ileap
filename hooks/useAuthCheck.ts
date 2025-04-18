import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

export function useAuthCheck() {
  const { data: session, status } = useSession();
  const { data: profileCheck, isLoading: isProfileLoading } = trpc.users.profileCheckup.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
     if (status === "loading" || (status === "authenticated" && isProfileLoading)) {
      setIsLoading(true);
      return;
    }

     const isSessionAuthenticated = status === "authenticated" && !!session?.user;
    const hasValidProfile = Boolean(profileCheck?.hasVolunteerProfile || profileCheck?.hasOrganizationProfile);

    setHasProfile(hasValidProfile);
    setIsAuthenticated(isSessionAuthenticated && hasValidProfile);
    setIsLoading(false);
  }, [status, session, profileCheck, isProfileLoading]);

  return {
    isLoading,
    isAuthenticated,
    hasProfile,
    session,
    profileCheck,
  };
} 
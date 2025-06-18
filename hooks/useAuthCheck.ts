import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { useEffect, useState, useMemo } from "react";

export function useAuthCheck() {
  const { data: session, status } = useSession();
  const { data: profileCheck, isLoading: isProfileLoading } = trpc.users.profileCheckup.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Memoize the authentication state to prevent unnecessary re-renders
  const authState = useMemo(() => {
    if (status === "loading" || (status === "authenticated" && isProfileLoading)) {
      return { isLoading: true, isAuthenticated: false, hasProfile: false };
    }

    const isSessionAuthenticated = status === "authenticated" && !!session?.user;
    const hasValidProfile = Boolean(profileCheck?.hasVolunteerProfile || profileCheck?.hasOrganizationProfile);

    return {
      isLoading: false,
      isAuthenticated: isSessionAuthenticated && hasValidProfile,
      hasProfile: hasValidProfile,
    };
  }, [status, session, profileCheck, isProfileLoading]);

  useEffect(() => {
    setIsLoading(authState.isLoading);
    setIsAuthenticated(authState.isAuthenticated);
    setHasProfile(authState.hasProfile);
  }, [authState]);

  return {
    isLoading,
    isAuthenticated,
    hasProfile,
    session,
    profileCheck,
  };
} 
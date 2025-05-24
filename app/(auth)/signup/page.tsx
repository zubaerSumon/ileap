"use client";
import { useSearchParams } from "next/navigation";
import VolunteerSignup from "@/components/layout/auth/VolunteerSignup";
import OrganizationSignup from "@/components/layout/auth/OrganizationSignup";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const paramRole = searchParams?.get("role")?.toLowerCase();

  // If role is explicitly set to "organization", show organization signup
  // Otherwise, show volunteer signup
  return paramRole === "organization" ? (
    <OrganizationSignup />
  ) : (
    <VolunteerSignup />
  );
}

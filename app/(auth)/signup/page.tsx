"use client";
import { useSearchParams } from "next/navigation";
import VolunteerSignup from "@/components/layout/auth/VolunteerSignup";
import OrganizationSignup from "@/components/layout/auth/OrganizationSignup";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const paramRole = searchParams?.get("role");

  return paramRole !== "organization" ? (
    <VolunteerSignup />
  ) : (
    <OrganizationSignup />
  );
}

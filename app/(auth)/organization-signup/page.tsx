"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { SignupStep } from "@/components/layout/auth/SignupStep";
import { OrganizationBasicProfileStep } from "@/components/layout/auth/OrganizationBasicProfileStep";
import { OrganizationDetailedProfileStep } from "@/components/layout/auth/OrganizationDetailedProfileStep";
import { OrganizationSignupForm, organizationSignupSchema } from "@/types/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import toast from "react-hot-toast";

export default function OrganizationSignup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session } = useSession();
  const { isLoading, isAuthenticated } = useAuthCheck();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [mediaConsent, setMediaConsent] = useState(false);
  const [mediaConsentError, setMediaConsentError] = useState<string | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSetupComplete, setIsProfileSetupComplete] = useState(false);
  
  const setupOrganizationProfile = trpc.users.setupOrganizationProfile.useMutation({
    onSuccess: () => {
      utils.users.profileCheckup.invalidate();
      toast.success("Organization profile setup completed successfully!");
      setIsProfileSetupComplete(true);
      const role = session?.user?.role;
      if (!isLoading && role && isAuthenticated) {
        router.push(`/${role}`);
      }
    },
    onError: (error) => {
      setError(error.message || "Failed to setup organization profile");
    },
  });

  const form = useForm<OrganizationSignupForm>({
    resolver: zodResolver(organizationSignupSchema),
    mode: "onChange",
    defaultValues: {
      organization_type: "nonprofit",
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof OrganizationSignupForm> = [];

    if (step === 1) {
      if (!termsAccepted) {
        setTermsError("You must accept the terms and conditions");
        return;
      }
      // Check for password mismatch
      const password = form.getValues("password");
      const confirmPassword = form.getValues("confirm_password");
      if (password !== confirmPassword) {
        setError("Please confirm your password");
        return;
      }
      fieldsToValidate = ["name", "email", "password", "confirm_password"];
    } else if (step === 2) {
      fieldsToValidate = [
        "organization_name",
        "organization_website",
        "organization_type",
        "phone_number",
        "country",
        "area",
        "postcode",
      ];
    } else if (step === 3) {
      fieldsToValidate = [
        "mission_statement",
        "services_provided",
        "target_audience",
        "referral_source",
      ];
      
      if (form.watch("referral_source") === "other") {
        fieldsToValidate.push("referral_source_other");
      }
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (step === 1) {
        await onSubmit(form.getValues());
      } else if (step === 2) {
        // Just move to step 3, don't complete profile yet
        setStep(3);
      } else if (step === 3) {
        // Check media consent in the last step
        if (!mediaConsent) {
          setMediaConsentError(
            "You must grant media consent to complete your profile"
          );
          return;
        }
        // Handle profile setup
        try {
          setIsProfileLoading(true);
          const formData = form.getValues();
          await setupOrganizationProfile.mutateAsync({
            organization_name: formData.organization_name,
            organization_website: formData.organization_website,
            organization_type: formData.organization_type,
            phone_number: formData.phone_number,
            country: formData.country,
            area: formData.area,
            postcode: formData.postcode,
            mission_statement: formData.mission_statement,
            services_provided: formData.services_provided,
            target_audience: formData.target_audience,
            referral_source: formData.referral_source,
            referral_source_other: formData.referral_source_other,
          });
        } catch (err) {
          console.error("Profile setup error:", err);
        } finally {
          setIsProfileLoading(false);
        }
      }
      
      // Only increment step for steps 1 and 2, not for step 3 (handled by redirect after profile setup)
      if (step < 3) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  useEffect(() => {
    if (!isLoading) {
      // Case 1: User has a role and is fully authenticated - go to role page
      if (isAuthenticated && session?.user?.role) {
        router.replace(`/${session.user.role.toLowerCase()}`);
      } 
      // Case 2: User has started but not completed profile - show step 2
      else if (session?.user && !isAuthenticated) {
        setStep(2);
        setIsLoggedIn(true);
      }
    }
  }, [isLoading, isAuthenticated, session, router]);

  const onSubmit = async (data: OrganizationSignupForm) => {
    if (form.formState.isSubmitting) return;
    try {
      setError(null);
      setIsSignupLoading(true);

      const referral = searchParams?.get("referral");
        
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        name: data.name,
        redirect: false,
        action: "signup",
        role: "organization", // Set role to organization
        referred_by: referral || undefined,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // Update login state and store user name
      setIsLoggedIn(true);
      setStep(2); // Move to next step after successful signup
    } catch (err: unknown) {
      console.error("Error during signup:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during signup"
      );
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 pb-24">
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg mx-auto max-w-xl">
          {error}
        </div>
      )}

      {isLoggedIn && !isAuthenticated && !isProfileSetupComplete && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg mx-auto max-w-xl">
          Account created successfully! Let&apos;s complete your organization profile.
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <form className="space-y-6">
          {step === 1 && (
            <SignupStep
              form={form}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              termsError={termsError}
              setTermsError={setTermsError}
            />
          )}
          {step === 2 && <OrganizationBasicProfileStep form={form} />}
          {step === 3 && (
            <OrganizationDetailedProfileStep
              form={form}
              mediaConsent={mediaConsent}
              setMediaConsent={setMediaConsent}
              mediaConsentError={mediaConsentError}
              setMediaConsentError={setMediaConsentError}
            />
          )}

          <div className="fixed bottom-0 left-0 right-0 bg-gray-50 py-4 px-6 border-t border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex justify-between">
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSignupLoading || isProfileLoading}
                    >
                      Back
                    </Button>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSignupLoading || isProfileLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSignupLoading || isProfileLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {step === 1 ? "Creating account..." : "Saving profile..."}
                    </div>
                  ) : step === 1 ? (
                    "Signup & Continue"
                  ) : step === 3 ? (
                    "Complete"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { OrgSignupFormData, orgSignupSchema } from "@/types/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import toast from "react-hot-toast";
import { UserRole } from "@/server/db/interfaces/user";
import { OrgProfileStep } from "./OrgProfileStep";
import { OrgSignupStep } from "./OrgSignupStep";
import { Loader2 } from "lucide-react";

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
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSetupComplete, setIsProfileSetupComplete] = useState(false);

  const setupOrgProfile = trpc.users.setupOrgProfile.useMutation({
    onSuccess: () => {
      utils.users.profileCheckup.invalidate();
      toast.success("Profile setup completed successfully!");
      setIsProfileSetupComplete(true);
      const role = session?.user?.role;
      if (!isLoading && role && isAuthenticated) {
        router.push(`/${role}`);
      }
    },
    onError: (error) => {
      setError(error.message || "Failed to setup profile");
    },
  });

  const form = useForm<OrgSignupFormData>({
    resolver: zodResolver(orgSignupSchema),
    mode: "onChange",
  });

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof OrgSignupFormData> = [];

    if (step === 1) {
      if (!termsAccepted) {
        setTermsError("You must accept the terms and conditions");
        return;
      }
      const password = form.getValues("password");
      const confirmPassword = form.getValues("confirm_password");
      if (password !== confirmPassword) {
        setError("Please confirm your password");
        return;
      }
      fieldsToValidate = ["name", "email", "password", "confirm_password"];
    } else if (step === 2) {
      fieldsToValidate = [
        "bio",
        "opportunity_types",
        "phone_number",
        "state",
        "area",
        "abn",
      ];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (step === 1) {
        await onSubmit(form.getValues());
      } else if (step === 2) {
        try {
          setIsProfileLoading(true);
          const formData = form.getValues();
          console.log("__formData__", { formData });

          await setupOrgProfile.mutateAsync({
            bio: formData.bio,
            opportunity_types: formData.opportunity_types,
            phone_number: formData.phone_number,
            state: formData.state,
            area: formData.area,
            abn: formData.abn,
            type: formData.type,
            website: formData.website,
            required_skills: formData.required_skills,
          });
        } catch (err) {
          console.error("Profile setup error:", err);
        } finally {
          setIsProfileLoading(false);
        }
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && session?.user?.role) {
        router.replace(`/${session.user.role.toLowerCase()}`);
      } else if (session?.user && !isAuthenticated) {
        setStep(2);
        setIsLoggedIn(true);
      }
    }
  }, [isLoading, isAuthenticated, session, router]);

  const onSubmit = async (data: OrgSignupFormData) => {
    if (form.formState.isSubmitting) return;
    console.log("__data__", { data });

    try {
      setError(null);
      setIsSignupLoading(true);
      const referral = searchParams?.get("referral");
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        name: data.name,
        role: UserRole.ORGANIZATION,
        referred_by: referral || undefined,
        action: "signup",
        redirect: false,
      });

      if (signInResult?.error) {
        if (signInResult.error) {
          toast.error(
            "Account with this email already exists. Please provide the correct password."
          );
        }
        setIsSignupLoading(false);
        return;
      }

      setIsLoggedIn(true);
      setStep(2);
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
          Account created successfully! Let&apos;s complete your profile.
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <form className="space-y-6">
          {step === 1 && (
            <OrgSignupStep
              form={form}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              termsError={termsError}
              setTermsError={setTermsError}
            />
          )}
          {step === 2 && <OrgProfileStep form={form} />}

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
                      className="cursor-pointer"
                    >
                      Back
                    </Button>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSignupLoading || isProfileLoading}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  {isSignupLoading || isProfileLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {step === 1 ? "Creating account..." : "Saving profile..."}
                    </div>
                  ) : step === 1 ? (
                    "Signup & Continue"
                  ) : (
                    "Complete"
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

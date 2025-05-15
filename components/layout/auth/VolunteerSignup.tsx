"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { SignupStep } from "@/components/layout/auth/SignupStep";
import { DetailedProfileStep } from "@/components/layout/auth/DetailedProfileStep";
import { VolunteerSignupForm, volunteerSignupSchema } from "@/types/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import toast from "react-hot-toast";
import { BasicProfileStep } from "./BasicProfileStep";
import { Form } from "@/components/ui/form";
import { UserRole } from "@/server/db/interfaces/user";
import { Loader2 } from "lucide-react";

export default function VolunteerSignup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session } = useSession();
  const { isLoading, isAuthenticated } = useAuthCheck();
  console.log({isLoading, isAuthenticated});
  
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

  const updateUser = trpc.users.updateUser.useMutation();
  const setupVolunteerProfile = trpc.users.setupVolunteerProfile.useMutation({
    onSuccess: async (data) => {
      try {
        await updateUser.mutate({
          volunteer_profile: data._id
        });
        
        utils.users.profileCheckup.invalidate();
        toast.success("Profile setup completed successfully!");
        setIsProfileSetupComplete(true);
        
        // Force a session update to ensure we have the latest role
        await utils.users.profileCheckup.invalidate();
        
        // Redirect after a short delay to ensure session is updated
        setTimeout(() => {
          const role = session?.user?.role?.toLowerCase();
          if (role) {
            router.replace(`/${role}`);
          }
        }, 1000);
      } catch (error) {
        console.error("Error updating user with profile:", error);
        toast.error("Failed to complete profile setup");
      }
    },
    onError: (error) => {
      setError(error.message || "Failed to setup profile");
    },
  });

  const form = useForm<VolunteerSignupForm>({
    resolver: zodResolver(volunteerSignupSchema),
    mode: "onChange",
  });

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof VolunteerSignupForm> = [];

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
        "interested_on",
        "phone_number",
        "state",
        "area",
        "postcode",
      ];
    } else if (step === 3) {
      fieldsToValidate = ["student_type", "course", "major", "referral_source"];
      if (form.watch("student_type") === "yes") {
        fieldsToValidate.push("home_country");
      }
      if (form.watch("referral_source") === "other") {
        fieldsToValidate.push("referral_source_other");
      }
      if (form.watch("major_other") === "other") {
        fieldsToValidate.push("major_other");
      }
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (step === 1) {
        await onSubmit(form.getValues());
      } else if (step === 2) {
        setStep(step + 1);
      } else if (step === 3) {
        if (!mediaConsent) {
          setMediaConsentError(
            "You must grant media consent to complete your profile"
          );
          return;
        }
        try {
          setIsProfileLoading(true);
          const formData = form.getValues();
          await setupVolunteerProfile.mutate({
            bio: formData.bio,
            interested_on: formData.interested_on,
            phone_number: formData.phone_number,
            state: formData.state,
            area: formData.area,
            postcode: formData.postcode,
            student_type: formData.student_type,
            home_country: formData.home_country,
            course: formData.course,
            major: formData.major,
            major_other: formData.major_other,
            referral_source: formData.referral_source,
            referral_source_other: formData.referral_source_other,
          });
        } catch (err) {
          console.error("Profile setup error:", err);
        } finally {
          setIsProfileLoading(false);
        }
      }
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  useEffect(() => {
    const handleRedirection = async () => {
      if (!isLoading) {
        if (isAuthenticated && session?.user?.role) {
          const role = session.user.role.toLowerCase();
          await router.replace(`/${role}`);
        } else if (session?.user && !isAuthenticated) {
          setStep(2);
          setIsLoggedIn(true);
        }
      }
    };

    handleRedirection();
  }, [isLoading, isAuthenticated, session, router]);

  const onSubmit = async (data: VolunteerSignupForm) => {
    if (form.formState.isSubmitting) return;
    try {
      setError(null);
      setIsSignupLoading(true);

      const referral = searchParams?.get("referral");

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        name: data.name,
        role: UserRole.VOLUNTEER,
        redirect: false,
        action: "signup",
        referred_by: referral || undefined,
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
        <Form {...form}>
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
            {step === 2 && <BasicProfileStep form={form} />}
            {step === 3 && (
              <DetailedProfileStep
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
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {step === 1 ? "Creating account..." : "Saving profile..."}
                      </div>
                    ) : step === 1 ? (
                      "Signup & Continue"
                    ) : step === 2 ? (
                      "Continue"
                    ) : (
                      "Complete"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

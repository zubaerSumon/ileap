"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { SignupStep } from "@/components/layout/auth/SignupStep";
import { BasicProfileStep } from "@/components/layout/auth/BasicProfileStep";
import { DetailedProfileStep } from "@/components/layout/auth/DetailedProfileStep";
import { VolunteerSignupForm, volunteerSignupSchema } from "@/types/auth";

export default function VolunteerSignup() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<VolunteerSignupForm | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const form = useForm<VolunteerSignupForm>({
    resolver: zodResolver(volunteerSignupSchema),
    mode: "onChange",
    defaultValues: {
      student_type: "no",
      media_consent: false,
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof VolunteerSignupForm> = [];

    if (step === 1) {
      if (!termsAccepted) {
        setTermsError("You must accept the terms and conditions");
        return;
      }
      fieldsToValidate = ["name", "email", "password", "confirm_password"];
    } else if (step === 2) {
      fieldsToValidate = ["bio", "volunteer_type", "phone_number", "country", "street_address", "postcode"];
    } else if (step === 3) {
      fieldsToValidate = ["student_type", "course", "major", "referral_source"];
      if (form.watch("student_type") === "yes") {
        fieldsToValidate.push("home_country");
      }
      if (form.watch("referral_source") === "other") {
        fieldsToValidate.push("referral_source_other");
      }
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (step === 3) {
        form.handleSubmit(onSubmit)();
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  useEffect(() => {
    if (session) {
      setStep(2);
      setIsLoggedIn(true);
      setUserData({
        name: session.user?.name || "",
        email: session.user?.email || "",
        password: "",
        confirm_password: "",
        bio: "",
        volunteer_type: [],
        phone_number: "",
        country: "",
        street_address: "",
        postcode: "",
        student_type: "no",
        home_country: "",
        course: "",
        major: "",
        referral_source: "",
        referral_source_other: "",
        media_consent: false,
      });
    }
  }, [session]);

  const onSubmit = async (data: VolunteerSignupForm) => {
    if (form.formState.isSubmitting) return;
    try {
      setError(null);
      setIsSignupLoading(true);
      
      // First create the user account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      // Then sign in the user
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // Update user data and login state
      setUserData(data);
      setIsLoggedIn(true);
      setStep(2); // Move to next step after successful signup
    } catch (err: unknown) {
      console.error("Error during signup:", err);
      setError(err instanceof Error ? err.message : "An error occurred during signup");
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

      {isLoggedIn && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg mx-auto max-w-xl">
          Account created successfully! You are now logged in as{" "}
          {userData?.name}.
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
          {step === 2 && <BasicProfileStep form={form} />}
          {step === 3 && <DetailedProfileStep form={form} />}

          <div className="fixed bottom-0 left-0 right-0 bg-gray-50 py-4 px-6 border-t border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex justify-between">
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={form.formState.isSubmitting || isSignupLoading}
                >
                  {step === 3 ? "Complete" : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

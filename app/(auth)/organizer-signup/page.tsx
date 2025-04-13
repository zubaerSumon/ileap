"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

import { Step1Form } from "../../../components/layout/auth/Step1Form";
import { Step2Form } from "../../../components/layout/auth/Step2Form";
import { OrganizerStep3Form } from "./components/OrganizerStep3Form";
import { organizerSignupSchema, OrganizerSignupForm } from "./types";

export default function OrganizerSignupPage() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizerSignupForm>({
    resolver: zodResolver(organizerSignupSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizerSignup = trpc.auth.organizerSignup.useMutation({
    onSuccess: () => {
      window.location.href = "/auth/signin?registered=true";
    },
    onError: (error) => {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration");
    },
  });

  const onSubmit = async (data: OrganizerSignupForm) => {
    console.log("data_",data);
    
    try {
      setIsSubmitting(true);
      setError(null);
      await organizerSignup.mutateAsync(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 pb-24">
      {step === 1 && (
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 pb-2">
            Let&apos;s create your organization account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our platform to start organizing impactful volunteer events
          </p>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <div className="bg-white py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <Step1Form register={register as never} errors={errors} />
            )}
            {step === 2 && <Step2Form register={register as never} errors={errors} />}
            {step === 3 && (
              <OrganizerStep3Form register={register} errors={errors} />
            )}
          </form>
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F5F7FA] py-4 px-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between">
            <div className="w-24">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </Button>
              )}
            </div>
            <Button
              type="button"
              onClick={() =>
                step < 3 ? setStep(step + 1) : handleSubmit(onSubmit)()
              }
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              {step === 3
                ? isSubmitting
                  ? "Creating Account..."
                  : "Create Account"
                : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

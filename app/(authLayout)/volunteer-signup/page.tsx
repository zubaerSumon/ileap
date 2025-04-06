"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { Step1Form } from "./components/Step1Form";
import { Step2Form } from "./components/Step2Form";
import { Step3Form } from "./components/Step3Form";
import { volunteerSignupSchema, VolunteerSignupForm } from './types';

export default function VolunteerSignup() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VolunteerSignupForm>({
    resolver: zodResolver(volunteerSignupSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: VolunteerSignupForm) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          role: "volunteer",
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Registration failed");
      }

      // Show success message and redirect
      window.location.href = "/auth/signin?registered=true";
    } catch (error: Error | unknown) {
      console.error("Registration error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 pb-24">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {step === 1 && (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 pb-2">
              Let&apos;s create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Signing up for Square is fast and free. No commitments or long-term
              contracts required.
            </p>
          </>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        {" "}
        {/* Changed from max-w-md to max-w-xl */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <div className="bg-white py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && <Step1Form register={register} errors={errors} />}
            {step === 2 && <Step2Form register={register} />}
            {step === 3 && <Step3Form register={register} />}
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

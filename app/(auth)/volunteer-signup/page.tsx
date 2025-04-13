"use client";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
 
import { Step1Form } from "../../../components/layout/auth/Step1Form";
import { Step2Form } from "../../../components/layout/auth/Step2Form";
import { Step3Form } from "../../../components/layout/auth/Step3Form";
import { volunteerSignupSchema, VolunteerSignupForm } from "./types";
//import { useRouter } from "next/navigation";
//import { trpc } from "@/config/client";
 
export default function VolunteerSignup() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  //const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<VolunteerSignupForm>({
    resolver: zodResolver(volunteerSignupSchema),
    mode: "onChange",
  });
  const values = watch();

  console.log("Form values:", values);
  const hasErrors = Object.keys(errors);
  console.log("Form has errors:", hasErrors);

  /* const volunteerSignupMutation = trpc.auth.volunteerSignup.useMutation({
    onSuccess: () => {
      router.push("/volunteer");
    },
    onError: (error) => {
      console.error("Registration error details:", error);
      setError(error.message || "An error occurred during registration");
    },
  }); */

  const onSubmit = async (data: VolunteerSignupForm) => {
    // console.log("Form data:", data || "clicked");
if(isSubmitting)  return
    try {
      setError(null);
      console.log("Form data:", data);  
      //volunteerSignupMutation.mutate(data);
    } catch (err) {
      console.log("__Error__", err);
      setError("An error occurred during registration");
    }
  };

  const handleNext = async () => {
    // Validate the current step before proceeding
    const fieldsToValidate =
      step === 1
        ? ["email", "password", "name", "terms"]
        : step === 2
        ? ["age", "phoneNumber", "country", "streetAddress"]
        : [];

    const isValid = await trigger(
      fieldsToValidate as (keyof VolunteerSignupForm)[]
    );

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 pb-24">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        {step === 1 && (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 pb-2">
              Let&apos;s create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Signing up for Square is fast and free. No commitments or
              long-term contracts required.
            </p>
          </>
        )}
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full ${step === 3 ? 'sm:max-w-2.5xl' : 'sm:max-w-xl'}`}>
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && <Step1Form register={register} errors={errors} />}
            {step === 2 && <Step2Form register={register} errors={errors} />}
            {step === 3 && <Step3Form register={register} errors={errors} />}

            {/* Form navigation buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#F5F7FA] py-4 px-6 border-t border-gray-200">
              <div className="container mx-auto px-4">
                <div className="flex justify-between">
                  <div className="w-24">
                    {step > 1 && (
                      <Button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Back
                      </Button>
                    )}
                  </div>

                  {step < 3 ? (
                    <div
                      onClick={handleNext}
                      className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Continue
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      //disabled={isSubmitting }
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

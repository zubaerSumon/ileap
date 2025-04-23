import { FormField } from "@/components/forms/FormField";
import { PasswordField } from "@/components/forms/PasswordField";
import { UseFormReturn } from "react-hook-form";
import { VolunteerSignupForm } from "@/types/auth";

interface SignupStepProps {
  form: UseFormReturn<VolunteerSignupForm>;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  termsError: string | null;
  setTermsError: (value: string | null) => void;
}

export function SignupStep({
  form,
  termsAccepted,
  setTermsAccepted,
  termsError,
  setTermsError,
}: SignupStepProps) {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 pb-2">
          Let&apos;s create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Signing up is fast and free. No commitments or long-term contracts
          required.
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          label="Volunteer Name"
          id="name"
          placeholder="Enter your name"
          register={form.register}
          registerName="name"
          // Displays error from schema if name is required and empty
          // This receives the error message from the schema via react-hook-form
          error={form.formState.errors.name?.message}
          />
          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            register={form.register}
            registerName="email"
            // Displays error from schema if email is required and empty/invalid
            error={form.formState.errors.email?.message}
            />
            <PasswordField
              label="Password"
              id="password"
              placeholder="Enter your password"
              register={form.register}
              registerName="password"
              // Displays error from schema if password is required and empty
              error={form.formState.errors.password?.message}
              onFieldChange={() => {
                form.trigger("password");
                form.trigger("confirm_password");
              }}
            />
            <div className="space-y-2">
              <PasswordField
                label="Confirm Password"
                id="confirm_password"
                placeholder="Re-enter your password"
                register={form.register}
                registerName="confirm_password"
                // Displays error from schema if confirm_password is required and empty
                error={form.formState.errors.confirm_password?.message}
                onFieldChange={() => {
                  form.trigger("confirm_password");
                }}
              />
              {/* Displays inline password mismatch error */}
              {form.getValues("password") &&
               form.getValues("confirm_password") &&
               form.getValues("password") !== form.getValues("confirm_password") && (
                <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (!e.target.checked) {
                    setTermsError("You must accept the terms and conditions");
                  } else {
                    setTermsError(null);
                  }
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {/* Displays error message specifically for terms checkbox */}
            {termsError && <p className="text-sm text-red-600">{termsError}</p>}
          </div>
        </>
      );
    }
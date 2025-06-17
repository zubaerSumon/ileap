"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { OrgSignupFormData, orgSignupSchema } from "@/types/auth";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import toast from "react-hot-toast";
import { OrgProfileStep } from "./OrgProfileStep";
import { OrgSignupStep } from "./OrgSignupStep";
import { OrgDetailsStep } from "./OrgDetailsStep";
import { Loader2 } from "lucide-react";
import { organizationTypes } from "@/utils/constants/select-options";
import { UserRole } from "@/server/db/interfaces/user";
 
export default function OrganizationSignup() {
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

  const updateUser = trpc.users.updateUser.useMutation();
  const setupOrgProfile = trpc.users.setupOrgProfile.useMutation({
    onSuccess: async (data) => {
      try {
        await updateUser.mutate({
          organization_profile: data._id
        });
        
        utils.users.profileCheckup.invalidate();
        toast.success("Profile setup completed successfully!");
        setIsProfileSetupComplete(true);
        
        // Wait for profile check to update
        await utils.users.profileCheckup.invalidate();
        
        // Redirect to organization dashboard
        const role = session?.user?.role?.toLowerCase();
        if (role) {
          router.replace(role === "admin" || role === "mentor" ? "/organization/dashboard" : `/${role}`);        }
      } catch (error) {
        console.error("Error updating user with profile:", error);
        toast.error("Failed to complete profile setup");
      }
    },
    onError: (error) => {
      setError(error.message || "Failed to setup profile");
    },
  });

  const form = useForm<OrgSignupFormData>({
    resolver: zodResolver(orgSignupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      title: "",
      contact_email: "",
      bio: "",
      phone_number: "",
      state: "",
      area: "",
      abn: "",
      type: "",
      opportunity_types: [],
      required_skills: [],
      website: "",
      profile_img: "",
      cover_img: "",
    }
  });

  // Add debug logging for form state
  useEffect(() => {
    console.log("Form state:", {
      values: form.getValues(),
      errors: form.formState.errors,
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty
    });
  }, [form.formState]);

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
        "title",
        "contact_email",
        "bio",
        "phone_number",
        "state",
        "area",
        "abn",
      ];
    } else if (step === 3) {
      // Add debug logging for type field
      console.log("Type field before validation:", {
        value: form.getValues("type"),
        isValid: organizationTypes.some((opt: { value: string }) => opt.value === form.getValues("type")),
        errors: form.formState.errors.type
      });

      fieldsToValidate = [
        "type",
        "opportunity_types",
        "required_skills",
        "website",
        "profile_img",
        "cover_img"
      ];
    }

    const isValid = await form.trigger(fieldsToValidate);
    console.log("Form validation result:", {
      isValid,
      errors: form.formState.errors,
      values: form.getValues()
    });

    if (isValid) {
      if (step === 1) {
        await onSubmit(form.getValues());
      } else if (step === 2) {
        setStep(step + 1);
      } else if (step === 3) {
        try {
          setIsProfileLoading(true);
          const formData = form.getValues();
          console.log("Submitting form data:", formData);

          await setupOrgProfile.mutate({
            title: formData.title,
            contact_email: formData.contact_email,
            bio: formData.bio,
            opportunity_types: formData.opportunity_types,
            phone_number: formData.phone_number,
            state: formData.state,
            area: formData.area,
            abn: formData.abn,
            type: formData.type,
            website: formData.website,
            required_skills: formData.required_skills,
            profile_img: formData.profile_img,
            cover_img: formData.cover_img,
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
    if (!isLoading) {
      if (isAuthenticated && session?.user?.role) {
         router.replace(session.user.role === "admin" || session.user.role === "mentor" ? "/organization/dashboard" : `/${session.user.role}`);
      } else if (session?.user && !isAuthenticated) {
        setStep(2);
        setIsLoggedIn(true);
      }
    }
  }, [isLoading, isAuthenticated, session, router]);

  const onSubmit = async (data: OrgSignupFormData) => {
    if (form.formState.isSubmitting) return;

    try {
      setIsSignupLoading(true);
      const response = await signIn("credentials", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: UserRole.ADMIN, // Set role to admin for organizations
        action: "signup",
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
        return;
      }

      setIsLoggedIn(true);
      setStep(2);
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
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
          {step === 3 && <OrgDetailsStep form={form} />}

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
                ) : step === 2 ? (
                  "Continue"
                ) : (
                  "Complete"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
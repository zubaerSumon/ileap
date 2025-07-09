"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/form-input/PasswordField";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/form-input/FormField";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { ResetPasswordFormData, ResetPasswordSchema } from "@/utils/constants";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const resetPasswordMutation = trpc.users.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password reset successfully!");
      router.push("/login?reset=success");
    },
    onError: (error) => {
      setFormError(error.message || "Failed to reset password");
      toast.error(error.message || "Failed to reset password");
    },
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  React.useEffect(() => {
    if (formError) setFormError(null);
  }, [email, password, confirmPassword, formError]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setFormError(null);

      if (data.password !== data.confirmPassword) {
        setFormError("Passwords don't match");
        return;
      }

      await resetPasswordMutation.mutateAsync({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
    } catch (error) {
      console.log("__reset_password_error__", { error });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email and new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                label="Email"
                id="email"
                type="email"
                placeholder="Enter your email"
                register={form.register}
                registerName="email"
                error={errors.email?.message}
              />

              <PasswordField
                label="New Password"
                id="password"
                register={form.register}
                registerName="password"
                error={errors.password?.message}
                placeholder="Enter your new password"
              />

              <PasswordField
                label="Confirm Password"
                id="confirmPassword"
                register={form.register}
                registerName="confirmPassword"
                error={errors.confirmPassword?.message}
                placeholder="Confirm your new password"
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 h-10"
                disabled={
                  isSubmitting ||
                  resetPasswordMutation.isPending ||
                  Object.keys(errors).length > 0 ||
                  !email ||
                  !password ||
                  !confirmPassword
                }
              >
                {(isSubmitting || resetPasswordMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isSubmitting || resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;

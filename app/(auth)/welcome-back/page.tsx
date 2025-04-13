'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";

const welcomeBackSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type WelcomeBackForm = z.infer<typeof welcomeBackSchema>;

export default function WelcomeBackPage() {
  const [showPassword, setShowPassword] = useState(false);


  const { register, handleSubmit, formState: { errors } } = useForm<WelcomeBackForm>({
    resolver: zodResolver(welcomeBackSchema),
  });

  const onSubmit = async (data: WelcomeBackForm) => {
    // Handle password submission here
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold text-start mb-2">Welcome back!</h2>
        
        <p className="text-sm text-gray-600 mb-8">example@email.com <Link href="/login" className="text-blue-600 hover:text-blue-700">Change</Link></p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-start">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
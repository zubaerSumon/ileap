'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Update the schema and types
const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  country: z.string().min(1, "Country is required"),
  role: z.enum(['volunteer', 'organization']),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
  receiveUpdates: z.boolean().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'volunteer' | 'organization' | null>(null);
  
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      sessionStorage.setItem('signupData', JSON.stringify({ ...data, role: selectedRole }));
      window.location.href = selectedRole === 'volunteer' ? '/volunteer-signup' : '/organization-signup';
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: 'client' | 'freelancer') => {
    setSelectedRole(role);
  };

  // Update the role selection section
  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-8">Join as a volunteer or organization</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer ${selectedRole === 'volunteer' ? 'border-green-600' : 'border-gray-200'}`}
              onClick={() => handleRoleSelect('volunteer')}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className={`w-5 h-5 rounded-full border ${selectedRole === 'volunteer' ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                    {selectedRole === 'volunteer' && (
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium">I'm a volunteer</p>
                  <p className="text-sm text-gray-600">looking to help</p>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer ${selectedRole === 'organization' ? 'border-green-600' : 'border-gray-200'}`}
              onClick={() => handleRoleSelect('organization')}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className={`w-5 h-5 rounded-full border ${selectedRole === 'organization' ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                    {selectedRole === 'organization' && (
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium">I'm an organization</p>
                  <p className="text-sm text-gray-600">looking to post opportunities</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => selectedRole && setStep(2)}
            className={`w-full py-3 rounded-lg font-medium ${
              selectedRole ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!selectedRole}
          >
            {selectedRole === 'volunteer' ? 'Apply as Volunteer' : selectedRole === 'organization' ? 'Join as Organization' : 'Create Account'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account? <Link href="/signin" className="text-green-600 hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    );
  }

  // Simplified Step 2
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">
          Sign up to {selectedRole === 'volunteer' ? 'volunteer' : 'post opportunities'}
        </h2>
        
        <button className="w-full flex items-center justify-center gap-2 border rounded-lg p-3 hover:bg-gray-100 transition-colors mb-6">
          <Image src="/google.svg" alt="Google" width={24} height={24} />
          Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              {...register("firstName")}
              placeholder="Full name"
              className="w-full border rounded-lg p-3"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="Email address"
              className="w-full border rounded-lg p-3"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Password (8 or more characters)"
              className="w-full border rounded-lg p-3"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register("acceptTerms")}
                className="mt-1"
              />
              <span className="text-sm text-gray-600">
                Yes, I understand and agree to the iLeap Terms of Service, including the User Agreement and Privacy Policy.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create my account
          </button>
        </form>
      </div>
    </div>
  );
}
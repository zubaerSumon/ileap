'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
   const { 
    register: registerEmail, 
    handleSubmit: handleEmailSubmit, 
    formState: { errors: emailErrors } 
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

   const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors } 
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onEmailSubmit = async (data: EmailForm) => {
    setIsLoading(true);
    try {
      console.log("Email submitted:", data);
      setUserEmail(data.email);
      setStep('password');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      console.log("Password submitted:", data, "for email:", userEmail);
     } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
   };

  const goBackToEmail = () => {
    setStep('email');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 0 p-4">
      <div className="w-full max-w-md">
        <div className=" overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {step === 'email' ? 'Log in to iLeap' : 'Welcome back'}
            </h2>
            
            {step === 'email' ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm text-gray-600">New to iLeap?</span>
                  <Link href="/volunteer-signup" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Sign up
                  </Link>
                </div>

                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        {...registerEmail("email")}
                        placeholder="Enter your email address"
                        className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    {emailErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{emailErrors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Continue
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={40}
                      height={40}
                    />
                    <span>Continue with Google</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <p className="text-gray-700 font-medium">{userEmail}</p>
                  </div>
                  <button 
                    onClick={goBackToEmail}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Change
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        {...registerPassword("password")}
                        placeholder="Enter your password"
                        className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {passwordErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.password.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Sign in
                  </button>
                </form>
              </>
            )}
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-600">
            {step === 'email' ? (
              <p>
                By continuing, you agree to iLeap&apos;s <Link href="/terms" className="text-blue-600 hover:underline transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline transition-colors">Privacy Policy</Link>
              </p>
            ) : (
              <p>
                Secure login protected by industry-standard encryption
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

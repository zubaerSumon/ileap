'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    // Handle login logic here
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold text-start mb-10">Log in</h2>
        <div className="flex items-start gap-1 justify-start mb-8">
          <span className="text-sm text-gray-600">New to ileap?</span>
          <Link href="/volunteer-signup" className="text-sm text-blue-600 hover:text-blue-700">
            Sign up
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="Email or phone number"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Continue
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2  text-gray-500">Or</span>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <Image
                src="/google.svg"
                alt="Google"
                width={69}
                height={48}
                className="cursor-pointer hover:opacity-80"
              />
              <span className="text-sm text-gray-600 mt-2">Google</span>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src="/apple.svg"
                alt="Apple"
                width={69}
                height={48}
                className="cursor-pointer hover:opacity-80"
              />
              <span className="text-sm text-gray-600 mt-2">Apple</span>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={69}
                height={48}
                className="cursor-pointer hover:opacity-80"
              />
              <span className="text-sm text-gray-600 mt-2">LinkedIn</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

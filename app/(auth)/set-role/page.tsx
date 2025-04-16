/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/server/db/interfaces/user";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const SetRolePage = () => {
  const [selectedRole, setSelectedRole] = useState<
    "volunteer" | "organization" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleRoleSelect = (role: "volunteer" | "organization") => {
    setSelectedRole(role);
  };
  const updateUserMutation = trpc.users.updateUser.useMutation({
    onSuccess: async () => {
      await update({
        ...session,
        user: {
          ...session?.user,
          role: selectedRole,
        },
      });
      console.log({session});
      
      router.push(`/${selectedRole}`);
      toast.success(`User Updated with role ${selectedRole} successfully`, {
        duration: 4000,
      });
      setIsLoading(false);
    },
    onError: () => {
      toast.error("Failed to update user role. Please try again.");
      setIsLoading(false);
    },
  });
  const handleContinue = async () => {
    if (!selectedRole) return;
    updateUserMutation.mutate({
      role:
        selectedRole === "volunteer"
          ? UserRole.VOLUNTEER
          : UserRole.ORGANIZATION,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">
          Continue as a volunteer or organization
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`border-2 rounded-lg p-6 cursor-pointer ${
              selectedRole === "volunteer"
                ? "border-blue-700"
                : "border-gray-200"
            }`}
            onClick={() => handleRoleSelect("volunteer")}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
    ${selectedRole === "volunteer" ? "border-blue-700" : "border-gray-300"}`}
                >
                  {selectedRole === "volunteer" && (
                    <svg
                      className="w-5 h-5 text-blue-700"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="8" fill="currentColor" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">I&apos;m a volunteer</p>
                <p className="text-sm text-gray-600">looking to help</p>
              </div>
            </div>
          </div>

          <div
            className={`border-2 rounded-lg p-6 cursor-pointer ${
              selectedRole === "organization"
                ? "border-blue-700"
                : "border-gray-200"
            }`}
            onClick={() => handleRoleSelect("organization")}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
    ${selectedRole === "organization" ? "border-blue-700" : "border-gray-300"}`}
                >
                  {selectedRole === "organization" && (
                    <svg
                      className="w-5 h-5 text-blue-700"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="8" fill="currentColor" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">I&apos;m an organization</p>
                <p className="text-sm text-gray-600">
                  looking to post opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className={`w-full py-3 rounded-lg font-medium ${
            selectedRole && !isLoading
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedRole || isLoading}
        >
          {isLoading
            ? "Processing..."
            : selectedRole === "volunteer"
            ? "Continue as Volunteer"
            : selectedRole === "organization"
            ? "Continue as Organization"
            : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default SetRolePage;

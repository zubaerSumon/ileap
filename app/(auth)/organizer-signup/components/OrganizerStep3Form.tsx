'use client';

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { OrganizerSignupForm } from "../types";

interface OrganizerStep3FormProps {
  register: UseFormRegister<OrganizerSignupForm>;
  errors: FieldErrors<OrganizerSignupForm>;
}

export function OrganizerStep3Form({ register }: OrganizerStep3FormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Organization Details
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your organization and how we can help.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Logo */}
        <div className="border rounded-lg p-4 w-[600px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <button
              type="button"
              className="text-blue-600 font-medium hover:text-blue-700"
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
            >
              Upload logo
            </button>
            <input
              type="file"
              accept="image/*"
              {...register("organizationLogo")}
              className="hidden"
            />
          </div>
        </div>

        {/* Organization Details */}
        <div className="w-[600px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            {...register("organizationName")}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter organization name"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Description
          </label>
          <textarea
            {...register("organizationDescription")}
            rows={4}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your organization..."
          />
        </div>

        {/* Contact Information */}
        <div className="w-[600px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Website
          </label>
          <input
            type="url"
            {...register("website")}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Phone
          </label>
          <input
            type="tel"
            {...register("organizationPhone")}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter organization phone number"
          />
        </div>
      </div>
    </div>
  );
}
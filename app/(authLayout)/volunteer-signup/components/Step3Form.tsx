import { UseFormRegister } from "react-hook-form";
import { VolunteerSignupForm } from "../types";

interface Step3Props {
  register: UseFormRegister<VolunteerSignupForm>;
}

export function Step3Form({ register }: Step3Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Tell us about yourself
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the information below so we can provide specific information
          about how Ileap can work with your passion.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div className="border rounded-lg p-4 w-[600px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile photo
          </label>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <button
              type="button"
              className="text-blue-600 font-medium hover:text-blue-700"
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
            >
              Select photo
            </button>
            <input
              type="file"
              accept="image/*"
              {...register("profilePhoto" as never)}
              className="hidden"
            />
          </div>
        </div>

        {/* About You Section */}
        <div className="w-[600px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About you
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Availability Sections Container */}
        <div className="flex gap-4 w-[600px]">
          <div className="border rounded-lg p-3 w-1/2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Date
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  {...register("availabilityDate.startDate")}
                  className="w-full border rounded-lg p-1 text-xs"
                />
                <span className="text-sm">-</span>
                <input
                  type="date"
                  {...register("availabilityDate.endDate")}
                  className="w-full border rounded-lg p-1 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability Time
            </label>
            <div className="flex items-center gap-1">
              <input
                type="time"
                {...register("availabilityTime.startTime")}
                className="flex-1 border rounded-lg p-1 text-xs"
              />
              <span className="text-sm">-</span>
              <input
                type="time"
                {...register("availabilityTime.endTime")}
                className="flex-1 border rounded-lg p-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Account Section remains the same */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Add you social account (optional)
          </h3>
          <button
            type="button"
            className="flex items-center gap-2 text-[#0A66C2] hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200"
            onClick={() => {/* Add LinkedIn OAuth logic here */}}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span className="font-medium">Connect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
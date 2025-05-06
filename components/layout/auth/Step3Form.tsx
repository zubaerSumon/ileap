import { UseFormRegister, FieldErrors } from "react-hook-form";
import { VolunteerSignupForm } from "../../../app/(auth)/volunteer-signup/types";
import { FormTextarea, ImageUpload, FormDateTimeRangePicker } from "@/components/forms";

interface Step3Props {
  register: UseFormRegister<VolunteerSignupForm>;
  errors: FieldErrors<VolunteerSignupForm>;
}

export function Step3Form({ register, errors }: Step3Props) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
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
        <div className="w-full max-w-[600px]">
          <ImageUpload
            label="Profile photo"
            onChange={(file) => {
              console.log('File selected:', file);
            }}
            error={errors.image?.message}
            imageType="avatar"
          />
        </div>

        {/* About You Section */}
        <FormTextarea
          label="About you"
          {...register("bio")}
          error={errors.bio?.message}
          placeholder="Tell us about yourself..."
          rows={4}
          containerClassName="w-full max-w-[600px]"
        />

        {/* Availability Sections Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[600px]">
          <div className="w-full sm:w-1/2">
            <FormDateTimeRangePicker
              register={register}
              errors={errors}
              name={{
                startDate: "availability_date.startDate",
                endDate: "availability_date.endDate"
              }}
              label="Availability Date"
              dateOnly
            />
          </div>

          <div className="w-full sm:w-1/2">
            <FormDateTimeRangePicker
              register={register}
              errors={errors}
              name={{
                startTime: "availability_time.startTime",
                endTime: "availability_time.endTime"
              }}
              label="Availability Time"
              timeOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
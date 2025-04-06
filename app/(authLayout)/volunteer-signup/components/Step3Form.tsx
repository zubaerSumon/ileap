import { UseFormRegister, FieldErrors } from "react-hook-form";
import { VolunteerSignupForm } from "../types";
import { FormTextarea, ImageUpload, FormDateTimeRangePicker } from "@/components/forms";

interface Step3Props {
  register: UseFormRegister<VolunteerSignupForm>;
  errors: FieldErrors<VolunteerSignupForm>;
}

export function Step3Form({ register, errors }: Step3Props) {
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
        <div className="w-[600px]">
          <ImageUpload
            label="Profile photo"
            onChange={(file) => {
              // In a real implementation, you would handle the file upload here
              // and set the image URL to the form value
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
          containerClassName="w-[600px]"
        />

        {/* Availability Sections Container */}
        <div className="flex gap-4 w-[600px]">
          <div className="w-1/2">
            <FormDateTimeRangePicker
              register={register}
              errors={errors}
              name={{
                startDate: "availabilityDate.startDate",
                endDate: "availabilityDate.endDate"
              }}
              label="Availability Date"
              dateOnly
            />
          </div>

          <div className="w-1/2">
            <FormDateTimeRangePicker
              register={register}
              errors={errors}
              name={{
                startTime: "availabilityTime.startTime",
                endTime: "availabilityTime.endTime"
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
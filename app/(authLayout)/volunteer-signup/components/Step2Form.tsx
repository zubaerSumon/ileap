import { UseFormRegister, FieldErrors } from "react-hook-form";
import { VolunteerSignupForm } from "../types";

interface Step2Props {
  register: UseFormRegister<VolunteerSignupForm>;
  errors: FieldErrors<VolunteerSignupForm>;
}

export function Step2Form({ register, errors }: Step2Props) {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Quick Set-up</h2>
        <p className="mt-2 text-sm text-gray-600">
          We want to make sure you know exactly how ILEAP can meet your unique needs.
        </p>
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="age"
              type="text"
              {...register('age')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your age"
            />
          </div>
        </div>
        {errors.age && (
          <p className="mt-2 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        {errors.phoneNumber && (
          <p className="mt-2 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="country"
              type="text"
              {...register('country')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your country"
            />
          </div>
        </div>
        {errors.country && (
          <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="streetAddress"
              type="text"
              {...register('streetAddress')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your street address"
            />
          </div>
        </div>
        {errors.streetAddress && (
          <p className="mt-2 text-sm text-red-600">{errors.streetAddress.message}</p>
        )}
      </div>
    </>
  );
}
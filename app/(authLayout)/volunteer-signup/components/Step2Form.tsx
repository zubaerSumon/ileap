import { UseFormRegister } from "react-hook-form";
import { VolunteerSignupForm } from "../types";

interface Step2Props {
  register: UseFormRegister<VolunteerSignupForm>;
}

export function Step2Form({ register }: Step2Props) {
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
              type="number"
              {...register('age' as never)}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your age"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="phone"
              type="tel"
              {...register('phone' as never)}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country/State
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="country"
              type="text"
              {...register('location')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your country/state"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="address"
              type="text"
              {...register('location')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your street address"
            />
          </div>
        </div>
      </div>
    </>
  );
}
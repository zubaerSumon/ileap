import { UseFormRegister, FieldErrors } from "react-hook-form";
import { VolunteerSignupForm } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step1Props {
  register: UseFormRegister<VolunteerSignupForm>;
  errors: FieldErrors<VolunteerSignupForm>;
}

export function Step1Form({ register, errors }: Step1Props) {
  return (
    <>
      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Volunteer Name
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="name"
              type="text"
              {...register('name')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your name"
            />
          </div>
        </div>
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            What type of volunteer work do you like?
          </label>
          <div className="mt-1">
            <Select onValueChange={(value) => register('volunteerType').onChange({ target: { value } })}>
              <SelectTrigger className="w-full border-0 shadow-none focus:ring-0 bg-[#EAF1FF]">
                <SelectValue placeholder="Select volunteer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="animal-welfare">Animal Welfare</SelectItem>
                <SelectItem value="homeless">Homeless</SelectItem>
                <SelectItem value="education">Education & Literacy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {errors.volunteerType && (
          <p className="mt-2 text-sm text-red-600">{errors.volunteerType.message}</p>
        )}
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="email"
              type="email"
              {...register('email')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your email"
            />
          </div>
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 bg-[#EAF1FF]">
            <input
              id="password"
              type="password"
              {...register('password')}
              className="appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1"
              placeholder="Enter your password"
            />
          </div>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          {...register('termsAccepted')}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-[50%]"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
        </label>
      </div>
    </>
  );
}
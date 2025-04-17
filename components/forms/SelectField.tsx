"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  id: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  registerName: Path<T>;
  error?: string;
  options: Option[];
}

export const SelectField = <T extends FieldValues>({
  label,
  id,
  placeholder,
  register,
  registerName,
  error,
  options,
}: SelectFieldProps<T>) => {
  return (
    <div className="space-y-1">
      <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 bg-[#EAF1FF]">
          <select
            id={id}
            {...register(registerName)}
            className="w-full bg-[#EAF1FF] h-6 px-2 py-0 focus:outline-none text-sm appearance-none"
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}; 
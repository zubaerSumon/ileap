"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  registerName: Path<T>;
  error?: string;
  className?: string;
}

export const FormField = <T extends FieldValues>({
  label,
  id,
  type = "text",
  placeholder,
  register,
  registerName,
  error,
  className = "",
}: FormFieldProps<T>) => {
  return (
    <div className="space-y-1">
      <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 bg-[#EAF1FF]">
          {type === "textarea" ? (
            <textarea
              id={id}
              {...register(registerName)}
              placeholder={placeholder}
              className={`w-full bg-[#EAF1FF] min-h-[100px] focus:outline-none text-sm ${className}`}
            />
          ) : (
            <input
              type={type}
              id={id}
              {...register(registerName)}
              placeholder={placeholder}
              className={`w-full bg-[#EAF1FF] h-6 px-2 py-1 focus:outline-none text-sm ${className}`}
            />
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};
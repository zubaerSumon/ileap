"use client";

import { FieldValues, Path, UseFormRegister, UseFormSetValue, PathValue } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneFieldProps<T extends FieldValues> {
  label: string;
  id: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  registerName: Path<T>;
  error?: string;
  value?: string;
  setValue: UseFormSetValue<T>;
}

export const PhoneField = <T extends FieldValues>({
  label,
  id,
  placeholder,
  registerName,
  error,
  value,
  setValue,
}: PhoneFieldProps<T>) => {
  return (
    <div className="space-y-1">
      <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 bg-[#EAF1FF]">
          <PhoneInput
            id={id}
            international
            defaultCountry="AU"
            value={value}
            onChange={(newValue) => {
              setValue(registerName, newValue as PathValue<T, Path<T>>);
            }}
            placeholder={placeholder}
            className="text-sm"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}; 
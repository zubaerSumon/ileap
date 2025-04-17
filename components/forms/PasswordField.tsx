"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  registerName?: string; // Make registerName optional
  error?: string;
  placeholder?: string;
  onFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordField({
  label,
  id,
  register,
  registerName,
  error,
  placeholder,
  onFieldChange,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 bg-[#EAF1FF] relative flex items-center">
          <input
            id={id}
            type={show ? "text" : "password"}
            {...(typeof register === "function" && registerName
              ? register(registerName, onFieldChange ? { onChange: onFieldChange } : {})
              : register)} // Accept either direct register result or function+name combo
            className="appearance-none focus-visible:ring-[1px] block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] h-6 px-2 py-1 border-none pr-8"
            placeholder={placeholder}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
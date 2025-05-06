import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
}

export function FormInput({
  label,
  error,
  className,
  containerClassName,
  labelClassName,
  inputWrapperClassName,
  ...props
}: FormInputProps) {
  return (
    <div className={cn('w-full', containerClassName)}>
      <div className={cn('border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg', inputWrapperClassName)}>
        <label 
          htmlFor={props.id} 
          className={cn('block text-sm font-medium text-gray-700', labelClassName)}
        >
          {label}
        </label>
        <div className="mt-1 bg-[#EAF1FF]">
          <Input
            className={cn('appearance-none block w-full focus:outline-none sm:text-sm bg-[#EAF1FF] px-2 py-1 border-0 shadow-none', className)}
            {...props}
          />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
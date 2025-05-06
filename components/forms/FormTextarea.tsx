import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaWrapperClassName?: string;
}

export function FormTextarea({
  label,
  error,
  className,
  containerClassName,
  labelClassName,
   
  ...props
}: FormTextareaProps) {
  return (
    <div className={cn('w-full', containerClassName)}>
      <label 
        htmlFor={props.id} 
        className={cn('block text-sm font-medium text-gray-700 mb-1', labelClassName)}
      >
        {label}
      </label>
      <Textarea
        className={cn('w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500', className)}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
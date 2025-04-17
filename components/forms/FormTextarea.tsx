"use client";

 import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
 import { Textarea } from "@/components/ui/textarea";
 
 import { Control, FieldValues, Path  } from "react-hook-form";

// Base props for all form components
interface BaseFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  className?: string;
}

 
interface FormTextareaProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  placeholder?: string;
  rows?: number;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  description,
  control,
  placeholder,
  rows = 4,
  className
}: FormTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="bg-[#F9FAFB]"
              rows={rows}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

 
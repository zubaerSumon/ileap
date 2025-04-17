"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, FieldValues, Path } from "react-hook-form";

// Base props for all form components
interface BaseFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  className?: string;
}
interface SelectOption {
  value: string;
  label: string;
}
interface FormSelectProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

// MultiSelect component for array values
type FormMultiSelectProps<T extends FieldValues> = FormSelectProps<T>;

export function FormMultiSelect<T extends FieldValues>({
  name,
  label,
  description,
  control,
  options,
  placeholder = "Select options",
  className,
}: FormMultiSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Get first value from array or empty string
        const currentValue =
          Array.isArray(field.value) && field.value.length > 0
            ? field.value[0]
            : "";

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <Select
              value={currentValue}
              onValueChange={(value) => field.onChange([value])}
            >
              <FormControl>
                <SelectTrigger className="bg-[#F9FAFB]">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

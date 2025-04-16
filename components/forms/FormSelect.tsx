"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
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

// Checkbox component
interface FormCheckboxProps<T extends FieldValues>
  extends BaseFormFieldProps<T> {
  onCheckedChange?: (checked: boolean) => void;
}

export function FormCheckboxField<T extends FieldValues>({
  name,
  label,
  description,
  control,
  onCheckedChange,
  className,
}: FormCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-row items-start space-x-3 space-y-0 ${className}`}
        >
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (onCheckedChange) onCheckedChange(!!checked);
              }}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

// Select component
interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  description,
  control,
  options,
  placeholder = "Select an option",
  onValueChange,
  className,
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              if (onValueChange) onValueChange(value);
            }}
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
      )}
    />
  );
}

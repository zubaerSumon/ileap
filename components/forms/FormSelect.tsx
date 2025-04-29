"use client";

import { FieldValues, Path, Control, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  id: string;
  placeholder?: string;
  control: Control<T>;
  registerName: Path<T>;
  error?: string;
  options: Option[];
}

export const FormSelect = <T extends FieldValues>({
  label,
  id,
  placeholder,
  control,
  registerName,
  error,
  options,
}: SelectFieldProps<T>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Controller
        control={control}
        name={registerName}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={id} className="w-full h-12 cursor-pointer">
              <SelectValue placeholder={placeholder || `Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
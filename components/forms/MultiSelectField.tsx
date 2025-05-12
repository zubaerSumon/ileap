"use client";

import { FieldValues, Path, UseFormRegister, UseFormSetValue, PathValue } from "react-hook-form";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFieldProps<T extends FieldValues> {
  label: string;
  id: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  registerName: Path<T>;
  error?: string;
  options: Option[];
  setValue: UseFormSetValue<T>;
  value?: string[];
  className?:string;
}

export const MultiSelectField = <T extends FieldValues>({
  label,
  id,
  placeholder,
  registerName,
  error,
  options,
  setValue,
  className="",
  value = [],
}: MultiSelectFieldProps<T>) => {
  const selectedOptions = options.filter((option) => value.includes(option.value));

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        isMulti
        id={id}
        options={options}
        value={selectedOptions}
        onChange={(newValue) => {
          setValue(
            registerName,
            (newValue as Option[]).map((option) => option.value) as PathValue<T, Path<T>>
          );
        }}
        placeholder={placeholder}
        classNamePrefix="react-select"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'hsl(var(--primary))',
            primary75: 'hsl(var(--primary) / 0.75)',
            primary50: 'hsl(var(--primary) / 0.5)',
            primary25: 'hsl(var(--primary) / 0.25)',
          },
        })}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'transparent',
            border: '1px solid #CBCBCB',
            borderRadius: '8px',
            padding: '4px 8px',
            '&:hover': {
              borderColor: '#CBCBCB',
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? 'hsl(var(--primary))'
              : state.isFocused
              ? 'hsl(var(--accent))'
              : 'transparent',
            color: state.isSelected ? 'white' : 'inherit',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: 'transparent',
            border: '1px solid #CBCBCB',
            borderRadius: '6px',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'inherit',
            padding: '2px 6px',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'inherit',
            ':hover': {
              backgroundColor: 'transparent',
              color: 'red',
            },
          }),
        }}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
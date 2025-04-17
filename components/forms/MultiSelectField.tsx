"use client";

import { FieldValues, Path, UseFormRegister, UseFormSetValue } from "react-hook-form";
import Select from "react-select";

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
}

export const MultiSelectField = <T extends FieldValues>({
  label,
  id,
  placeholder,
  registerName,
  error,
  options,
  setValue,
  value = [],
}: MultiSelectFieldProps<T>) => {
  const selectedOptions = options.filter((option) => value.includes(option.value));

  return (
    <div className="space-y-1">
      <div className="border-[0.5px] border-[#CBCBCB] px-3 py-2 rounded-lg">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 bg-[#EAF1FF]">
          <Select
            isMulti
            id={id}
            options={options}
            value={selectedOptions}
            onChange={(newValue) => {
              setValue(
                registerName,
                (newValue as Option[]).map((option) => option.value) as any
              );
            }}
            placeholder={placeholder}
            className="react-select"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '24px',
                border: 'none',
                borderRadius: '0',
                backgroundColor: '#EAF1FF',
                boxShadow: 'none',
                '&:hover': {
                  border: 'none',
                },
              }),
              valueContainer: (base) => ({
                ...base,
                padding: '0 8px',
              }),
              input: (base) => ({
                ...base,
                margin: '0',
                padding: '0',
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: '0.875rem',
              }),
              option: (base, state) => ({
                ...base,
                fontSize: '0.875rem',
                backgroundColor: state.isSelected
                  ? '#2563EB'
                  : state.isFocused
                  ? '#DBEAFE'
                  : 'white',
                color: state.isSelected ? 'white' : '#111827',
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#DBEAFE',
              }),
            }}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}; 
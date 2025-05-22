"use client";

import { FieldValues, Path, Control, Controller, ControllerRenderProps } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  id: string;
  placeholder?: string;
  control: Control<T>;
  registerName: Path<T>;
  error?: string;
  options: Option[];
  searchEnabled?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  description?: string;
}

export const FormSelect = <T extends FieldValues>({
  label,
  id,
  placeholder,
  control,
  registerName,
  error,
  options,
  searchEnabled = false,
  disabled = false,
  loading = false,
  className,
  description,
}: SelectFieldProps<T>) => {
  const [open, setOpen] = useState(false);

  const renderSearchableSelect = (field: ControllerRenderProps<T, Path<T>>) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12",
            error && "border-red-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {field.value
                ? options.find((option) => option.value === field.value)?.label
                : placeholder || `Select ${label}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0" 
        align="start"
        sideOffset={4}
      >
        <Command className="max-h-[300px] w-[var(--radix-popover-trigger-width)]">
          <CommandInput 
            placeholder={`Search ${label}...`} 
            className="h-9"
            disabled={disabled || loading}
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </CommandEmpty>
            <CommandGroup className="max-h-[250px] overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    field.onChange(option.value);
                    setOpen(false);
                  }}
                  disabled={option.disabled}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 text-sm",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      field.value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  const renderRegularSelect = (field: ControllerRenderProps<T, Path<T>>) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
      disabled={disabled || loading}
    >
      <SelectTrigger 
        id={id} 
        className={cn(
          "w-full h-12 cursor-pointer",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            className={cn(
              option.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className={cn(error && "text-red-500")}>
          {label}
        </Label>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </div>
      <Controller
        control={control}
        name={registerName}
        render={({ field }) => (
          searchEnabled ? renderSearchableSelect(field) : renderRegularSelect(field)
        )}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
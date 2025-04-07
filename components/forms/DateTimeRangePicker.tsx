/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DateTimeRangePickerProps {
  label: string;
  error?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  containerClassName?: string;
  labelClassName?: string;
  dateOnly?: boolean;
  timeOnly?: boolean;
}

export function DateTimeRangePicker({
  label,
  error,
  startDate,
  endDate,
  startTime,
  endTime,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  containerClassName,
  labelClassName,
  dateOnly = false,
  timeOnly = false,
}: DateTimeRangePickerProps) {
  return (
    <div className={cn('border rounded-lg p-3', containerClassName)}>
      <label className={cn('block text-sm font-medium text-gray-700 mb-2', labelClassName)}>
        {label}
      </label>
      {!timeOnly && (
        <div className="flex items-center gap-1 mb-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full border rounded-lg p-1 text-xs"
          />
          <span className="text-sm">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full border rounded-lg p-1 text-xs"
          />
        </div>
      )}
      {!dateOnly && (
        <div className="flex items-center gap-1">
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="flex-1 border rounded-lg p-1 text-xs"
          />
          <span className="text-sm">-</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="flex-1 border rounded-lg p-1 text-xs"
          />
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Hook form adapter component
export function FormDateTimeRangePicker({
  register,
  errors,
  name,
  label,
  dateOnly,
  timeOnly,
  containerClassName,
  labelClassName,
}: {
  register: any;
  errors: {
    [key: string]: {
      message?: string;
    };
  };
  name: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
  };
  label: string;
  dateOnly?: boolean;
  timeOnly?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}) {
  const error = errors[Object.keys(name)[0]]?.message || '';
  
  return (
    <div className={cn('border rounded-lg p-3', containerClassName)}>
      <label className={cn('block text-sm font-medium text-gray-700 mb-2', labelClassName)}>
        {label}
      </label>
      {!timeOnly && name.startDate && name.endDate && (
        <div className="flex items-center gap-1 mb-2">
          <input
            type="date"
            {...register(name.startDate)}
            className="w-full border rounded-lg p-1 text-xs"
          />
          <span className="text-sm">-</span>
          <input
            type="date"
            {...register(name.endDate)}
            className="w-full border rounded-lg p-1 text-xs"
          />
        </div>
      )}
      {!dateOnly && name.startTime && name.endTime && (
        <div className="flex items-center gap-1">
          <input
            type="time"
            {...register(name.startTime)}
            className="flex-1 border rounded-lg p-1 text-xs"
          />
          <span className="text-sm">-</span>
          <input
            type="time"
            {...register(name.endTime)}
            className="flex-1 border rounded-lg p-1 text-xs"
          />
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
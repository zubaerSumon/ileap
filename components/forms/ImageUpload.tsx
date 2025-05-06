'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  label: string;
  error?: string;
  onChange: (file: File | null) => void;
  value?: File | string | null;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  imageType?: 'avatar' | 'logo';
}

export function ImageUpload({
  label,
  error,
  onChange,
  value,
  className,
  containerClassName,
  labelClassName,
  imageType = 'avatar',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(typeof value === 'string' ? value : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className={cn('border rounded-lg p-4', containerClassName)}>
      <label className={cn('block text-sm font-medium text-gray-700 mb-2', labelClassName)}>
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className={cn(
          'flex items-center justify-center overflow-hidden bg-gray-100',
          imageType === 'avatar' ? 'h-16 w-16 rounded-full' : 'h-16 w-16 rounded-lg',
          className
        )}>
          {preview ? (
            <Image
              src={preview} 
              alt="Preview" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <svg 
              className="h-8 w-8 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {imageType === 'avatar' ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              )}
            </svg>
          )}
        </div>
        <button
          type="button"
          className="text-blue-600 font-medium hover:text-blue-700"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {imageType === 'avatar' ? 'Select photo' : 'Upload logo'}
        </button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
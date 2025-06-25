import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trpc } from '../../utils/trpc';

type ProfilePhotoInputProps = {
  name: string;
  customClassName?: string;
  setValue: (name: string, value: string) => void;
  defaultValue?: string;
  label?: string;
  onUploadStateChange?: (isUploading: boolean) => void;
};

export function ProfilePhotoInput({
  name,
  customClassName,
  setValue,
  defaultValue,
  label = "Profile photo",
  onUploadStateChange,
}: ProfilePhotoInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLink, setUploadedLink] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  useEffect(() => {
    if (defaultValue) {
      setUploadedLink(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    onUploadStateChange?.(isUploading);
  }, [isUploading, onUploadStateChange]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }

      setError('');
      setIsUploading(true);
      try {
        const base64File = await convertFileToBase64(file);
        const result = await uploadMutation.mutateAsync({
          base64File,
          fileName: file.name,
          fileType: file.type,
          folder: 'profiles',
        });

        if (result?.data?.link) {
          setValue(name, result.data.link);
          setUploadedLink(result.data.link);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError('Failed to upload file');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation, name, setValue]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const imageSrc = uploadedLink || defaultValue;
  console.log({imageSrc});
  

  return (
    <div className={cn("flex items-center justify-between w-full p-2 border border-gray-200 rounded-lg", customClassName)}>
      <div className="flex items-center gap-3">
        {isUploading ? (
          <div className="flex items-center justify-center w-8 h-8">
            <Loader2 size={20} className="animate-spin text-blue-500" />
          </div>
        ) : imageSrc ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image 
              src={imageSrc} 
              alt={label}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30.9961 16C30.9961 24.2843 24.2804 31 15.9961 31C7.71185 31 0.996094 24.2843 0.996094 16C0.996094 7.71573 7.71185 1 15.9961 1C24.2804 1 30.9961 7.71573 30.9961 16Z" fill="#E5F7F9" stroke="#0C99B8" strokeWidth="1.5"/>
              <path d="M9 19.4643C9 19.4643 10.2857 17.3214 16 17.3214C21.7143 17.3214 23 19.4643 23 19.4643" stroke="#0C99B8" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M21.1406 10.7142C21.1406 10.7142 21.1406 14 18.4263 14C15.7121 14 15.7121 10.7142 15.7121 10.7142" stroke="#0C99B8" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15.7124 10.7142C15.7124 10.7142 15.7124 14 13.0838 14C10.4553 14 10.4553 10.7142 10.4553 10.7142" stroke="#0C99B8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      
      <label htmlFor={`profile-photo-input-${name}`} className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer font-medium">
        Select photo
        <input 
          id={`profile-photo-input-${name}`}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
      
      {error && (
        <div className="absolute -bottom-6 left-0 text-xs text-red-500">{error}</div>
      )}
    </div>
  );
}
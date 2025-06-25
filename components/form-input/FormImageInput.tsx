import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, Loader2, FileText, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import SharedTooltip from '../SharedTooltip';
import { Control, useController, Path, UseFormSetValue, PathValue } from 'react-hook-form';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type FormImageInputProps<T extends Record<string, unknown>> = {
  name: Path<T>;
  className?: string;
  setValue: UseFormSetValue<T>;
  defaultValue?: string;
  includeMimeType?: boolean;
  label?: string;
  control: Control<T>;
  onUploadStateChange?: (isUploading: boolean) => void;
};

export function FormImageInput<T extends Record<string, unknown>>({
  name,
  className,
  setValue,
  defaultValue,
  includeMimeType = false,
  label,
  control,
  onUploadStateChange,
}: FormImageInputProps<T>) {
  const { field } = useController({
    name,
    control,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLink, setUploadedLink] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [error, setError] = useState<string>('');

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  useEffect(() => {
    if (defaultValue) {
      setUploadedLink(defaultValue);
      field.onChange(defaultValue);
    }
  }, [defaultValue, field]);

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
      if (!file) return;
      
      setError('');
      setIsUploading(true);
      onUploadStateChange?.(true);
      console.log('FormImageInput: Upload started');
      
      try {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
        }

        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
          throw new Error('Only images and PDF files are allowed');
        }

        const base64File = await convertFileToBase64(file);
        const result = await uploadMutation.mutateAsync({
          base64File,
          fileName: file.name,
          fileType: file.type,
          folder: 'files',
        });

        if (!result?.data?.link) {
          throw new Error('Failed to get upload link');
        }

        const value = includeMimeType 
          ? { link: result.data.link, mimeType: file.type }
          : result.data.link;

        setValue(name, value as PathValue<T, Path<T>>);
        field.onChange(value);
        
        setUploadedLink(result.data.link);
        setFileName(file.name);
        setFileType(file.type);
      } catch (error) {
        console.error('Upload error:', error);
        setError(error instanceof Error ? error.message : 'Failed to upload file');
        setUploadedLink(defaultValue || null);
        setFileName('');
        setFileType('');
        field.onChange(defaultValue || '');
      } finally {
        setIsUploading(false);
        onUploadStateChange?.(false);
        console.log('FormImageInput: Upload finished');
      }
    },
    [uploadMutation, name, setValue, includeMimeType, defaultValue, field, onUploadStateChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const fileSize = rejectedFiles[0].file.size;
        setError(
          `File size exceeds 5MB limit (${(fileSize / (1024 * 1024)).toFixed(1)}MB)`
        );
        setUploadedLink(defaultValue || null);
        setFileName('');
        setFileType('');
        field.onChange(defaultValue || '');
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        await handleFileUpload(file);
      }
    },
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
    },
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_FILE_SIZE,
    preventDropOnDocument: true,
  });

  const imageSrc = uploadedLink || defaultValue;

  const renderPreview = () => {
    if (!imageSrc) return null;

    return (
      <div className="mt-4">
        <SharedTooltip
          visibleContent={
            <Link
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xs font-medium text-blue-500"
            >
              {fileName || 'Uploaded File'}
            </Link>
          }
        >
          {fileType.startsWith('image/') ? (
            <div className="relative w-24 h-24">
              <Image
                alt="Uploaded image"
                src={imageSrc}
                fill
                className="object-cover rounded"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
              <FileText className="text-gray-600" size={24} />
              <span className="text-sm text-gray-600">
                {fileName || 'Uploaded File'}
              </span>
            </div>
          )}
        </SharedTooltip>
      </div>
    );
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div
        {...getRootProps()}
        className={cn(
          'rounded-lg bg-[#F0EFFE] border-[#9C9CAA] p-5 border-dashed border-2',
          error && 'border-red-500',
          className
        )}
      >
        <input {...getInputProps()} hidden accept="image/*,.pdf" />
        {isDragActive ? (
          <p className="text-[#71717A] p-6">Drop the file here ...</p>
        ) : (
          <div
            className="h-full w-full flex items-center justify-center flex-col space-y-2 cursor-pointer"
            onClick={open}
          >
            {isUploading ? (
              <Loader2 size={40} className="animate-spin text-primary" />
            ) : (
              <CloudUpload
                size={40}
                className={error ? 'text-red-500' : 'text-[#9C9CAA]'}
              />
            )}
            <div className="text-center">
              <p className="text-[#71717A] text-sm">
                Drag an image, or click to browse
              </p>
              <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-red-500 mt-1">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {renderPreview()}
    </div>
  );
}

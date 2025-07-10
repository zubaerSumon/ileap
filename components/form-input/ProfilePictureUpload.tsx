import React, { useState, useCallback } from 'react';
import { Loader2, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trpc } from '../../utils/trpc';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type ProfilePictureUploadProps = {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  userName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function ProfilePictureUpload({
  currentImage,
  onImageChange,
  userName,
  size = 'md',
  className,
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

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
          onImageChange(result.data.link);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError('Failed to upload file');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation, onImageChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="relative">
        <Avatar className={cn("ring-4 ring-white shadow-lg", sizeClasses[size])}>
          {isUploading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : currentImage ? (
            <AvatarImage
              src={currentImage}
              alt={userName}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
              {getInitials(userName)}
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* Upload overlay */}
        <label 
          htmlFor="profile-picture-upload"
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer transition-opacity opacity-0 hover:opacity-100",
            isUploading && "opacity-100 cursor-not-allowed"
          )}
        >
          <Camera className="h-6 w-6 text-white" />
          <input 
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
      
      <div className="text-center">
        <label 
          htmlFor="profile-picture-upload-alt"
          className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
        >
          {isUploading ? 'Uploading...' : 'Change photo'}
        </label>
        <input 
          id="profile-picture-upload-alt"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>
      
      {error && (
        <div className="text-xs text-red-500 text-center max-w-48">{error}</div>
      )}
    </div>
  );
} 
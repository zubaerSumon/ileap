"use client";

import React from "react";
import Image from "next/image";
import { ProfileCard } from "./ProfileCard";
import { ProfilePictureUpload } from "@/components/form-input/ProfilePictureUpload";
import OrganizationAvatar from "@/components/ui/OrganizationAvatar";
import { trpc } from "@/utils/trpc";

// Cover Image Upload Component
function CoverImageUpload({
  currentImage,
  onImageChange,
  organizationName,
  uniqueId = 'default',
}: {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  organizationName: string;
  uniqueId?: string;
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileUpload = React.useCallback(
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
          folder: 'covers',
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

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <div 
          className="w-56 h-28 overflow-hidden border-2 border-gray-200 shadow-lg"
          style={{ borderRadius: '12px' }}
        >
          {isUploading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : currentImage ? (
            <Image
              src={currentImage}
              alt={`${organizationName} cover`}
              fill
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <div className="text-center">
                <div className="text-gray-400 text-3xl mb-2">🏢</div>
                <div className="text-sm text-gray-500">No cover image</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Upload overlay */}
        <label 
          htmlFor={`cover-image-upload-${uniqueId}`}
          className={`
            absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer transition-opacity opacity-0 hover:opacity-100
            ${isUploading ? 'opacity-100 cursor-not-allowed' : ''}
          `}
          style={{ borderRadius: '12px' }}
        >
          <div className="text-white text-center">
            <div className="text-xl mb-1">📷</div>
            <div className="text-xs">Upload Cover</div>
          </div>
          <input 
            id={`cover-image-upload-${uniqueId}`}
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
          htmlFor={`cover-image-upload-alt-${uniqueId}`}
          className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
        >
          {isUploading ? 'Uploading...' : 'Change cover image'}
        </label>
        <input 
          id={`cover-image-upload-alt-${uniqueId}`}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>
      
      {error && (
        <div className="text-xs text-red-500 text-center max-w-40">{error}</div>
      )}
    </div>
  );
}

interface OrganizationImagesCardProps {
  editMode: string;
  onEditClick: () => void;
  onCancelClick: () => void;
  profileImage?: string;
  coverImage?: string;
  organizationName: string;
  onProfileImageChange: (imageUrl: string) => void;
  onCoverImageChange: (imageUrl: string) => void;
  className?: string;
}

export function OrganizationImagesCard({
  editMode,
  onEditClick,
  onCancelClick,
  profileImage,
  coverImage,
  organizationName,
  onProfileImageChange,
  onCoverImageChange,
  className = "",
}: OrganizationImagesCardProps) {
  return (
    <ProfileCard
      title="Organization Images"
      editMode={editMode}
      onEditClick={onEditClick}
      onCancelClick={onCancelClick}
      className={className}
    >
      {editMode === "active" ? (
        <div className="space-y-6">
          {/* Organization Profile Picture Upload */}
          <div className="space-y-4">
                      <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Organization Profile Picture</h3>
            <p className="text-sm text-gray-500">This will be displayed as your organisation&apos;s logo across the platform</p>
          </div>
            <div className="flex justify-center">
              <ProfilePictureUpload
                currentImage={profileImage}
                onImageChange={onProfileImageChange}
                userName={organizationName}
                size="lg"
                uniqueId="organization"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Organization Cover Image Upload */}
          <div className="space-y-4">
                      <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Organization Cover Image</h3>
            <p className="text-sm text-gray-500">This will be displayed as your organisation&apos;s banner image on your profile</p>
          </div>
            <div className="flex justify-center">
              <CoverImageUpload
                currentImage={coverImage}
                onImageChange={onCoverImageChange}
                organizationName={organizationName}
                uniqueId="organization-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Organization Logo Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              <OrganizationAvatar 
                organization={{
                  title: organizationName,
                  profile_img: profileImage
                }}
                size={80}
                className="h-24 w-24 lg:h-28 lg:w-28 ring-3 ring-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
              />
              {!profileImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full">
                  <div className="text-center">
                    <div className="text-blue-400 text-2xl mb-1">🏢</div>
                    <div className="text-xs text-blue-600 font-semibold">Add Logo</div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Organization Logo</h3>
              <p className="text-sm text-gray-500">Your brand identity</p>
            </div>
          </div>
          
          {/* Organization Cover Image */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              <div className="relative w-64 h-32 lg:w-72 lg:h-36 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={`${organizationName} cover`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center">
                      <div className="text-green-400 text-3xl mb-1">🏢</div>
                      <div className="text-sm text-green-600 font-semibold mb-0.5">Add Cover Image</div>
                      <div className="text-xs text-green-500">Make your profile stand out</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Cover Image</h3>
              <p className="text-sm text-gray-500">Your organization banner</p>
            </div>
          </div>
        </div>
      )}
    </ProfileCard>
  );
} 
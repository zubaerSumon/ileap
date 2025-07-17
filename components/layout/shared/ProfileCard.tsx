"use client";

import React from "react";
import { Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePictureUpload } from "@/components/form-input/ProfilePictureUpload";
import { useSession } from "next-auth/react";

interface ProfileCardProps {
  title: string;
  editMode: string;
  onEditClick: () => void;
  onCancelClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ProfileCard({
  title,
  editMode,
  onEditClick,
  onCancelClick,
  children,
  className = "",
}: ProfileCardProps) {
  return (
    <Card className={`bg-white border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group ${className}`}>
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          {editMode !== "active" ? (
            <Button
              onClick={onEditClick}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer h-8 px-3"
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-base">Edit</span>
            </Button>
          ) : (
            <Button
              onClick={onCancelClick}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer h-8 px-3"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-base">Cancel</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
}

interface ProfilePictureCardProps {
  editMode: string;
  onEditClick: () => void;
  onCancelClick: () => void;
  onImageChange: (imageUrl: string) => void;
  userName: string;
  userRole?: string;
  userEmail?: string;
  className?: string;
}

export function ProfilePictureCard({
  editMode,
  onEditClick,
  onCancelClick,
  onImageChange,
  userName,
  userRole = "User",
  userEmail,
  className = "",
}: ProfilePictureCardProps) {
  const { data: session } = useSession();

  return (
    <ProfileCard
      title="Profile Picture"
      editMode={editMode}
      onEditClick={onEditClick}
      onCancelClick={onCancelClick}
      className={className}
    >
      {editMode === "active" ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <ProfilePictureUpload
            currentImage={session?.user?.image || undefined}
            onImageChange={onImageChange}
            userName={userName}
            size="lg"
            uniqueId="profile"
          />
          <div>
            <p className="text-base text-gray-600 font-medium">Upload Image</p>
            <p className="text-sm text-gray-500 mt-1">Choose a profile picture to personalize your account</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-3 ring-gray-100">
            {session?.user?.image ? (
              <AvatarImage
                src={session.user.image}
                alt={userName}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-xl sm:text-2xl font-semibold bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
                {userName.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {userName}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 font-medium">{userRole}</p>
            {userEmail && (
              <p className="text-sm sm:text-base text-gray-500 mt-1">{userEmail}</p>
            )}
          </div>
        </div>
      )}
    </ProfileCard>
  );
} 
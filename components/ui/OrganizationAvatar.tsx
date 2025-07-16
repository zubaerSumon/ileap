"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import RandomAvatar from "./random-avatar";

interface OrganizationAvatarProps {
  organization: {
    title: string;
    profile_img?: string | null;
  };
  size?: number;
  className?: string;
}

const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const OrganizationAvatar: React.FC<OrganizationAvatarProps> = ({ 
  organization, 
  size = 48, 
  className 
}) => {
  // If organization has a profile picture, use Avatar component
  if (organization.profile_img) {
    const sizeClasses: Record<number, string> = {
      24: "w-6 h-6",
      32: "w-8 h-8", 
      40: "w-10 h-10",
      48: "w-12 h-12",
      56: "w-14 h-14",
      64: "w-16 h-16"
    };

    return (
      <Avatar 
        className={cn(
          sizeClasses[size] || "w-12 h-12",
          className
        )}
        style={{ width: size, height: size }}
      >
        <AvatarImage
          src={organization.profile_img}
          alt={organization.title}
          className="object-cover"
        />
        <AvatarFallback className="bg-blue-600 text-white font-semibold">
          {getInitials(organization.title)}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Otherwise, use RandomAvatar
  return (
    <RandomAvatar
      name={organization.title}
      size={size}
      className={className}
    />
  );
};

export default OrganizationAvatar; 
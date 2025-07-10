"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import RandomAvatar from "./random-avatar";

interface UserAvatarProps {
  user: {
    name: string;
    image?: string | null;
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

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 48, 
  className 
}) => {
  // If user has a profile picture, use Avatar component
  if (user.image) {
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
          src={user.image}
          alt={user.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-blue-600 text-white font-semibold">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Otherwise, use RandomAvatar
  return (
    <RandomAvatar
      name={user.name}
      size={size}
      className={className}
    />
  );
};

export default UserAvatar; 
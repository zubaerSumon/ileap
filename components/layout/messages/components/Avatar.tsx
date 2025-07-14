import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import RandomAvatar from "@/components/ui/random-avatar";

interface AvatarProps {
  name: string;
  image?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, image, size = 40 }) => {
  // If user has a profile picture, use it
  if (image) {
    const getSizeClasses = (size: number) => {
      if (size <= 24) return "w-6 h-6";
      if (size <= 28) return "w-7 h-7";
      if (size <= 32) return "w-8 h-8";
      if (size <= 40) return "w-10 h-10";
      if (size <= 48) return "w-12 h-12";
      return "w-16 h-16";
    };

    return (
      <div className={cn(
        "relative rounded-full overflow-hidden",
        "ring-1 ring-offset-1 ring-offset-white",
        getSizeClasses(size)
      )}>
        <Image
          src={image}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
    );
  }

  // Otherwise, use RandomAvatar
  return (
    <RandomAvatar
      name={name}
      size={size}
    />
  );
};

export default Avatar; 
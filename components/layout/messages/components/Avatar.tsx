import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string) => {
  if (!name) return 'bg-blue-500';
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, avatar, size = 40 }) => {
  const initials = getInitials(name);
  const bgColor = getRandomColor(name);

  const getSizeClasses = (size: number) => {
    if (size <= 24) return "w-6 h-6 text-xs";
    if (size <= 28) return "w-7 h-7 text-xs";
    if (size <= 32) return "w-8 h-8 text-sm";
    if (size <= 40) return "w-10 h-10 text-sm";
    if (size <= 48) return "w-12 h-12 text-base";
    return "w-16 h-16 text-lg";
  };

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden",
      "ring-1 ring-offset-1 ring-offset-white",
      "flex items-center justify-center",
      "font-medium text-white",
      bgColor,
      getSizeClasses(size)
    )}>
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar; 
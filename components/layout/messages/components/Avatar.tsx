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

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden",
      "ring-2 ring-offset-2 ring-offset-white",
      "flex items-center justify-center",
      "font-medium text-white",
      bgColor,
      size === 40 ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs"
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
import React from "react";

interface ToolbarButtonProps {
  isActive?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

export const ToolbarButton = ({
  isActive,
  onClick,
  title,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-1 py-1 transition-colors ${
      isActive ? "text-black" : "text-gray-500"
    }`}
    title={title}
  >
    {children}
  </button>
); 
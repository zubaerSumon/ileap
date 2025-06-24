import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateOpportunityButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: React.ReactNode;
  onClick?: () => void;
}

export function CreateOpportunityButton({
  className,
  size = "lg",
  variant = "default",
  children = "Post an opportunity",
  onClick,
}: CreateOpportunityButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/organisation/opportunities/create");
    }
  };

  return (
    <Button
      className={cn(
        "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center w-full sm:w-auto",
        className
      )}
      size={size}
      variant={variant}
      onClick={handleClick}
    >
      <PlusIcon className="mr-2 transform scale-170" />
      {children}
    </Button>
  );
} 
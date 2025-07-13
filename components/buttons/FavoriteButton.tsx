import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/useFavorite";
 import Loading from "@/app/loading";

interface FavoriteButtonProps {
  opportunityId: string;
  className?: string;
}

export function FavoriteButton({
  opportunityId,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, isLoading, isToggling, toggleFavorite } = useFavorite(opportunityId);

  if (isLoading) {
    return (
      <Loading size="medium">
        <p className="text-gray-600 mt-2">Wait a sec...</p>
      </Loading>
    );
  }

  return (
    <Star 
      className={cn(
        "h-5 w-5 cursor-pointer",
        isFavorite ? "text-yellow-400 fill-current" : "text-gray-400",
        isToggling && "opacity-50",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
    />
  );
} 
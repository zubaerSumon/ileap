import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";

interface FavoriteStatus {
  isFavorite: boolean;
}

export const useFavorite = (opportunityId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const utils = trpc.useUtils();

  // Query to check if opportunity is favorited
  const { data: favoriteStatus, isPending: isStatusPending } = trpc.volunteers.getFavoriteStatus.useQuery(
    { opportunityId }
  );

  useEffect(() => {
    if (!isStatusPending) {
      setIsFavorite(favoriteStatus?.isFavorite || false);
      setIsLoading(false);
    }
  }, [favoriteStatus, isStatusPending]);

  // Mutation to toggle favorite status
  const toggleFavoriteMutation = trpc.volunteers.toggleFavorite.useMutation({
    onSuccess: (data: FavoriteStatus) => {
      // Invalidate both the opportunities list and count queries
      utils.volunteers.getFavoriteOpportunities.invalidate();
      utils.volunteers.getFavoriteOpportunitiesWithPagination.invalidate();
      utils.volunteers.getFavoriteOpportunitiesCount.invalidate();
      setIsFavorite(data.isFavorite);
    },
  });

  const toggleFavorite = () => {
    toggleFavoriteMutation.mutate({ opportunityId });
  };

  return {
    isFavorite,
    isLoading,
    isToggling: toggleFavoriteMutation.isPending,
    toggleFavorite,
  };
}; 
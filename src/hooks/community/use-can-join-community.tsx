import { useQuery } from "@tanstack/react-query";
import { communityService } from "@/services/community-service";

export function useCanJoinCommunity(communityAddress: string) {
  const query = useQuery({
    queryKey: ["can-join-community", communityAddress],
    queryFn: () => communityService.canJoinCommunity(communityAddress),
    enabled: !!communityAddress,
  });

  return query;
}

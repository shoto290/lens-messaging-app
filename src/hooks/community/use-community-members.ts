import { communityService } from "@/services/community-service";
import { useQuery } from "@tanstack/react-query";

export function useCommunityMembers(communityId: string) {
  const query = useQuery({
    queryKey: ["community-members", communityId],
    queryFn: () => communityService.getMembersOfCommunity(communityId),
  });

  return {
    ...query,
  };
}

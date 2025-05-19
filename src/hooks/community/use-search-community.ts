import { communityService } from "@/services/community-service";
import { useQuery } from "@tanstack/react-query";

export function useSearchCommunity(input?: string) {
  const query = useQuery({
    queryKey: ["search-community", input],
    queryFn: () => communityService.getSearchCommunities(input),
    enabled: !!input,
  });

  return {
    ...query,
    searchCommunities: query.data,
  };
}

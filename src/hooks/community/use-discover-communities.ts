import { communityService } from "@/services/community-service";
import { useQuery } from "@tanstack/react-query";

export function useDiscoverCommunities() {
  const query = useQuery({
    queryKey: ["discover-communities"],
    queryFn: () => communityService.getCommunities(),
  });

  return {
    ...query,
  };
}

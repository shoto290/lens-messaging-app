import { useCommunityStore } from "@/stores/community-store";
import { useQuery } from "@tanstack/react-query";

export function useDiscoverCommunities() {
  const { fetchDiscoverCommunities, discoverCommunities } = useCommunityStore();

  const query = useQuery({
    queryKey: ["discover-communities"],
    queryFn: () => fetchDiscoverCommunities(),
  });

  return {
    ...query,
    discoverCommunities,
  };
}

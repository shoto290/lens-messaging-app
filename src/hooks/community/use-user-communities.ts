import { useQuery } from "@tanstack/react-query";
import { useAccount } from "../use-account";
import { useCommunityStore } from "@/stores/community-store";

export function useUserCommunities() {
  const { fetchUserCommunities, userCommunities } = useCommunityStore();
  const { account } = useAccount();

  const query = useQuery({
    queryKey: ["user-communities", account?.address],
    queryFn: () => fetchUserCommunities(account?.address || ""),
    enabled: !!account?.address,
  });

  return {
    ...query,
    userCommunities,
  };
}

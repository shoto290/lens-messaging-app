import { useQuery } from "@tanstack/react-query";
import { useAccount } from "../use-account";
import { communityService } from "@/services/community-service";

export function useUserCommunities() {
  const { account } = useAccount();

  const query = useQuery({
    queryKey: ["user-communities", account?.account.address],
    queryFn: () =>
      communityService.getUserCommunities(account?.account.address || ""),
    enabled: !!account?.account.address,
  });

  return {
    ...query,
  };
}

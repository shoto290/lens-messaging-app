import { communityService } from "@/services/community-service";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "../use-account";

export function useUserCommunities() {
  const { account } = useAccount();

  const query = useQuery({
    queryKey: ["user-communities", account],
    queryFn: () =>
      communityService.getCommunitiesOfUser(account?.account.username?.id),
  });

  return {
    ...query,
  };
}

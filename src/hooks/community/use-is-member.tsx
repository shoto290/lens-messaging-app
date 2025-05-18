import { useQuery } from "@tanstack/react-query";
import { communityService } from "@/services/community-service";
import { useAccount } from "../use-account";

export function useIsCommunityMember(communityAddress: string) {
  const { account } = useAccount();

  const query = useQuery({
    queryKey: ["is-community-member", account, communityAddress],
    queryFn: async () => {
      if (!account || !communityAddress) return false;

      console.log({
        account,
      });

      const isMember = await communityService.isMemberOfCommunity(
        communityAddress,
        account.username?.localName || "",
        account.username?.namespace || "",
        account.address
      );
      return isMember;
    },
    enabled: !!account && !!communityAddress,
  });

  return query;
}

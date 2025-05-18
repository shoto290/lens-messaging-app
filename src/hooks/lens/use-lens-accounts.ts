import { useQuery } from "@tanstack/react-query";
import { lensService } from "@/services/lens-service";
import { useAccount } from "wagmi";
import { AccountAvailable } from "@lens-protocol/client";

export function useLensAccounts() {
  const { address, isConnected } = useAccount();

  const query = useQuery<AccountAvailable[], Error>({
    queryKey: ["lens-accounts", address],
    queryFn: async () => {
      if (!address) {
        return [];
      }

      return lensService.getAvailableAccounts(address);
    },
    enabled: !!address && isConnected,
  });

  return {
    ...query,
  };
}

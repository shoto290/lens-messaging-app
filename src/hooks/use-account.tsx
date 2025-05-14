import { useQuery } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { useAccount as useWagmiAccount } from "wagmi";
import { useCallback } from "react";

export function useAccount() {
  const { address, isConnected, status } = useWagmiAccount();
  const { hasAccount, account, getMe, initialized, initialize } =
    useAccountStore();

  console.log({
    status,
  });

  const fetchAccount = useCallback(async () => {
    if (!initialized) {
      await initialize(address);
    } else if (address) {
      await getMe(address);
    } else {
      return false;
    }
    return true;
  }, [address, getMe, initialized, initialize]);

  const query = useQuery({
    queryKey: ["account", address],
    queryFn: fetchAccount,
    // enabled: status !== "connecting" && status !== "reconnecting",
  });

  return {
    ...query,
    initialized,
    isLoggedIn: isConnected,
    hasAccount,
    account,
  };
}

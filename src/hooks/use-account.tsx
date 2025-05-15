import { useQuery } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { useAccount as useWagmiAccount } from "wagmi";

export function useAccount() {
  const { address, isConnected } = useWagmiAccount();
  const { sessionClient } = useAccountStore();
  const { hasAccount, account, getMe, initialized, initialize } =
    useAccountStore();

  const fetchAccount = async () => {
    if (!initialized) {
      await initialize(address);
    } else if (sessionClient && address) {
      await getMe(address);
    } else {
      return false;
    }
    return true;
  };

  const query = useQuery({
    queryKey: ["account", address, !!sessionClient],
    queryFn: fetchAccount,
  });

  return {
    ...query,
    initialized,
    isLoggedIn: isConnected,
    hasAccount,
    account,
  };
}

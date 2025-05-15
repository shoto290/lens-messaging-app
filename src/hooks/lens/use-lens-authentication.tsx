import { useCallback, useEffect } from "react";
import { lensService } from "@/services/lens-service";
import { useAccountStore } from "@/stores/account-store";
import { useAccount, useWalletClient } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/provider";

export const useLensAuthentication = () => {
  const { initialized, initialize, sessionClient, setSessionClient } =
    useAccountStore();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    let isCurrent = true;

    const checkSession = async () => {
      const session = await lensService.resumeSession();
      if (!isCurrent || !session) return;

      setSessionClient(session);
      if (!initialized && address) {
        await initialize(address);
      }
    };

    if (!initialized && isConnected) {
      checkSession().catch(console.error);
    }

    return () => {
      isCurrent = false;
    };
  }, [initialize, initialized, setSessionClient, address, isConnected]);

  const login = useCallback(async () => {
    try {
      if (!address || !walletClient) {
        console.error("Wallet not connected or client not available");
        return false;
      }

      const client = await lensService.login(address, walletClient);
      setSessionClient(client);
      await initialize(address);
      return !!client;
    } catch (error) {
      console.error("Failed to login:", error);
      return false;
    }
  }, [initialize, setSessionClient, address, walletClient]);

  const mutation = useMutation<boolean, Error, void>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  return {
    ...mutation,
    sessionClient,
    isAuthenticated: sessionClient !== null,
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
  };
};

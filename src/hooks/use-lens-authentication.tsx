import { useCallback, useEffect, useState } from "react";
import { lensService } from "@/services/lens-service";
import { useAccountStore } from "@/stores/account-store";
import { useAccount, useWalletClient } from "wagmi";

export const useLensAuthentication = () => {
  const {
    initialized,
    initialize,
    authenticated,
    sessionClient,
    setSessionClient,
  } = useAccountStore();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Initialize authentication state
  useEffect(() => {
    const checkSession = async () => {
      const session = await lensService.resumeSession();
      if (session) {
        setSessionClient(session);

        // Get the account info if we have a session but no account
        if (!initialized && address) {
          await initialize(address);
        }
      }
    };

    if (!initialized && isConnected) {
      checkSession();
    }
  }, [initialize, initialized, setSessionClient, address, isConnected]);

  // Login function
  const login = useCallback(async () => {
    try {
      if (!address || !walletClient) {
        console.error("Wallet not connected or client not available");
        return false;
      }

      setIsAuthenticating(true);
      const client = await lensService.login(address, walletClient);
      setSessionClient(client);
      await initialize(address);
      return !!client;
    } catch (error) {
      console.error("Failed to login:", error);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [initialize, setSessionClient, address, walletClient]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const success = await lensService.logout();
      if (success) {
        setSessionClient(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to logout:", error);
      return false;
    }
  }, [setSessionClient]);

  return {
    isAuthenticated: authenticated,
    isAuthenticating,
    sessionClient,
    login,
    logout,
    address,
    isConnected,
  };
};

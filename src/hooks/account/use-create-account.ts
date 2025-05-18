import { queryClient } from "@/app/provider";
import { useAccountCreateStore } from "@/stores/account-create-store";
import { useAccountStore } from "@/stores/account-store";
import { useMutation } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";

export function useCreateAccount() {
  const { setSessionClient, getMe } = useAccountStore();
  const { createAccount } = useAccountCreateStore();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!address) {
        throw new Error("No address found");
      }

      if (!walletClient) {
        throw new Error("No wallet client found");
      }

      const sessionClient = await createAccount(address, walletClient);
      setSessionClient(sessionClient);

      await getMe();

      return true;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["lens-accounts"] });
    },
  });

  return {
    ...mutation,
    createAccount: mutation.mutateAsync,
    createAccountAsync: mutation.mutateAsync,
  };
}

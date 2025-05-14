import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { useDisconnect as useWagmiDisconnect } from "wagmi";
import { useCallback } from "react";
import { queryClient } from "@/app/provider";

export function useDisconnect() {
  const { reset } = useAccountStore();
  const { disconnectAsync: disconnectWagmi } = useWagmiDisconnect();

  const handleDisconnect = useCallback(async () => {
    await disconnectWagmi();
    reset();
  }, [disconnectWagmi, reset]);

  const mutation = useMutation({
    mutationFn: handleDisconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account"],
      });
    },
  });

  return {
    ...mutation,
    disconnect: mutation.mutate,
  };
}

import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { useDisconnect as useWagmiDisconnect } from "wagmi";
import { useCallback } from "react";
import { queryClient } from "@/app/provider";
import { lensService } from "@/services/lens-service";

export function useDisconnect() {
  const { reset } = useAccountStore();
  const { disconnectAsync: disconnectWagmi } = useWagmiDisconnect();

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnectWagmi();
    } finally {
      try {
        await lensService.logout();
      } catch {
        /* non-fatal – ignore Lens logout errors */
      }
      reset();
    }
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

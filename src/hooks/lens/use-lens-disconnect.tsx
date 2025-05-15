import { useCallback } from "react";
import { lensService } from "@/services/lens-service";
import { useAccountStore } from "@/stores/account-store";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/provider";
import { toast } from "sonner";

export const useLensDisconnect = () => {
  const { setSessionClient } = useAccountStore();

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
      toast.error("Logout failed. Please try again.");
      return false;
    }
  }, [setSessionClient]);

  const mutate = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  return {
    ...mutate,
    disconnect: mutate.mutate,
    disconnectAsync: mutate.mutateAsync,
  };
};

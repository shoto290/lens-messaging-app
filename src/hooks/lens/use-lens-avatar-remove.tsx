import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { queryClient } from "@/app/provider";
import { sleep } from "@/lib/utils";
import { lensService } from "@/services/lens-service";

export const useLensAvatarRemove = () => {
  const { sessionClient, account: currentAccount } = useAccountStore();
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!sessionClient) {
        throw new Error("Not authenticated");
      }

      try {
        setIsUploading(true);

        if (!currentAccount) {
          throw new Error("No account found");
        }

        await lensService.updateAccountMetadata(sessionClient, currentAccount, {
          picture: undefined,
        });

        return true;
      } catch (error) {
        console.error("Failed to remove avatar:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: async () => {
      await sleep(4000);
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  return {
    removeAvatar: mutation.mutate,
    removeAvatarAsync: mutation.mutateAsync,
    isUploading,
    ...mutation,
  };
};

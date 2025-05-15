import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { queryClient } from "@/app/provider";
import { sleep } from "@/lib/utils";
import { lensService } from "@/services/lens-service";

interface UpdateProfileMetadataParams {
  name: string;
  bio?: string;
}

export const useLensProfileUpdateMetadata = () => {
  const { sessionClient, account: currentAccount } = useAccountStore();

  const mutation = useMutation({
    mutationFn: async ({ name, bio }: UpdateProfileMetadataParams) => {
      if (!sessionClient) {
        throw new Error("Not authenticated");
      }

      try {
        if (!currentAccount?.account) {
          throw new Error("No account found");
        }

        await lensService.updateAccountMetadata(
          sessionClient,
          currentAccount?.account,
          {
            name: name || undefined,
            bio: bio || undefined,
          }
        );

        return true;
      } catch (error) {
        console.error("Failed to update metadata:", error);
        throw error;
      }
    },

    onSuccess: async () => {
      await sleep(4000);
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  return {
    ...mutation,
    updateMetadata: mutation.mutate,
    updateMetadataAsync: mutation.mutateAsync,
  };
};

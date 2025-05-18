import { useAccountStore } from "@/stores/account-store";
import { queryClient } from "@/app/provider";
import { sleep } from "@/lib/utils";
import { lensService } from "@/services/lens-service";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import { useMutation } from "@tanstack/react-query";

export const useLensAvatarUpload = () => {
  const { sessionClient, account: currentAccount } = useAccountStore();
  const { uploadAvatarAsync } = useAvatarUpload();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!sessionClient) {
        throw new Error("Not authenticated");
      }

      if (!currentAccount) {
        throw new Error("No account found");
      }

      // Use the generic upload first
      const pictureUri = await uploadAvatarAsync(file);

      // Then update the Lens metadata with the new picture URI
      await lensService.updateAccountMetadata(sessionClient, currentAccount, {
        picture: pictureUri,
      });

      return pictureUri;
    },
    onSuccess: async () => {
      // Wait for the update to process before refreshing data
      await sleep(4000);
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  return {
    ...mutation,
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
  };
};

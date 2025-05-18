import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { groveService } from "@/services/grove-service";
import { queryClient } from "@/app/provider";
import { sleep } from "@/lib/utils";
import { lensService } from "@/services/lens-service";

export const useLensAvatarUpload = () => {
  const { sessionClient, account: currentAccount } = useAccountStore();
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!sessionClient) {
        throw new Error("Not authenticated");
      }

      try {
        setIsUploading(true);

        if (!currentAccount) {
          throw new Error("No account found");
        }

        const pictureUri = await groveService.uploadImage(file);
        console.log("Avatar uploaded to Grove:", pictureUri);

        await lensService.updateAccountMetadata(sessionClient, currentAccount, {
          picture: pictureUri,
        });

        return true;
      } catch (error) {
        console.error("Failed to upload avatar:", error);
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
    ...mutation,
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync: mutation.mutateAsync,
    isUploading,
  };
};

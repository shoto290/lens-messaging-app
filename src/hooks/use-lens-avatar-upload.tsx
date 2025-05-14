import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { account } from "@lens-protocol/metadata";
import { uri } from "@lens-protocol/client";
import { setAccountMetadata } from "@lens-protocol/client/actions";
import { groveService } from "@/services/grove-service";
import { queryClient } from "@/app/provider";
import { sleep } from "@/lib/utils";

/**
 * Hook for uploading an avatar image to Grove and updating Lens Protocol account metadata
 *
 * This implementation handles the avatar image upload process and updates the profile metadata
 * with the new image URI.
 */
export const useLensAvatarUpload = () => {
  const { sessionClient, account: currentAccount } = useAccountStore();
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!sessionClient) {
        throw new Error("Not authenticated");
      }

      try {
        setIsUploading(true);

        // Step 1: Upload the image file to Grove storage
        const pictureUri = await groveService.uploadImage(file);
        console.log("Avatar uploaded to Grove:", pictureUri);

        // Step 2: Create a new Account Metadata object with the updated picture
        // Making sure to preserve existing metadata fields
        const existingMetadata = currentAccount?.account.metadata;

        // Create metadata object preserving existing fields
        const metadata = account({
          name: existingMetadata?.name || "",
          bio: existingMetadata?.bio || "",
          picture: pictureUri, // Set the new avatar URI
          coverPicture: existingMetadata?.coverPicture || undefined,
          attributes: existingMetadata?.attributes || undefined,
        });

        console.log("Updating metadata with new avatar:", metadata);

        // Step 3: Upload the Account Metadata object to Grove
        const metadataUri = await groveService.uploadJson(metadata);
        console.log("Metadata uploaded to URI:", metadataUri);

        // Step 4: Set the URI of the Account Metadata on the Lens Account
        const result = await setAccountMetadata(sessionClient, {
          metadataUri: uri(metadataUri),
        });

        // Check for errors based on the result type
        if ("isErr" in result && result.isErr()) {
          throw new Error(`Failed to update metadata: ${result.error.message}`);
        }

        // For handling the transaction response (depends on specific implementation)
        const response = "value" in result ? result.value : result;
        return {
          pictureUri,
          metadataUri,
          response,
        };
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

  const removeAvatar = useMutation({
    mutationFn: async () => {
      if (!sessionClient) {
        throw new Error("Not authenticated");
      }

      try {
        setIsUploading(true);

        // Create a new Account Metadata object without picture
        const existingMetadata = currentAccount?.account.metadata;

        // Create metadata object preserving existing fields but removing picture
        const metadata = account({
          name: existingMetadata?.name || "",
          bio: existingMetadata?.bio || "",
          picture: "", // Clear the avatar
          coverPicture: existingMetadata?.coverPicture || undefined,
          attributes: existingMetadata?.attributes || undefined,
        });

        console.log("Updating metadata to remove avatar:", metadata);

        // Upload the Account Metadata object to Grove
        const metadataUri = await groveService.uploadJson(metadata);
        console.log("Metadata uploaded to URI:", metadataUri);

        // Set the URI of the Account Metadata on the Lens Account
        const result = await setAccountMetadata(sessionClient, {
          metadataUri: uri(metadataUri),
        });

        // Check for errors based on the result type
        if ("isErr" in result && result.isErr()) {
          throw new Error(`Failed to update metadata: ${result.error.message}`);
        }

        // For handling the transaction response
        const response = "value" in result ? result.value : result;
        return { metadataUri, response };
      } catch (error) {
        console.error("Failed to remove avatar:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
  });

  return {
    uploadAvatar: uploadAvatarMutation.mutate,
    uploadAvatarAsync: uploadAvatarMutation.mutateAsync,
    removeAvatar: removeAvatar.mutate,
    removeAvatarAsync: removeAvatar.mutateAsync,
    isUploading,
    isError: uploadAvatarMutation.isError || removeAvatar.isError,
    error: uploadAvatarMutation.error || removeAvatar.error,
    isPending: uploadAvatarMutation.isPending || removeAvatar.isPending,
  };
};

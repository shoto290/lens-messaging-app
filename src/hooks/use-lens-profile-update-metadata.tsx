import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "@/stores/account-store";
import { account } from "@lens-protocol/metadata";
import { uri } from "@lens-protocol/client";
import { setAccountMetadata } from "@lens-protocol/client/actions";
import { groveService } from "@/services/grove-service";

interface UpdateProfileMetadataParams {
  name: string;
  bio?: string;
  picture?: string;
}

/**
 * Hook for updating Lens Protocol account metadata
 *
 * This implementation uses the Lens Protocol metadata API and Grove storage
 * to update the profile metadata on-chain.
 */
export const useLensProfileUpdateMetadata = () => {
  const { sessionClient, account: currentAccount } = useAccountStore();
  const [isUpdating, setIsUpdating] = useState<{
    name: boolean;
    bio: boolean;
  }>({
    name: false,
    bio: false,
  });

  const updateMetadataMutation = useMutation({
    mutationFn: async ({ name, bio, picture }: UpdateProfileMetadataParams) => {
      if (!sessionClient) {
        throw new Error("Not authenticated");
      }

      try {
        // Step 1: Create a new Account Metadata object with updated fields
        // Making sure to preserve existing metadata fields
        const existingMetadata = currentAccount?.account.metadata;

        // Create metadata object with basic fields
        const metadata = account({
          name,
          bio: bio || "",
          picture: picture || existingMetadata?.picture || "",
          coverPicture: existingMetadata?.coverPicture || undefined,
          attributes: existingMetadata?.attributes || undefined,
        });

        console.log("Updating metadata:", metadata);

        // Step 2: Upload the Account Metadata object to Grove
        const metadataUri = await groveService.uploadJson(metadata);
        console.log("Metadata uploaded to URI:", metadataUri);

        // Step 3: Set the URI of the Account Metadata on the Lens Account
        const result = await setAccountMetadata(sessionClient, {
          metadataUri: uri(metadataUri),
        });

        // Check for errors based on the result type
        if ("isErr" in result && result.isErr()) {
          throw new Error(`Failed to update metadata: ${result.error.message}`);
        }

        // For handling the transaction response (depends on specific implementation)
        const response = "value" in result ? result.value : result;
        return response;
      } catch (error) {
        console.error("Failed to update metadata:", error);
        throw error;
      }
    },
    onMutate: (variables) => {
      // Track which fields are being updated
      setIsUpdating((prev) => ({
        ...prev,
        name: variables.name !== undefined,
        bio: variables.bio !== undefined,
      }));
    },
    onSettled: () => {
      // Reset updating status when the operation completes
      setIsUpdating({ name: false, bio: false });
    },
  });

  return {
    updateMetadata: updateMetadataMutation.mutate,
    updateMetadataAsync: updateMetadataMutation.mutateAsync,
    isUpdating,
    isUpdatingName: isUpdating.name,
    isUpdatingBio: isUpdating.bio,
    isError: updateMetadataMutation.isError,
    error: updateMetadataMutation.error,
    isPending: updateMetadataMutation.isPending,
  };
};

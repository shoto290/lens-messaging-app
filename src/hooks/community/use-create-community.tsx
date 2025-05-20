import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { queryClient } from "@/app/provider";
import { Community } from "@/services/community-service.types";
import { useChatStore } from "@/stores/chat-store";
import { useAccountStore } from "@/stores/account-store";
import { useWalletClient } from "wagmi";
import { communityService } from "@/services/community-service";
import { CommunityCreateInfo } from "@/stores/community-create-store";

export function useCreateCommunity() {
  const { setActiveSection } = useNavigation();
  const { setActiveCommunity } = useChatStore();
  const { sessionClient } = useAccountStore();
  const { data: walletClient } = useWalletClient();

  const createMutation = useMutation<unknown, Error, CommunityCreateInfo>({
    mutationFn: async ({ name, description, avatar, oneTimeAccess }) => {
      if (!sessionClient) {
        throw new Error("You must be authenticated to join a community");
      }

      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      return communityService.createCommunity(
        sessionClient,
        walletClient,
        {
          name,
          description,
          icon: avatar,
        },
        oneTimeAccess
      );
    },
    onSuccess: (createdCommunity) => {
      queryClient.invalidateQueries({ queryKey: ["user-communities"] });

      setActiveCommunity(createdCommunity as Community);
      setActiveSection(Section.CHAT);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create community: ${error.message}`);
    },
  });

  return {
    ...createMutation,
    createCommunity: createMutation.mutate,
    createCommunityAsync: createMutation.mutateAsync,
  };
}

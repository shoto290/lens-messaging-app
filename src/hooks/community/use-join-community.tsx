import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccountStore } from "@/stores/account-store";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { useWalletClient } from "wagmi";
import { queryClient } from "@/app/provider";
import { communityService } from "@/services/community-service";
import { Community } from "@/services/community-service.types";
import { useChatStore } from "@/stores/chat-store";

interface UseJoinCommunityProps {
  community: Community;
}

export function useJoinCommunity({ community }: UseJoinCommunityProps) {
  const { sessionClient } = useAccountStore();
  const { setActiveSection } = useNavigation();
  const { data: walletClient } = useWalletClient();
  const { setActiveCommunity } = useChatStore();

  const joinMutation = useMutation<
    Awaited<ReturnType<typeof communityService.joinCommunity>>,
    Error,
    void
  >({
    mutationFn: async () => {
      if (!sessionClient) {
        throw new Error("You must be authenticated to join a community");
      }

      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      return communityService.joinCommunity(
        sessionClient,
        walletClient,
        community.address
      );
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-communities"] });
      queryClient.invalidateQueries({ queryKey: ["community-members"] });

      if (data.requiresApproval) {
        toast.success(
          "Join request submitted successfully! Waiting for approval."
        );
      }

      if (!data.requiresApproval) {
        setActiveCommunity(community);
        setActiveSection(Section.CHAT);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to join community: ${error.message}`);
    },
  });

  return {
    ...joinMutation,
    joinCommunity: joinMutation.mutate,
    joinCommunityAsync: joinMutation.mutateAsync,
  };
}

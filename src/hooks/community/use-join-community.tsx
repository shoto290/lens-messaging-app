import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccountStore } from "@/stores/account-store";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { useWalletClient } from "wagmi";
import { queryClient } from "@/app/provider";
import { communityService } from "@/services/community-service";

export function useJoinCommunity() {
  const { sessionClient } = useAccountStore();
  const { setActiveSection } = useNavigation();
  const { data: walletClient } = useWalletClient();

  const joinMutation = useMutation({
    mutationFn: async (communityAddress: string) => {
      if (!sessionClient) {
        throw new Error("You must be authenticated to join a community");
      }

      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      return communityService.joinCommunity(
        sessionClient,
        walletClient,
        communityAddress
      );
    },
    onSuccess: (data) => {
      // Navigate to messages section if direct join
      if (!data.requiresApproval) {
        setActiveSection(Section.MESSAGES);
      }

      // Invalidate communities queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["user-communities"] });
      queryClient.invalidateQueries({ queryKey: ["community-members"] });

      // Show appropriate success message
      if (data.requiresApproval) {
        toast.success(
          "Join request submitted successfully! Waiting for approval."
        );
      } else {
        toast.success("Successfully joined the community!");
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to join community: ${error.message}`);
    },
  });

  const joinCommunity = (communityAddress: string) => {
    joinMutation.mutate(communityAddress);
  };

  return {
    ...joinMutation,
    joinCommunity,
  };
}

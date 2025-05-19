import { queryClient } from "@/app/provider";
import { Section } from "@/lib/types/navigation";
import { communityService } from "@/services/community-service";
import { useAccountStore } from "@/stores/account-store";
import { useChatStore } from "@/stores/chat-store";
import { useNavigation } from "@/stores/navigation-store";
import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";

export function useLeaveCommunity({
  communityAddress,
}: {
  communityAddress: string;
}) {
  const { sessionClient } = useAccountStore();
  const { data: walletClient } = useWalletClient();
  const { setActiveCommunity } = useChatStore();
  const { setActiveSection } = useNavigation();

  const mutation = useMutation({
    mutationFn: () => {
      if (!sessionClient) {
        throw new Error("You must be authenticated to leave a community");
      }

      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      return communityService.leaveCommunity(
        sessionClient,
        walletClient,
        communityAddress
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-communities"],
      });

      setActiveCommunity(null);
      setActiveSection(Section.MESSAGES);
    },
  });

  return {
    ...mutation,
    leaveCommunity: mutation.mutate,
    leaveCommunityAsync: mutation.mutateAsync,
  };
}

import { queryClient } from "@/app/provider";
import { chatService } from "@/services/chat-service";
import { useChatStore } from "@/stores/chat-store";
import { useMutation } from "@tanstack/react-query";

export function useSendMessages(communityId: string | null) {
  const { activeCommunity } = useChatStore();
  const currentCommunityId = communityId || activeCommunity?.address;

  const mutation = useMutation({
    mutationFn: (text: string) => {
      if (!currentCommunityId) {
        throw new Error("No active community selected");
      }
      return chatService.sendMessage(currentCommunityId, text);
    },
    onSuccess: async (newPost) => {
      if (newPost) {
        queryClient.invalidateQueries({
          queryKey: ["messages", currentCommunityId],
        });
      }
    },
  });

  return {
    ...mutation,
    sendMessage: mutation.mutate,
    sendMessageAsync: mutation.mutateAsync,
  };
}

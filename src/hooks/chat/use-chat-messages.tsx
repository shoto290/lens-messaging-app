"use client";

import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat-service";
import { useChatStore } from "@/stores/chat-store";

export function useChatMessages(communityId: string | null) {
  const { activeCommunity } = useChatStore();
  const currentCommunityId = communityId || activeCommunity?.address;

  const query = useQuery({
    queryKey: ["messages", currentCommunityId],
    queryFn: () => chatService.getMessages(currentCommunityId),
    enabled: !!currentCommunityId,
    refetchInterval: 5000,
  });

  return {
    ...query,
    messages: query.data || [],
  };
}

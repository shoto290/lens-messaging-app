"use client";

import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat-service";

export function useChatMessages(communityFeedAddress: string) {
  const query = useQuery({
    queryKey: ["messages", communityFeedAddress],
    queryFn: () => chatService.getMessages(communityFeedAddress),
    enabled: !!communityFeedAddress,
    refetchInterval: 5000,
  });

  return {
    ...query,
    messages: query.data || [],
  };
}

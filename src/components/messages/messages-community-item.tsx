"use client";

import { useChatStore } from "@/stores/chat-store";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { Community } from "@/services/community-service.types";
import { CommunityItem } from "../community/community-item";

interface MessagesCommunityItemProps {
  community: Community;
}

export function MessagesCommunityItem({
  community,
}: MessagesCommunityItemProps) {
  const setActiveCommunity = useChatStore((state) => state.setActiveCommunity);
  const { setActiveSection } = useNavigation();

  const handleOpenChat = () => {
    setActiveCommunity(community);
    setActiveSection(Section.CHAT);
  };

  return <CommunityItem onClick={handleOpenChat} community={community} />;
}

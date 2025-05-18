"use client";

import { Badge } from "../ui/badge";
import { useChatStore } from "@/stores/chat-store";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { Community } from "@/services/community-service.types";
import { CommunityAvatar } from "../community/community-avatar";

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

  return (
    <div
      className="w-full border-b border-border flex flex-row justify-between items-center p-[16px] hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={handleOpenChat}
    >
      <div className="flex items-center gap-3">
        <CommunityAvatar
          name={community.metadata?.name}
          icon={community.metadata?.icon}
        />
        <div className="flex flex-col">
          <h3 className="text-sm font-bold font-mono">
            {community.metadata?.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            12 new chats • 10 min ago
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge>{12}</Badge>
      </div>
    </div>
  );
}

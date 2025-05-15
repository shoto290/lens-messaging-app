import { Community } from "@/services/community-service.types";
import { Badge } from "../ui/badge";

interface MessagesCommunityItemProps {
  community: Community;
}

export function MessagesCommunityItem({
  community,
}: MessagesCommunityItemProps) {
  return (
    <div className="w-full border-b border-border flex flex-row justify-between items-center p-[16px] hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <img
          className="rounded h-10 aspect-square"
          src={community.image}
          alt={community.name}
        />
        <div className="flex flex-col">
          <h3 className="text-sm font-bold font-mono">{community.name}</h3>
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

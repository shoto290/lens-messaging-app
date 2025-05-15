import { Community } from "@/services/community-service.types";
import { Badge } from "../ui/badge";

interface DiscoverCommunityItemProps {
  community: Community;
}

export function DiscoverCommunityItem({
  community,
}: DiscoverCommunityItemProps) {
  return (
    <div className="w-full border-b border-border flex flex-row justify-between items-center p-[16px] hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <p className="text-xs">#{community.id}</p>
        <img
          className="rounded h-10 aspect-square"
          src={community.image}
          alt={community.name}
        />
        <div className="flex flex-col">
          <h3 className="text-sm font-bold font-mono">{community.name}</h3>
          <p className="text-xs text-muted-foreground">
            {community.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={"outline"}>{275}</Badge>
      </div>
    </div>
  );
}

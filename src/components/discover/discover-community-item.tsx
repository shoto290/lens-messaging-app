import { Community } from "@/services/community-service.types";
import { DiscoverMembersCountBadge } from "./discover-members-count-badge";
import { useCommunityMembers } from "@/hooks/community/use-community-members";
import { CommunityAvatar } from "../community/community-avatar";
import { DiscoverCommunityDrawer } from "./discover-community-drawer";

interface DiscoverCommunityItemProps {
  community: Community;
}

export function DiscoverCommunityItem({
  community,
}: DiscoverCommunityItemProps) {
  const { data: members } = useCommunityMembers(community.address);

  return (
    <DiscoverCommunityDrawer community={community}>
      <div className="w-full border-b border-border flex flex-row justify-between items-center p-[16px] hover:bg-accent/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <CommunityAvatar
            name={community.metadata?.name}
            icon={community.metadata?.icon}
          />
          <div className="flex flex-col">
            <h3 className="text-sm font-bold font-mono truncate whitespace-nowrap max-w-[200px]">
              {community.metadata?.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate whitespace-nowrap max-w-[200px]">
              {community.metadata?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-2">
          <DiscoverMembersCountBadge count={members?.items.length || 0} />
        </div>
      </div>
    </DiscoverCommunityDrawer>
  );
}

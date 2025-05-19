import { Community } from "@/services/community-service.types";
import { DiscoverMembersCountBadge } from "./discover-members-count-badge";
import { useCommunityMembers } from "@/hooks/community/use-community-members";
import { CommunityAvatar } from "../community/community-avatar";
import { DiscoverCommunityDrawer } from "./discover-community-drawer";

interface DiscoverCommunityItemProps {
  community: Community;
}

export function DiscoverCommunitySquareItem({
  community,
}: DiscoverCommunityItemProps) {
  const { data: members } = useCommunityMembers(community.address);

  return (
    <DiscoverCommunityDrawer community={community}>
      <div className="relative bg-secondary overflow-hidden size-60 border-y border-white/20 rounded-lg flex flex-row justify-between items-center hover:bg-accent/50 transition-colors cursor-pointer">
        <CommunityAvatar
          className="size-full object-cover"
          name={community.metadata?.name}
          icon={community.metadata?.icon}
        />
        <div className="absolute z-10 bottom-0 left-0 right-0 flex flex-col items-center gap-3 bg-background/20 backdrop-blur-3xl pt-3">
          <div className="flex flex-row justify-between items-center w-full px-5 pb-3">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold font-mono truncate whitespace-nowrap max-w-[200px]">
                {community.metadata?.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <DiscoverMembersCountBadge count={members?.items.length || 0} />
            </div>
          </div>
        </div>
      </div>
    </DiscoverCommunityDrawer>
  );
}

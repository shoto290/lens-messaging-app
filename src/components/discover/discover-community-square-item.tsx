import { Community } from "@/services/community-service.types";
import { CommunityAvatar } from "../community/community-avatar";
import { DiscoverCommunityDrawer } from "./discover-community-drawer";
import { CommunityMembers } from "../community/community-members";

interface DiscoverCommunityItemProps {
  community: Community;
}

export function DiscoverCommunitySquareItem({
  community,
}: DiscoverCommunityItemProps) {
  return (
    <DiscoverCommunityDrawer community={community}>
      <div className="relative bg-primary p-4 overflow-hidden w-60 rounded-3xl flex flex-col gap-1 items-start hover:opacity-80 transition-opacity cursor-pointer">
        <CommunityAvatar
          className="size-full object-cover"
          name={community.metadata?.name}
          icon={community.metadata?.icon}
        />
        <p className="text-xl font-mono">{community.metadata?.name}</p>
        <CommunityMembers community={community} size="small" type="row" />
      </div>
    </DiscoverCommunityDrawer>
  );
}

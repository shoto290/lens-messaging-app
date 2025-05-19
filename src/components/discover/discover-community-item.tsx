import { Community } from "@/services/community-service.types";
import { DiscoverCommunityDrawer } from "./discover-community-drawer";
import { CommunityItem } from "../community/community-item";

interface DiscoverCommunityItemProps {
  community: Community;
}

export function DiscoverCommunityItem({
  community,
}: DiscoverCommunityItemProps) {
  return (
    <DiscoverCommunityDrawer community={community}>
      <CommunityItem community={community} />
    </DiscoverCommunityDrawer>
  );
}

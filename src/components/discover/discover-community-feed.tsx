import { DiscoverCommunityItem } from "./discover-community-item";
import { useDiscoverCommunities } from "@/hooks/community/use-discover-communities";

export function DiscoverCommunityFeed() {
  const { discoverCommunities } = useDiscoverCommunities();

  return (
    <div className="flex flex-col">
      {discoverCommunities?.map((community) => (
        <DiscoverCommunityItem key={community.address} community={community} />
      ))}
    </div>
  );
}

import { DiscoverCommunityItem } from "./discover-community-item";
import { useDiscoverCommunities } from "@/hooks/community/use-discover-communities";

export function DiscoverCommunityFeed() {
  const { data: communities } = useDiscoverCommunities();

  return (
    <div className="flex flex-col">
      {communities?.map((community) => (
        <DiscoverCommunityItem key={community.id} community={community} />
      ))}
    </div>
  );
}

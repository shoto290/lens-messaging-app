import { useUserCommunities } from "@/hooks/community/use-user-communities";
import { MessagesCommunityItem } from "./messages-community-item";

export function MessagesCommunityFeed() {
  const { data: communities } = useUserCommunities();

  return (
    <div className="flex flex-col">
      {communities?.map((community) => (
        <MessagesCommunityItem key={community.id} community={community} />
      ))}
    </div>
  );
}

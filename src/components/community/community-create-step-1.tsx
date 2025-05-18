import { useCommunityCreateStore } from "@/stores/community-create-store";
import { CommunityCreateGlobalCard } from "./community-create-global-card";

export function CommunityCreateStep1() {
  const { communityInfo } = useCommunityCreateStore();

  return (
    <CommunityCreateGlobalCard
      avatarSrc={communityInfo.avatar}
      name={communityInfo.name}
      bio={communityInfo.description}
    />
  );
}

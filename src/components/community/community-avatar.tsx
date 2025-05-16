import { Community } from "@/services/community-service.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { groveService } from "@/services/grove-service";
import { useMemo } from "react";

interface CommunityAvatarProps {
  community: Community;
}

export function CommunityAvatar({ community }: CommunityAvatarProps) {
  const imageUrl = useMemo(() => {
    return groveService.resolveImage(community.metadata?.icon);
  }, [community.metadata?.icon]);

  return (
    <Avatar className="size-10 bg-secondary">
      <AvatarImage src={imageUrl} />
      <AvatarFallback>
        {community.metadata?.name?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

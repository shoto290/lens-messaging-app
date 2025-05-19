import { Community } from "@/services/community-service.types";
import { CommunityAvatar } from "./community-avatar";
import { CommunityMembers } from "./community-members";

interface CommunityResumeProps {
  community: Community;
  hideMembers?: boolean;
}

export function CommunityResume({
  community,
  hideMembers = false,
}: CommunityResumeProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <CommunityAvatar
        className="size-16"
        name={community.metadata?.name}
        icon={community.metadata?.icon}
      />
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold font-mono">
          {community.metadata?.name}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          {community.metadata?.description}
        </p>
      </div>
      {!hideMembers && <CommunityMembers community={community} />}
    </div>
  );
}

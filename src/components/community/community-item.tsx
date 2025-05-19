import { Community } from "@/services/community-service.types";
import { CommunityAvatar } from "./community-avatar";
import { CommunityMembers } from "./community-members";

interface CommunityItemProps {
  onClick?: () => void;
  community: Community;
}

export function CommunityItem({ onClick, community }: CommunityItemProps) {
  return (
    <div
      className="w-full rounded-3xl  bg-primary flex flex-row justify-between items-center p-3 hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <CommunityAvatar
          className="size-15"
          name={community.metadata?.name}
          icon={community.metadata?.icon}
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold font-mono">
            {community.metadata?.name}
          </h3>
          <CommunityMembers community={community} type="row" size="small" />
        </div>
      </div>
    </div>
  );
}

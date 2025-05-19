import { useCommunityMembers } from "@/hooks/community/use-community-members";
import { UserAvatar } from "../user/user-avatar";
import { Community } from "@/services/community-service.types";
import { cn } from "@/lib/utils";

interface CommunityMembersProps {
  community: Community;
  type?: "row" | "column";
  size?: "small" | "medium";
}

export function CommunityMembers({
  community,
  type = "column",
  size = "medium",
}: CommunityMembersProps) {
  const { data: members } = useCommunityMembers(community.address);

  return (
    <div
      className={cn("flex flex-col items-center gap-1", {
        "flex-row": type === "row",
        "flex-col": type === "column",
      })}
    >
      <div className="flex flex-row -space-x-1">
        {members?.items.slice(0, 5).map((member) => (
          <UserAvatar
            key={member.account.address}
            className={cn("ring-card ", {
              "size-4 ring-2": size === "small",
              "size-6 ring-3": size === "medium",
            })}
            name={member.account.username?.localName}
            icon={member.account.metadata?.picture}
          />
        ))}
      </div>
      <p
        className={cn("text-sm text-muted-foreground", {
          "text-xs": size === "small",
          "text-sm": size === "medium",
        })}
      >
        {members?.items.length} members
      </p>
    </div>
  );
}

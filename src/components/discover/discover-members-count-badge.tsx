import { Icons } from "../icons";
import { Badge } from "../ui/badge";

interface DiscoverMembersCountBadgeProps {
  count: number;
}

export function DiscoverMembersCountBadge({
  count,
}: DiscoverMembersCountBadgeProps) {
  return (
    <Badge variant={"secondary"}>
      <Icons.Users className="size-4" />
      {count}
    </Badge>
  );
}

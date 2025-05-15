import { Badge } from "../ui/badge";

interface DiscoverMembersCountBadgeProps {
  count: number;
}

export function DiscoverMembersCountBadge({
  count,
}: DiscoverMembersCountBadgeProps) {
  return <Badge variant={"outline"}>{count}</Badge>;
}

import { useCommunityCreateStore } from "@/stores/community-create-store";
import { CommunityAvatar } from "./community-avatar";
import { DiscoverMembersCountBadge } from "../discover/discover-members-count-badge";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";

export function CommunityCreateStep2() {
  const { communityInfo } = useCommunityCreateStore();

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Community Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full border border-border rounded-lg flex flex-row justify-between items-center p-3 hover:bg-accent/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <CommunityAvatar
              name={communityInfo.name}
              icon={communityInfo.avatar}
            />
            <div className="flex flex-col">
              <h3 className="text-sm font-bold font-mono truncate whitespace-nowrap max-w-[200px]">
                {communityInfo.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate whitespace-nowrap max-w-[200px]">
                {communityInfo.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <DiscoverMembersCountBadge count={1} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

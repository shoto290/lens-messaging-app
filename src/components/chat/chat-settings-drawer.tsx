import { useLeaveCommunity } from "@/hooks/community/use-leave-community";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Community } from "@/services/community-service.types";
import { useCommunityMembers } from "@/hooks/community/use-community-members";
import { UserAvatar } from "../user/user-avatar";

interface ChatSettingsDrawerProps {
  community: Community;
}

export function ChatSettingsDrawer({ community }: ChatSettingsDrawerProps) {
  const { leaveCommunity, isPending } = useLeaveCommunity({
    communityAddress: community.address,
  });
  const { data: members } = useCommunityMembers(community.address);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="icon">
          <Icons.Ellipsis />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-2 pb-2 space-y-2">
        <DrawerTitle hidden>Settings</DrawerTitle>
        {members?.items.length && members?.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Members ({members?.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              <div className="flex flex-col gap-3">
                {members?.items?.map((member) => (
                  <div key={member.account.address}>
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={member.account.metadata?.name}
                        icon={member.account.metadata?.picture}
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium font-mono">
                          {member.account.metadata?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{member.account.username?.localName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => leaveCommunity()}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Icons.Loader className="size-4 animate-spin" />
              <span>Leaving...</span>
            </>
          ) : (
            "Leave Community"
          )}
        </Button>
      </DrawerContent>
    </Drawer>
  );
}

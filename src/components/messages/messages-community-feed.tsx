import { useUserCommunities } from "@/hooks/community/use-user-communities";
import { MessagesCommunityItem } from "./messages-community-item";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";

export function MessagesCommunityFeed() {
  const { setActiveSection } = useNavigation();
  const { userCommunities, isPending } = useUserCommunities();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-2">
        <Icons.Loader className="size-8 animate-spin" />
        <p className="text-muted-foreground">Loading your communities...</p>
      </div>
    );
  }

  if (!userCommunities?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Icons.Message className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-medium">No communities</h3>
          <p className="text-muted-foreground mt-1">
            You haven&apos;t joined any communities yet.
          </p>
        </div>
        <Button asChild>
          <Button onClick={() => setActiveSection(Section.DISCOVER)}>
            <Icons.Discover className="mr-2 h-4 w-4" />
            Discover communities
          </Button>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 gap-2">
      {userCommunities.map((community) => (
        <MessagesCommunityItem key={community.address} community={community} />
      ))}
    </div>
  );
}

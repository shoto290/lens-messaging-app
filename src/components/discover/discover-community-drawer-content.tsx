"use client";

import { useJoinCommunity } from "@/hooks/community/use-join-community";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { DrawerContent, DrawerFooter } from "../ui/drawer";
import { useCanJoinCommunity } from "@/hooks/community/use-can-join-community";
import { Community } from "@/services/community-service.types";

interface DiscoverCommunityDrawerContentProps {
  community: Community;
  children: React.ReactNode;
}

export function DiscoverCommunityDrawerContent({
  children,
  community,
}: DiscoverCommunityDrawerContentProps) {
  const { joinCommunity, isPending } = useJoinCommunity();
  const { data: canJoinData, isLoading: isCheckingJoinStatus } =
    useCanJoinCommunity(community.address);

  const handleJoinCommunity = () => {
    joinCommunity(community.address);
  };

  const getButtonContent = () => {
    if (isPending) {
      return (
        <>
          Joining...
          <Icons.Loader className="size-4 ml-2 animate-spin" />
        </>
      );
    }

    if (isCheckingJoinStatus) {
      return (
        <>
          Checking...
          <Icons.Loader className="size-4 ml-2 animate-spin" />
        </>
      );
    }

    if (!canJoinData) {
      return "Join the community";
    }

    if (canJoinData.status === "requires-approval") {
      return "Request to join";
    }

    if (canJoinData.status === "not-allowed") {
      return "You can't join this community";
    }

    return "Join the community";
  };

  const isButtonDisabled = () => {
    if (isPending || isCheckingJoinStatus) {
      return true;
    }

    if (!canJoinData) {
      return false;
    }

    return !canJoinData.canJoin;
  };

  return (
    <DrawerContent>
      <div className="px-3">
        <div className="border border-border rounded-xl overflow-hidden">
          {children}
        </div>
      </div>
      <DrawerFooter>
        <Button
          variant="secondary"
          size="rounded"
          className="w-full"
          onClick={handleJoinCommunity}
          disabled={isButtonDisabled()}
        >
          {getButtonContent()}
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

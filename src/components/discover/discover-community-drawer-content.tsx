"use client";

import { useJoinCommunity } from "@/hooks/community/use-join-community";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { DrawerContent, DrawerFooter } from "../ui/drawer";
import { useCanJoinCommunity } from "@/hooks/community/use-can-join-community";
import { Community } from "@/services/community-service.types";
import { useIsCommunityMember } from "@/hooks/community/use-is-member";
import { useChatStore } from "@/stores/chat-store";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";

interface DiscoverCommunityDrawerContentProps {
  community: Community;
  children: React.ReactNode;
}

export function DiscoverCommunityDrawerContent({
  children,
  community,
}: DiscoverCommunityDrawerContentProps) {
  const { joinCommunity, isPending } = useJoinCommunity({ community });
  const { data: canJoinData, isLoading: isCheckingJoinStatus } =
    useCanJoinCommunity(community.address);
  const { data: isMember, isLoading: isCheckingMembership } =
    useIsCommunityMember(community.address);
  const { setActiveCommunity } = useChatStore();
  const { setActiveSection } = useNavigation();

  const handleJoinCommunity = () => {
    joinCommunity();
  };

  const handleGoToChat = () => {
    setActiveCommunity(community);
    setActiveSection(Section.CHAT);
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

    if (isCheckingJoinStatus || isCheckingMembership) {
      return (
        <>
          Checking...
          <Icons.Loader className="size-4 ml-2 animate-spin" />
        </>
      );
    }

    if (isMember) {
      return (
        <>
          Go to chat
          <Icons.ArrowRight className="size-4 ml-2" />
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
    if (isPending || isCheckingJoinStatus || isCheckingMembership) {
      return true;
    }

    if (isMember) {
      return false;
    }

    if (!canJoinData) {
      return false;
    }

    return !canJoinData.canJoin;
  };

  const handleButtonClick = () => {
    if (isMember) {
      handleGoToChat();
    } else {
      handleJoinCommunity();
    }
  };

  return (
    <DrawerContent>
      <div className="px-3 mb-3">{children}</div>
      <DrawerFooter>
        <Button
          variant="secondary"
          size="rounded"
          className="w-full"
          onClick={handleButtonClick}
          disabled={isButtonDisabled()}
        >
          {getButtonContent()}
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

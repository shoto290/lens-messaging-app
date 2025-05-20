/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Token } from "../token/choose-token-drawer";
import { useSwitchChain } from "wagmi";
import { lens } from "viem/chains";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { sleep } from "@/lib/utils";

interface DiscoverCommunityDrawerContentProps {
  community: Community;
  children: React.ReactNode;
  selectedToken: Token;
}

export function DiscoverCommunityDrawerContent({
  children,
  community,
  selectedToken,
}: DiscoverCommunityDrawerContentProps) {
  const { joinCommunity, isPending } = useJoinCommunity({ community });
  const { data: canJoinData, isLoading: isCheckingJoinStatus } =
    useCanJoinCommunity(community.address);
  const { data: isMember, isLoading: isCheckingMembership } =
    useIsCommunityMember(community.address);
  const { setActiveCommunity } = useChatStore();
  const { setActiveSection } = useNavigation();
  const { switchChainAsync } = useSwitchChain();
  const { bridgeAsync, isPending: isBridgePending } = useBridge();

  const handleJoinCommunity = async (token: Token) => {
    if (token.chain.id !== lens.id) {
      await switchChainAsync({
        chainId: token.chain.id,
      });

      await bridgeAsync({
        amount: (community?.rules?.required[0]?.config[3] as any)?.bigDecimal,
      });
    }

    await switchChainAsync({
      chainId: lens.id,
    });

    await sleep(1000);

    joinCommunity({
      token,
      amount: (community?.rules?.required[0]?.config[3] as any)?.bigDecimal,
    });
  };

  const handleGoToChat = () => {
    setActiveCommunity(community);
    setActiveSection(Section.CHAT);
  };

  const getButtonContent = () => {
    if (isBridgePending) {
      return (
        <>
          Bridging...
          <Icons.Loader className="size-4 ml-2 animate-spin" />
        </>
      );
    }
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

    if (
      community.rules.required.some((rule) => rule.type === "SIMPLE_PAYMENT")
    ) {
      return `Pay with ${selectedToken.symbol} on ${selectedToken.chain.name}`;
    }

    return "Join the community";
  };

  const isButtonDisabled = () => {
    if (
      isPending ||
      isCheckingJoinStatus ||
      isCheckingMembership ||
      isBridgePending
    ) {
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
      handleJoinCommunity(selectedToken);
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

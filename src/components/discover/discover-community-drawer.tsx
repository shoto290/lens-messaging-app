/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Community } from "@/services/community-service.types";
import { DiscoverCommunityDrawerContent } from "./discover-community-drawer-content";
import { CommunityResume } from "../community/community-resume";
import { Card, CardContent } from "../ui/card";
import { ChooseTokenDrawer, Token } from "../token/choose-token-drawer";
import { base, lens } from "viem/chains";
import { useState } from "react";

interface DiscoverCommunityDrawerProps {
  children: React.ReactNode;
  community: Community;
}

const tokens: Token[] = [
  {
    name: "USDC",
    symbol: "USDC",
    image: "/images/usdc.svg",
    address: "0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884",
    chain: lens,
  },
  {
    name: "USDC",
    symbol: "USDC",
    image: "/images/usdc.svg",
    address: "0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884",
    chain: base,
  },
];

export function DiscoverCommunityDrawer({
  children,
  community,
}: DiscoverCommunityDrawerProps) {
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0]);

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle hidden className="text-center">
          Join community
        </DrawerTitle>
        <DiscoverCommunityDrawerContent
          community={community}
          selectedToken={selectedToken}
        >
          <CommunityResume community={community} />
          {community?.rules?.required?.map((rule) => {
            if (rule.type === "SIMPLE_PAYMENT") {
              return (
                <Card className="bg-transparentw-full mt-4" key={rule.id}>
                  <CardContent>
                    <p className="text-lg font-medium">One-time payment</p>

                    <p className="text-3xl text-blue-600 font-medium mb-4">
                      {(rule.config[3] as any).bigDecimal}{" "}
                      {(rule.config[2] as any).string}
                    </p>

                    <ChooseTokenDrawer
                      tokens={tokens}
                      selectedToken={selectedToken}
                      onSelect={setSelectedToken}
                    />
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </DiscoverCommunityDrawerContent>
      </DrawerContent>
    </Drawer>
  );
}

import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Icons } from "../icons";
import { Address, Chain } from "viem";
import { base, lens } from "viem/chains";

export interface Token {
  name: string;
  symbol: string;
  image: string;
  address: Address;
  chain: Chain;
}

interface ChooseTokenDrawerProps {
  tokens: Token[];
  selectedToken: Token;
  onSelect: (token: Token) => void;
}

export function ChooseTokenDrawer({
  tokens,
  selectedToken,
  onSelect,
}: ChooseTokenDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <TokenRow token={selectedToken} />
      </DrawerTrigger>
      <DrawerContent className="flex flex-col gap-2 pb-4">
        <DrawerTitle hidden>Choose a token</DrawerTitle>
        {tokens.map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            onClick={() => {
              onSelect(token);
              setIsOpen(false);
            }}
          />
        ))}
      </DrawerContent>
    </Drawer>
  );
}

const TokenRow = ({
  token,
  onClick,
}: {
  token: Token;
  onClick?: () => void;
}) => {
  const networkIcon = useMemo(() => {
    switch (token.chain.id) {
      case lens.id:
        return "/images/lens.jpg";
      case base.id:
        return "/images/base.png";
    }
  }, [token]);

  return (
    <Button
      className="w-full flex justify-between items-center p-2 h-16 rounded-xl"
      variant={"outline"}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <img
            src={token.image}
            alt={token.name}
            className="size-10 rounded-sm"
          />
          <img
            src={networkIcon}
            alt="Network"
            className="size-4 rounded-full ring-2 ring-background absolute -bottom-0 -right-[1px]"
          />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium">{token.name}</p>
          <p className="text-xs text-muted-foreground">{token.chain.name}</p>
        </div>
      </div>
      <Icons.ChevronRight className="size-4" />
    </Button>
  );
};

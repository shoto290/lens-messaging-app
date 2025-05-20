import { useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Icons } from "../icons";
import { Address } from "viem";

export interface Token {
  name: string;
  symbol: string;
  image: string;
  address: Address;
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
  return (
    <Button
      className="w-full flex justify-between items-center p-2 h-16 rounded-lg"
      variant={"outline"}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <img
          src={token.image}
          alt={token.name}
          className="size-10 rounded-sm"
        />
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium">{token.name}</p>
          <p className="text-xs text-muted-foreground">{token.symbol}</p>
        </div>
      </div>
      <Icons.ChevronRight className="size-4" />
    </Button>
  );
};

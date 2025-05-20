import { Button } from "../ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "../ui/card";
import { ChooseTokenDrawer, Token } from "../token/choose-token-drawer";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useCommunityOneTimeAccess } from "@/hooks/community/use-community-one-time-access";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

const tokens: Token[] = [
  // {
  //   name: "GHO",
  //   symbol: "WGHO",
  //   image: "/images/gho.png",
  //   address: "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F",
  // },
  {
    name: "USDC",
    symbol: "USDC",
    image: "/images/usdc.svg",
    address: "0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884",
  },
];

export function CommunityCreateOneTimeAccess() {
  const [amount, setAmount] = useState(0);
  const [token, setToken] = useState<Token>(tokens[0]);
  const [enabled, setEnabled] = useState(false);

  const { updateOneTimeAccess, cancelOneTimeAccess } =
    useCommunityOneTimeAccess();

  useEffect(() => {
    if (enabled) {
      updateOneTimeAccess({
        token,
        amount,
      });
    } else {
      cancelOneTimeAccess();
      setAmount(0);
      setToken(tokens[0]);
    }
  }, [token, amount, enabled]);

  return (
    <Card className={cn("relative", !enabled && "opacity-50")}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          One-time access price
        </CardTitle>
        <CardAction>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            className="data-[state=checked]:bg-primary"
          />
        </CardAction>
      </CardHeader>
      <CardContent className="w-full space-y-2">
        <ChooseTokenDrawer
          tokens={tokens}
          selectedToken={token}
          onSelect={(token) => setToken(token)}
        />
        <AmountInput amount={amount} setAmount={setAmount} token={token} />
      </CardContent>
    </Card>
  );
}

const AmountInput = ({
  amount,
  setAmount,
  token,
}: {
  amount: number;
  setAmount: (amount: number) => void;
  token: Token;
}) => {
  const onClick = (amount: number) => {
    setAmount(amount);
  };

  return (
    <Card>
      <CardContent>
        <Input
          className="bg-transparent border-none shadow-none text-center text-xl my-4"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="flex gap-2 justify-center items-center">
          <Button
            className="text-xs p-1 h-7"
            variant={"outline"}
            onClick={() => onClick(1)}
          >
            1 {token.symbol}
          </Button>
          <Button
            className="text-xs p-1 h-7"
            variant={"outline"}
            onClick={() => onClick(5)}
          >
            5 {token.symbol}
          </Button>
          <Button
            className="text-xs p-1 h-7"
            variant={"outline"}
            onClick={() => onClick(10)}
          >
            10 {token.symbol}
          </Button>
          <Button
            className="text-xs p-1 h-7"
            variant={"outline"}
            onClick={() => onClick(20)}
          >
            20 {token.symbol}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import { useAccount } from "@/hooks/use-account";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Navbar } from "./navbar";
import { Icons } from "../icons";
import { useDisconnect } from "@/hooks/use-disconnect";

export function AppNavbar() {
  const { disconnect } = useDisconnect();
  const { account } = useAccount();

  return (
    <Navbar>
      <Button className="size-[32px]" variant="ghost">
        <Icons.Discover className="size-fit" />
      </Button>
      <Button className="size-[32px]" variant="ghost">
        <Icons.Message className="size-fit" />
      </Button>
      <Button className="size-[32px]" variant="ghost">
        <Icons.Create className="size-fit" />
      </Button>
      <Button
        onClick={() => disconnect()}
        className="size-[32px]"
        variant="ghost"
      >
        <Avatar>
          <AvatarImage src={account?.account.metadata?.picture} alt="@shadcn" />
          <AvatarFallback>{account?.account.metadata?.name}</AvatarFallback>
        </Avatar>
      </Button>
    </Navbar>
  );
}

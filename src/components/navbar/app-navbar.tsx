"use client";

import { useAccount } from "@/hooks/use-account";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Navbar } from "./navbar";
import { useDisconnect } from "@/hooks/use-disconnect";
import { NAVBAR_ITEMS } from "@/lib/constants/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  const { disconnect } = useDisconnect();
  const { account } = useAccount();
  const pathname = usePathname();

  return (
    <Navbar>
      {NAVBAR_ITEMS.map((item) => (
        <Link key={item.id} href={item.href}>
          <Button
            className={cn(
              "size-[32px]",
              "relative",
              "group",
              "transition-colors",
              pathname.includes(item.id) && "bg-accent"
            )}
            variant="ghost"
            aria-label={item.label}
          >
            <item.icon
              className={cn(
                "size-fit",
                pathname.includes(item.id)
                  ? "stroke-foreground"
                  : "stroke-muted-foreground"
              )}
            />
          </Button>
        </Link>
      ))}
      <Button
        onClick={() => disconnect()}
        className="size-[32px]"
        variant="ghost"
        aria-label="Profile"
      >
        <Avatar>
          <AvatarImage src={account?.account.metadata?.picture} alt="Profile" />
          <AvatarFallback>
            {account?.account.metadata?.name?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      </Button>
    </Navbar>
  );
}

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

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Navbar>
      {NAVBAR_ITEMS.map((item) => {
        const active = isActive(item.href);

        return (
          <Link key={item.id} href={item.href}>
            <Button
              className={cn(
                "size-[32px]",
                "relative",
                "group",
                "transition-colors",
                active && "bg-accent"
              )}
              variant="ghost"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "size-fit transition-all",
                  active
                    ? "stroke-foreground"
                    : "stroke-muted-foreground opacity-60 group-hover:opacity-80"
                )}
              />
              {active && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Button>
          </Link>
        );
      })}
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

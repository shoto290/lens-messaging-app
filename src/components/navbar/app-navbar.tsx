"use client";

import { useAccount } from "@/hooks/use-account";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Navbar } from "./navbar";
import { useDisconnect } from "@/hooks/use-disconnect";
import { NAVBAR_ITEMS } from "@/lib/constants/navigation";
import { useNavigation } from "@/stores/navigation-store";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  const { disconnect } = useDisconnect();
  const { account } = useAccount();
  const { activeSection, setActiveSection } = useNavigation();

  return (
    <Navbar>
      {NAVBAR_ITEMS.map((item) => {
        const active = activeSection === item.section;

        return (
          <Button
            key={item.id}
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
            onClick={() => setActiveSection(item.section)}
          >
            <item.icon
              className={cn(
                "size-fit transition-all",
                active
                  ? "stroke-foreground"
                  : "stroke-muted-foreground opacity-60 group-hover:opacity-80"
              )}
            />
          </Button>
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

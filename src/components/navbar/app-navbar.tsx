"use client";

import { Button } from "../ui/button";
import { Navbar } from "./navbar";
import { NAVBAR_ITEMS } from "@/lib/constants/navigation";
import { useNavigation } from "@/stores/navigation-store";
import { cn } from "@/lib/utils";
import { SettingsDrawer } from "../settings/settings-drawer";

export function AppNavbar() {
  const { activeSection, setActiveSection } = useNavigation();

  return (
    <>
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
        <SettingsDrawer />
      </Navbar>
    </>
  );
}

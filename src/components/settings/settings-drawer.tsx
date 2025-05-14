"use client";

import { useCallback, useRef } from "react";
import { useAccount } from "@/hooks/use-account";
import { useDisconnect } from "@/hooks/use-disconnect";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { NotificationSettingsCard } from "./notification-settings-card";
import {
  ProfileSettingsCard,
  ProfileSettingsCardHandle,
} from "./profile-settings-card";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const { account } = useAccount();
  const { disconnect } = useDisconnect();

  // Reference to the profile component to trigger save when drawer closes
  const profileRef = useRef<ProfileSettingsCardHandle | null>(null);

  // Handle drawer close - save profile data
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      // If drawer is closing, save profile data
      if (!isOpen && profileRef.current) {
        profileRef.current.saveProfile();
      }

      // Propagate change to parent
      onOpenChange(isOpen);
    },
    [onOpenChange]
  );

  function handleLogout() {
    disconnect();
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerTitle hidden className="text-center">
          Settings
        </DrawerTitle>
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto px-4">
            <div className="space-y-4 pb-4 pt-1">
              <ProfileSettingsCard
                avatarSrc={account?.account.metadata?.picture}
                name={account?.account.metadata?.name || ""}
                bio={account?.account.metadata?.bio || ""}
                ref={profileRef}
              />
              <NotificationSettingsCard />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                variant="secondary"
                size="rounded"
                className="w-full"
                onClick={handleLogout}
              >
                <Icons.Door className="size-4" />
                Log out
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

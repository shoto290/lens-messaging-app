"use client";

import { useState } from "react";
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
import { ProfileSettingsCard } from "./profile-settings-card";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const { account } = useAccount();
  const { disconnect } = useDisconnect();
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(
    account?.account.metadata?.picture
  );

  function handleEditPhoto() {
    console.log("Edit photo clicked");
  }

  function handleRemovePhoto() {
    setAvatarSrc(undefined);
  }

  function handleLogout() {
    disconnect();
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerTitle hidden className="text-center">
          Settings
        </DrawerTitle>
        <div className="px-3 space-y-3">
          <ProfileSettingsCard
            avatarSrc={avatarSrc}
            name={account?.account.metadata?.name || ""}
            bio={account?.account.metadata?.bio || ""}
            onEditPhoto={handleEditPhoto}
            onRemovePhoto={handleRemovePhoto}
          />
          <NotificationSettingsCard />
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
      </DrawerContent>
    </Drawer>
  );
}

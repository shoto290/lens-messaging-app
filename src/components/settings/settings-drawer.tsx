"use client";

import { useAccount } from "@/hooks/use-account";
import { useDisconnect } from "@/hooks/use-disconnect";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { ProfileSettingsCard } from "./profile-settings-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function SettingsDrawer() {
  const { account } = useAccount();
  const { disconnect } = useDisconnect();

  function handleLogout() {
    disconnect();
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="size-[32px]" variant="ghost" aria-label="Profile">
          <Avatar className="rounded-full">
            <AvatarImage
              src={account?.account.metadata?.picture}
              alt="Profile"
            />
            <AvatarFallback>
              {account?.account.metadata?.name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle hidden className="text-center">
          Settings
        </DrawerTitle>
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto px-4">
            <div className="space-y-4 pt-1">
              <ProfileSettingsCard
                avatarSrc={account?.account.metadata?.picture}
                name={account?.account.metadata?.name || ""}
                bio={account?.account.metadata?.bio || ""}
              />
              {/* <NotificationSettingsCard /> */}
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

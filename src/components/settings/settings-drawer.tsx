"use client";

import { useAccount } from "@/hooks/use-account";
import { useDisconnect } from "@/hooks/use-disconnect";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { ProfileSettingsCard } from "./profile-settings-card";
import { UserAvatar } from "../user/user-avatar";

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
          <UserAvatar
            icon={account?.metadata?.picture ?? ""}
            name={account?.metadata?.name ?? ""}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Edit lens profile</DrawerTitle>
          <DrawerDescription>
            <p>
              Personalize{" "}
              <span className="text-blue-600">
                @{account?.username?.localName}
              </span>
            </p>
            <p>Add name, bio and an image to your account</p>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            <div className="space-y-3 pt-1">
              <ProfileSettingsCard
                avatarSrc={account?.metadata?.picture}
                name={account?.metadata?.name || ""}
                bio={account?.metadata?.bio || ""}
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
                Log out
                <Icons.LogOut className="size-4" />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

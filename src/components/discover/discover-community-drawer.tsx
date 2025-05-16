import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Community } from "@/services/community-service.types";
import { DiscoverCommunityDrawerContent } from "./discover-community-drawer-content";

interface DiscoverCommunityDrawerProps {
  children: React.ReactNode;
  community: Community;
}

export function DiscoverCommunityDrawer({
  children,
  community,
}: DiscoverCommunityDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle hidden className="text-center">
          Join community
        </DrawerTitle>
        <DiscoverCommunityDrawerContent community={community}>
          {children}
        </DiscoverCommunityDrawerContent>
      </DrawerContent>
    </Drawer>
  );
}

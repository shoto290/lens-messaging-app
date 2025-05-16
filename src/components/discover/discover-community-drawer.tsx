import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

interface DiscoverCommunityDrawerProps {
  children: React.ReactNode;
}

export function DiscoverCommunityDrawer({
  children,
}: DiscoverCommunityDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle hidden className="text-center">
          Join community
        </DrawerTitle>
        <DrawerContent>
          <div className="px-3">
            <div className="border border-border rounded-xl overflow-hidden">
              {children}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary" size="rounded" className="w-full">
                Join the community
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerContent>
    </Drawer>
  );
}

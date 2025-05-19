"use client";

import { ConnectKitButton } from "connectkit";
import { Navbar } from "./navbar";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useLensAuthentication } from "@/hooks/lens/use-lens-authentication";
import { useDisconnect } from "@/hooks/use-disconnect";
import { useAccount as useWagmiAccount } from "wagmi";
import { ChooseProfile } from "../profile/choose-profile";
import { Drawer } from "../ui/drawer";
import { DrawerContent } from "../ui/drawer";

export function ConnectNavbar() {
  const { isConnected } = useWagmiAccount();
  const { isAuthenticated, loginAsync, isPending } = useLensAuthentication();
  const { disconnect } = useDisconnect();

  const handleLogin = (lensAccountAddress: string): Promise<boolean> => {
    return loginAsync(lensAccountAddress);
  };

  if (isConnected && !isAuthenticated) {
    return (
      <Drawer open={true} onOpenChange={() => {}}>
        <DrawerContent>
          <ChooseProfile
            login={handleLogin}
            isPending={isPending}
            disconnect={disconnect}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Navbar className="border-0 px-0">
      <ConnectKitButton.Custom>
        {({ show, isConnecting }) =>
          !isConnected ? (
            <Button
              className="w-full"
              onClick={show}
              disabled={isConnecting || isConnected || isPending}
            >
              {!isConnecting ? (
                <>
                  Connect Wallet
                  <Icons.ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  Connect Wallet
                  <Icons.Loader className="size-4 animate-spin " />
                </>
              )}
            </Button>
          ) : isConnected && !isAuthenticated ? (
            <ChooseProfile
              login={handleLogin}
              isPending={isPending}
              disconnect={disconnect}
            />
          ) : (
            <Button className="w-full" onClick={show}>
              Loading...
              <Icons.Loader className="size-4 animate-spin" />
            </Button>
          )
        }
      </ConnectKitButton.Custom>
    </Navbar>
  );
}

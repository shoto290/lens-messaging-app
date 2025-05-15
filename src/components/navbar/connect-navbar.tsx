"use client";

import { ConnectKitButton } from "connectkit";
import { Navbar } from "./navbar";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useLensAuthentication } from "@/hooks/lens/use-lens-authentication";
import { useDisconnect } from "@/hooks/use-disconnect";
import { useAccount as useWagmiAccount } from "wagmi";

export function ConnectNavbar() {
  const { isConnected } = useWagmiAccount();
  const { isAuthenticated, login, isPending } = useLensAuthentication();
  const { disconnect } = useDisconnect();

  return (
    <Navbar>
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
            <div className="w-full flex gap-2">
              <Button
                className="w-full flex-1"
                onClick={() => login()}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Authenticating with Lens
                    <Icons.Loader className="size-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Authenticate with Lens
                    <Icons.ArrowRight className="size-4" />
                  </>
                )}
              </Button>
              <Button
                variant={"outline"}
                className="w-fit"
                onClick={() => disconnect()}
                disabled={isPending}
              >
                <Icons.Door className="size-4" />
              </Button>
            </div>
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

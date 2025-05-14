"use client";

import { ConnectKitButton } from "connectkit";
import { Navbar } from "./navbar";
import { Button } from "../ui/button";
import { Icons } from "../icons";

export function ConnectNavbar() {
  return (
    <Navbar>
      <ConnectKitButton.Custom>
        {({ isConnected, show, isConnecting }) => (
          <Button
            className="w-full"
            onClick={show}
            disabled={isConnecting || isConnected}
          >
            {!isConnected ? (
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
        )}
      </ConnectKitButton.Custom>
    </Navbar>
  );
}

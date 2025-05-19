import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { useLensAccounts } from "@/hooks/lens/use-lens-accounts";
import { AccountAvailable } from "@lens-protocol/client";
import { UserAvatar } from "../user/user-avatar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CreateProfile } from "./create-profile";

interface ChooseProfileProps {
  login: (lensAccountAddress: string) => Promise<boolean>;
  isPending: boolean;
  disconnect: () => void;
}

export function ChooseProfile({
  login,
  isPending,
  disconnect,
}: ChooseProfileProps) {
  const [wantToCreateAccount, setWantToCreateAccount] = useState(false);
  const { data: accounts, isLoading } = useLensAccounts();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const handleLogin = async (address: string) => {
    try {
      setSelectedAccount(address);
      await login(address);
    } catch (error) {
      console.error(error);
      toast.error("Failed to login with Lens account");
    } finally {
      setSelectedAccount(null);
    }
  };

  useEffect(() => {
    if (accounts && accounts.length === 0) {
      setWantToCreateAccount(true);
    }
  }, [accounts]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-4">
        <Icons.Loader className="size-8 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Loading Lens accounts...
        </p>
      </div>
    );
  }

  if (wantToCreateAccount) {
    return (
      <CreateProfile
        setWantToCreateAccount={setWantToCreateAccount}
        newUser={accounts?.length === 0}
        disconnect={disconnect}
      />
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {accounts && accounts.length > 0 && (
        <>
          <div className="flex flex-col gap-1 items-center text-center mb-6 mt-3">
            <h2 className="text-xl font-medium font-mono pl-1">
              Choose a Lens Profile
            </h2>
            <p className="text-xs text-muted-foreground">
              Pick an existing profile or create a new one.
            </p>
          </div>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4">
            {accounts.map(({ account }: AccountAvailable) => (
              <Button
                key={account.address}
                variant="secondary"
                className={cn(
                  "relative w-full justify-start gap-2 py-3.5 px-5 h-fit"
                )}
                onClick={() => handleLogin(account.address)}
                disabled={isPending}
              >
                <div className="flex items-center gap-5 w-full">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserAvatar
                      className="size-12"
                      icon={account.metadata?.picture}
                      name={account.metadata?.name}
                    />
                  </div>
                  <div className="flex-1 text-left ">
                    <p className="text-lg font-bold font-mono">
                      {account.metadata?.name || "Unnamed Profile"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate font-sans">
                      @{account.username?.localName}
                    </p>
                  </div>
                </div>
                {selectedAccount === account.address && isPending && (
                  <div className="absolute right-4 top-0 bottom-0 flex items-center justify-center">
                    <Icons.Loader className="size-4 animate-spin" />
                  </div>
                )}
              </Button>
            ))}{" "}
            <Button
              variant="link"
              className="w-full justify-start gap-2"
              disabled={isPending}
              onClick={() => setWantToCreateAccount(true)}
            >
              <Icons.UserPlus />
              <p>Create a new profile</p>
            </Button>
          </div>
          <Button
            size="rounded"
            variant="secondary"
            className="w-full"
            onClick={() => disconnect()}
            disabled={isPending}
          >
            Change wallet
            <Icons.Wallet />
          </Button>
        </>
      )}
    </div>
  );
}

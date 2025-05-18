import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { useLensAccounts } from "@/hooks/lens/use-lens-accounts";
import { AccountAvailable } from "@lens-protocol/client";
import { UserAvatar } from "../user/user-avatar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

  return (
    <div className="w-full flex flex-col gap-2">
      {accounts && accounts.length > 0 ? (
        <>
          <h2 className="font-medium font-mono pl-1">Select a Lens account</h2>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {accounts.map(({ account }: AccountAvailable) => (
              <Button
                key={account.address}
                variant="outline"
                className={cn(
                  "relative w-full justify-start gap-2 py-3.5  px-4 h-fit"
                )}
                onClick={() => handleLogin(account.address)}
                disabled={isPending}
              >
                <div className="flex items-center gap-5 w-full">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserAvatar className="size-12" account={account} />
                  </div>
                  <div className="flex-1 text-left space-y-1">
                    <p className="font-bold font-mono">
                      {account.metadata?.name || "Unnamed Profile"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
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
            ))}
          </div>
          <Button
            size="rounded"
            variant="secondary"
            className="w-full"
            onClick={() => disconnect()}
            disabled={isPending}
          >
            Change wallet
          </Button>
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <p className="font-medium">No Lens accounts found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new account to continue
            </p>
          </div>
          <Button className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                Creating Lens account
                <Icons.Loader className="size-4 ml-2 animate-spin" />
              </>
            ) : (
              <>
                Create Lens account
                <Icons.Create className="size-4 ml-2" />
              </>
            )}
          </Button>
          <Button
            size="rounded"
            variant="secondary"
            className="w-full"
            onClick={() => disconnect()}
            disabled={isPending}
          >
            Change wallet
          </Button>
        </>
      )}
    </div>
  );
}

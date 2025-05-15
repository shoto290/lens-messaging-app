import { Button } from "@/components/ui/button";
import { useLensAuthentication } from "@/hooks/lens/use-lens-authentication";
import { useAccount } from "@/hooks/use-account";
import { useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function LensAuthOverlay() {
  const { isLoggedIn } = useAccount();
  const { loginAsync, isPending } = useLensAuthentication();
  const { connect } = useConnect();
  const [error, setError] = useState<string | null>(null);

  const handleAuthenticate = async () => {
    try {
      setError(null);

      if (!isLoggedIn) {
        connect({ connector: injected() });
        return;
      }

      const success = await loginAsync();

      if (!success) {
        setError("Failed to authenticate with Lens");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Error connecting to Lens. Please try again.");
    }
  };

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-background/80 flex flex-col items-center justify-center rounded-xl">
      <div className="text-center space-y-4 p-6">
        <h3 className="text-xl font-semibold">Lens Authentication Required</h3>
        <p className="text-muted-foreground">
          Please authenticate with Lens Protocol to update your profile settings
        </p>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button
          onClick={handleAuthenticate}
          disabled={isPending}
          className="mt-2"
        >
          {isPending
            ? "Authenticating..."
            : isLoggedIn
            ? "Connect to Lens"
            : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
}

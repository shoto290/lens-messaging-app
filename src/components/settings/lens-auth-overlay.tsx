import { Button } from "@/components/ui/button";
import { useLensAuthentication } from "@/hooks/use-lens-authentication";
import { useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function LensAuthOverlay() {
  const { login, isAuthenticating, isConnected, address } =
    useLensAuthentication();
  const { connect } = useConnect();
  const [error, setError] = useState<string | null>(null);

  const handleAuthenticate = async () => {
    try {
      setError(null);

      // If not connected to wallet, connect first
      if (!isConnected || !address) {
        connect({ connector: injected() });
        return;
      }

      // Now authenticate with Lens
      const success = await login();

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
          disabled={isAuthenticating}
          className="mt-2"
        >
          {isAuthenticating
            ? "Authenticating..."
            : isConnected
            ? "Connect to Lens"
            : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
}

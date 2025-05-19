"use client";

import { useAccount } from "@/hooks/use-account";
import { LoadingPage } from "@/components/pages/loading-page";

export default function RootLayout({
  login,
  app,
}: Readonly<{
  login: React.ReactNode;
  app: React.ReactNode;
}>) {
  const { initialized, hasAccount } = useAccount();

  if (!initialized) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col h-dvh">
      <div className="relative flex-1 w-full max-w-lg mx-auto">
        {hasAccount ? app : login}
      </div>
    </div>
  );
}
